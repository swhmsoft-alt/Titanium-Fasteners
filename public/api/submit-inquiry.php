<?php
/**
 * submit-inquiry.php — 询盘落盘端点（纯落盘，不发送邮件）
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 本站是 Astro 静态产物（SSG），没有服务端进程。询盘表单原本只能把纯文本
 * POST 到一个 webhook 或降级为 mailto:，**收不到附件**（BOM / 2D 图纸 / STEP）。
 * 本脚本是唯一的 PHP 落点：
 *   1. 接收 multipart/form-data（也兼容 application/json 的纯文本询盘）；
 *   2. 用 finfo 读取**真实** MIME 校验附件，完全忽略浏览器上报的类型；
 *   3. 附件随机重命名后存到 Web 根目录**之外**的 secure_uploads/；
 *   4. 表单字段与附件元数据写入 secure_data/inquiries.json（flock 排他锁）；
 *   5. 把不含附件的字段转发到既有的 /api/inquiry 承接端点（保持原有通知链路）。
 *
 * DEPLOYMENT
 * ----------
 * 本文件位于 public/api/ → 构建后出现在 dist/api/ → 部署到 cPanel 的
 * public_html/api/submit-inquiry.php，对外路径 /api/submit-inquiry.php。
 *
 * 存储目录取 dirname(__DIR__, 2)：线上 = public_html/../（账户根目录，在 Web 根
 * 之外）；本地 = 仓库根目录。两条路径下 secure_uploads/ 与 secure_data/ 都在
 * public_html 之外，因此即便有人绕过本脚本直接猜 URL 也取不到文件。
 *
 * 依赖：PHP 7.4+（用到 finfo、random_bytes、JSON_UNESCAPED_UNICODE）。
 */

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

/* ── 1. 基础配置 ───────────────────────────────────────────────────────── */

/** 真实 MIME → 落盘扩展名 白名单。.step / .dwg 在多数主机上被识别为
 *  application/octet-stream 或 text/plain，故一并放行并按原扩展名归档。 */
const ALLOWED_MIME = [
    'application/pdf'                                                   => 'pdf',
    'text/csv'                                                          => 'csv',
    'text/plain'                                                        => 'txt',
    'application/vnd.ms-excel'                                         => 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' => 'xlsx',
    'application/vnd.oasis.opendocument.spreadsheet'                    => 'ods',
    'application/octet-stream'                                          => 'bin',
    'application/step'                                                  => 'step',
    'application/x-step'                                                 => 'step',
    'application/acad'                                                  => 'dwg',
    'image/vnd.dwg'                                                     => 'dwg',
    'application/x-dwg'                                                 => 'dwg',
    'image/jpeg'                                                        => 'jpg',
    'image/png'                                                         => 'png',
];

/** 允许的扩展名（第二道闸：MIME 宽泛时靠它收口）。 */
const ALLOWED_EXT = [
    'pdf', 'csv', 'txt', 'xls', 'xlsx', 'ods', 'step', 'stp', 'iges', 'igs',
    'dwg', 'dxf', 'zip', 'jpg', 'jpeg', 'png',
];

/** 单文件上限 20MB。需与 cPanel 的 upload_max_filesize 对齐。 */
const MAX_FILE_BYTES = 20 * 1024 * 1024;

/** 承接端点（转发字段，保持站内原有通知链路）。 */
const FORWARD_ENDPOINT = 'https://fastener.bozemetal.com/api/inquiry';

/** 存储根目录：public_html 之外。 */
const STORAGE_ROOT = dirname(__DIR__, 2);
const UPLOAD_DIR = STORAGE_ROOT . '/secure_uploads/inquiries';
const DATA_DIR = STORAGE_ROOT . '/secure_data';
const DATA_FILE = DATA_DIR . '/inquiries.json';

/* ── 2. 工具函数 ───────────────────────────────────────────────────────── */

/** 统一 JSON 响应并结束请求。 */
function respond(int $status, array $body): void
{
    http_response_code($status);
    echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/** 只保留可打印字符并截断长度，用于把自由文本安全写进 JSON。 */
function cleanText($value, int $max = 4000): string
{
    $text = is_string($value) ? $value : '';
    $text = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $text) ?? '';
    $text = trim($text);
    if (function_exists('mb_substr')) {
        return mb_substr($text, 0, $max, 'UTF-8');
    }
    return substr($text, 0, $max);

/* ── 3. 请求方法校验 ───────────────────────────────────────────────────── */

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'msg' => 'Only POST is accepted.']);
}

/* ── 4. 解析请求体（multipart 或 JSON） ───────────────────────────────── */

$contentType = $_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '';
$fields = [];
$files = [];

if (stripos($contentType, 'application/json') !== false) {
    $raw = file_get_contents('php://input');
    $decoded = json_decode(is_string($raw) ? $raw : '', true);
    if (!is_array($decoded)) {
        respond(400, ['ok' => false, 'msg' => 'Malformed JSON body.']);
    }
    $fields = $decoded;
} else {
    $fields = $_POST;
    $files = $_FILES;
}

/* ── 5. 蜜罐（机器人静默丢弃，不暴露风控规则） ───────────────────────── */

if (isset($fields['website']) && cleanText($fields['website'], 200) !== '') {
    respond(200, [
        'ok'  => true,
        'msg' => 'Inquiry received.',
        'id'  => 'RFQ-' . strtoupper(bin2hex(random_bytes(4))),
    ]);
}

/* ── 6. 字段校验 ───────────────────────────────────────────────────────── */

$email = cleanText($fields['email'] ?? ($fields['contact']['email'] ?? ''), 200);
$company = cleanText($fields['company'] ?? ($fields['contact']['company'] ?? ''), 200);
$requirement = cleanText($fields['requirement'] ?? '', 4000);
$intent = cleanText($fields['intent'] ?? '', 100);
$source = cleanText($fields['source'] ?? 'unknown', 100);
$pageUrl = cleanText($fields['pageUrl'] ?? '', 300);
$quantity = cleanText($fields['quantity'] ?? '', 100);
// product 上下文：族页岛以 JSON 字符串发送，contact 页可能直接给数组。
$product = $fields['product'] ?? [];
if (is_string($product)) {
    $decodedProduct = json_decode($product, true);
    $product = is_array($decodedProduct) ? $decodedProduct : [];
}
$product = is_array($product) ? $product : [];

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(400, ['ok' => false, 'msg' => 'A valid work e-mail address is required.']);
}
if ($requirement === '') {
    respond(400, ['ok' => false, 'msg' => 'A short project brief is required.']);
}

/* ── 7. 附件校验与落盘 ─────────────────────────────────────────────────── */

$storedFiles = [];

if (isset($files['attachment']) && is_array($files['attachment']['name'] ?? null)) {
    $count = count($files['attachment']['name']);
    for ($i = 0; $i < $count; $i++) {
        $err = $files['attachment']['error'][$i] ?? UPLOAD_ERR_NO_FILE;
        if ($err === UPLOAD_ERR_NO_FILE) {
            continue;
        }
        if ($err !== UPLOAD_ERR_OK) {
            respond(400, ['ok' => false, 'msg' => 'File upload failed (code ' . (int) $err . ').']);
        }

        $tmp = (string) ($files['attachment']['tmp_name'][$i] ?? '');
        $original = (string) ($files['attachment']['name'][$i] ?? '');
        $size = (int) ($files['attachment']['size'][$i] ?? 0);

        if ($tmp === '' || !is_uploaded_file($tmp)) {
            respond(400, ['ok' => false, 'msg' => 'Uploaded file could not be verified.']);
        }
        if ($size <= 0 || $size > MAX_FILE_BYTES) {
            respond(413, ['ok' => false, 'msg' => 'Each attachment must be between 1 byte and 20 MB.']);
        }

        // 扩展名闸门
        $ext = strtolower(pathinfo($original, PATHINFO_EXTENSION));
        if (!in_array($ext, ALLOWED_EXT, true)) {
            respond(415, ['ok' => false, 'msg' => 'Attachment type .' . $ext . ' is not accepted.']);
        }

        // 真实 MIME 闸门：完全不信任浏览器上报的类型
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $realMime = (string) $finfo->file($tmp);
        if (!array_key_exists($realMime, ALLOWED_MIME)) {
            respond(415, ['ok' => false, 'msg' => 'Attachment content type ' . $realMime . ' is not accepted.']);
        }

        // 随机重命名：丢弃用户提供的任何名称片段
        $storedName = bin2hex(random_bytes(16)) . '.' . $ext;

        if (!is_dir(UPLOAD_DIR) && !mkdir(UPLOAD_DIR, 0750, true) && !is_dir(UPLOAD_DIR)) {
            respond(500, ['ok' => false, 'msg' => 'Upload storage is unavailable.']);
        }
        if (!is_dir(DATA_DIR) && !mkdir(DATA_DIR, 0750, true) && !is_dir(DATA_DIR)) {
            respond(500, ['ok' => false, 'msg' => 'Data storage is unavailable.']);
        }

        $dest = UPLOAD_DIR . '/' . $storedName;
        if (!move_uploaded_file($tmp, $dest)) {
            respond(500, ['ok' => false, 'msg' => 'Attachment could not be stored.']);
        }
        @chmod($dest, 0640);

        $storedFiles[] = [
            'file_original' => cleanText($original, 200),
            'file_stored'   => $storedName,
            'file_size'     => $size,
            'file_mime'     => $realMime,
        ];
    }
}

}


/* ── 8. 元数据持久化（JSON + flock 排他锁） ───────────────────────────── */

$record = [
    'id'          => bin2hex(random_bytes(8)),
    'time'        => date('Y-m-d H:i:s'),
    'ip'          => (string) ($_SERVER['REMOTE_ADDR'] ?? 'unknown'),
    'email'       => $email,
    'company'     => $company,
    'intent'      => $intent,
    'source'      => $source,
    'quantity'    => $quantity,
    'pageUrl'     => $pageUrl,
    'product'     => $product,
    'requirement' => $requirement,
    'attachments' => $storedFiles,
];

$fp = @fopen(DATA_FILE, 'c+');
if ($fp === false || !flock($fp, LOCK_EX)) {
    error_log('inquiry data file could not be locked: ' . DATA_FILE);
    respond(500, ['ok' => false, 'msg' => 'Inquiry could not be recorded. Please email us instead.']);
}

$content = stream_get_contents($fp);
$list = json_decode($content === false ? '' : $content, true);
if (!is_array($list)) {
    $list = [];
}
$list[] = $record;
rewind($fp);
ftruncate($fp, 0);
fwrite($fp, (string) json_encode($list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT));
fflush($fp);
flock($fp, LOCK_UN);
fclose($fp);

/* ── 9. 转发字段给既有承接端点（附件不外传） ─────────────────────────── */

$forwarded = false;
$forwardBody = (string) json_encode([
    'source'      => $source,
    'intent'      => $intent,
    'product'     => $product,
    'contact'     => ['email' => $email, 'company' => $company],
    'requirement' => $requirement,
    'quantity'    => $quantity,
    'pageUrl'     => $pageUrl,
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

if (function_exists('curl_init')) {
    $ch = curl_init(FORWARD_ENDPOINT);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => $forwardBody,
        CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 8,
        CURLOPT_CONNECTTIMEOUT => 5,
    ]);
    $result = curl_exec($ch);
    $forwarded = ($result !== false && (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE) < 400);
    curl_close($ch);
} else {
    $context = stream_context_create(['http' => [
        'method'        => 'POST',
        'header'        => "Content-Type: application/json\r\n",
        'content'       => $forwardBody,
        'timeout'       => 8,
        'ignore_errors' => true,
    ]]);
    $result = @file_get_contents(FORWARD_ENDPOINT, false, $context);
    $forwarded = ($result !== false);
}
if (!$forwarded) {
    // 转发失败不影响落盘：记录已在 DATA_FILE 中，可由人工在面板里查看。
    error_log('inquiry forwarded to ' . FORWARD_ENDPOINT . ' failed; record ' . $record['id'] . ' stored locally');
}

/* ── 10. 返回成功 ─────────────────────────────────────────────────────── */

respond(200, [
    'ok'        => true,
    'msg'       => 'Inquiry received.',
    'id'        => 'RFQ-' . strtoupper(substr($record['id'], 0, 8)),
    'files'     => count($storedFiles),
    'forwarded' => $forwarded,
]);
