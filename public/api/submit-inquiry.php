<?php
/**
 * submit-inquiry.php — 询盘承接端点（落盘 + 邮件通知）
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 本站是 Astro 静态产物（SSG），没有服务端进程。表单原本只能把纯文本 POST 到
 * 一个 webhook 或降级为 mailto:，**收不到附件**（BOM / 2D 图纸 / STEP）。
 * 2026-11-26 实测：站内 /api/inquiry 与三个兄弟站的同路径全部 404/500，
 * 所谓「既有承接端点」并不存在 —— 纯文本询盘同样从未真正送达。因此本脚本
 * 改为**自建承接**：它既是纯文本通道，也是附件通道的唯一落点。
 *
 * 流程
 * ----
 *   1. 接收 multipart/form-data（也兼容 application/json 的纯文本询盘）；
 *   2. 用 finfo 读取**真实** MIME 校验附件，完全忽略浏览器上报的类型；
 *   3. 附件随机重命名后落盘到本站目录内的 .boze-secure/uploads/；
 *   4. 询盘元数据写入 .boze-secure/inquiries.php（flock 排他锁）；
 *   5. 用 PHP mail() 发出通知邮件（Reply-To = 访客邮箱）。
 *
 * STORAGE
 * -------
 * 站点权限要求询盘数据与附件必须留在 /home/safetipa/fastener.bozemetal.com/ 内，
 * 而该目录同时就是 Web 根，所以「存在站点内」与「附件不可公开下载」必须同时成立。
 * 做法：落盘文件统一使用 .php 扩展名，并以
 *     <?php __halt_compiler(); ?>
 * 开头写盘 —— __halt_compiler() 之后的字节 PHP 引擎完全不再解析，Web 请求
 * 该 URL 时只会执行一个空 PHP 文件并返回空响应，原件无法被下载；文件名又是
 * 32 位随机 hex，无目录索引可枚举。此方案不依赖主机对 .htaccess 的支持
 * （共享主机的 AllowOverride 曾经导致过 500），也不依赖任何数据库。
 *
 * 依赖：PHP 7.4+（finfo、random_bytes、mail()）。
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
    'application/zip'                                                    => 'zip',
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

/**
 * 落盘文件的 PHP 前缀。
 *
 * __halt_compiler() 之后的字节 PHP 引擎完全不再解析：把它放在文件开头，
 * 原始载荷就变成「不可执行的尾巴」，Web 请求该 .php URL 时只会执行一个
 * 空脚本并返回空响应 —— 附件在物理上仍位于站点目录内，但任何人猜到 URL
 * 也下载不到原件。
 */
const PHP_STUB = "<?php __halt_compiler(); ?>";

/**
 * 存储根目录（运行时变量，不能用 const —— PHP 的 const 初始值不允许
 * 函数调用，dirname() 会直接触发编译期致命错误）。
 *
 * dirname(__DIR__) = 站点根目录：
 *   线上 = /home/safetipa/fastener.bozemetal.com/  （该目录同时是 Web 根）
 *   本地 = public/ 的上一级
 * 附件落在站点根下的 .boze-secure/ 内，满足「数据必须留在本站目录内」，
 * 同时靠 .php + __halt_compiler 做到不可公开下载。
 */
$storageRoot = dirname(__DIR__);
$secureDir = $storageRoot . '/.boze-secure';
$uploadDir = $secureDir . '/uploads';
$dataFile = $secureDir . '/inquiries.php';

/** 通知邮箱（收件方）。 */
const NOTIFY_TO = 'info@bozemetal.com';

/** 发件方（Reply-To 另设为访客邮箱，便于工程师直接回信）。 */
const NOTIFY_FROM = 'website@fastener.bozemetal.com';

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
}

/** 写载荷文件：PHP 前缀 + 原始字节，使其在 Web 上不可下载。 */
function writePayload(string $path, string $bytes): bool
{
    $fp = @fopen($path, 'wb');
    if ($fp === false) {
        return false;
    }
    $written = fwrite($fp, PHP_STUB . "\n" . $bytes);
    fflush($fp);
    fclose($fp);
    return $written !== false;
}

/**
 * 读取文件的真实 MIME。
 *
 * 首选 finfo（fileinfo 扩展）。若主机未启用该扩展，**不能**直接崩成 500 ——
 * 那正是本次修复要消灭的故障模式。降级路径用**魔数嗅探**，仍然只认字节、
 * 绝不采信浏览器上报的 Content-Type，安全等级与 finfo 同级。
 */
function detectMime(string $path): string
{
    if (class_exists('finfo')) {
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = (string) $finfo->file($path);
        if ($mime !== '') {
            return $mime;
        }
    }
    return sniffMime($path);
}

/**
 * 魔数嗅探 —— fileinfo 不可用时的降级实现。
 *
 * 只覆盖业务实际接受的文件类型，其余一律判为不可接受（application/x-unknown），
 * 即「宁可漏收，不可错收」。
 */
function sniffMime(string $path): string
{
    $fh = @fopen($path, 'rb');
    if ($fh === false) {
        return 'application/x-unknown';
    }
    $head = (string) fread($fh, 512);
    fclose($fh);
    if ($head === '') {
        return 'application/x-unknown';
    }

    if (strncmp($head, '%PDF-', 5) === 0) {
        return 'application/pdf';
    }
    if (strncmp($head, "\x89PNG\r\n", 4) === 0) {
        return 'image/png';
    }
    if (strncmp($head, "\xFF\xD8\xFF", 3) === 0) {
        return 'image/jpeg';
    }
    // ZIP 容器：xlsx / ods / 普通 zip
    if (strncmp($head, "PK\x03\x04", 4) === 0) {
        return 'application/zip';
    }
    // OLE2 容器：xls
    if (strncmp($head, "\xD0\xCF\x11\xE0", 4) === 0) {
        return 'application/vnd.ms-excel';
    }
    // STEP / IGES: ISO-10303 文本
    if (stripos($head, 'ISO-10303') !== false || stripos($head, 'IGES') !== false) {
        return 'application/step';
    }
    // DWG: "AC10xx" 版本标记
    if (preg_match('/^AC10[0-9]{2}/', $head) === 1) {
        return 'application/acad';
    }
    // CSV / 纯文本：仅当没有二进制控制字符时才认定
    if (preg_match('/[\x00-\x08\x0B\x0C\x0E-\x1F]/', $head) !== 1) {
        return 'text/plain';
    }
    return 'application/x-unknown';
}

/** 读载荷文件：剥掉 PHP 前缀，还原原始字节。 */
function readPayload(string $path): string
{
    $raw = @file_get_contents($path);
    if ($raw === false) {
        return '';
    }
    return readPayloadString($raw);
}

/**
 * 追加一条询盘记录（flock 排他锁）。
 *
 * 为什么必须加锁
 * --------------
 * 读-改-写整个数组不是原子的：两个访客同时提交时，双方都读到同一份旧数组，
 * 各自追加一条后写回，后写的那份会把前一份整个盖掉 —— 询盘凭空消失。
 * flock(LOCK_EX) 把「读 → 追加 → 写回」变成一个临界区，并发提交只会串行化。
 *
 * 锁必须持有到写回并刷盘为止，所以解锁放在 fclose 之前。
 *
 * @param string $dataFile 记录文件路径
 * @param array  $record   单条询盘记录
 * @return bool 是否写入成功
 */
function appendRecord(string $dataFile, array $record): bool
{
	// 'c+' = 读/写、不截断、文件不存在则创建。
	$fp = @fopen($dataFile, 'c+b');
	if ($fp === false) {
		return false;
	}
	if (!flock($fp, LOCK_EX)) {
		fclose($fp);
		return false;
	}

	$content = stream_get_contents($fp);
	$list = [];
	if (is_string($content) && $content !== '') {
		$decoded = json_decode(readPayloadString($content), true);
		if (is_array($decoded)) {
			$list = $decoded;
		}
	}
	$list[] = $record;

	$payload = PHP_STUB . "\n" . (string) json_encode($list, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);

	rewind($fp);
	$ok = ftruncate($fp, 0) && fwrite($fp, $payload) !== false;
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);

	return $ok;
}

/** 从字符串内容里剥掉 PHP 载荷前缀（读文件与读字符串共用同一套规则）。 */
function readPayloadString(string $raw): string
{
	if (strncmp($raw, PHP_STUB, strlen(PHP_STUB)) === 0) {
		$raw = substr($raw, strlen(PHP_STUB));
		if (strncmp($raw, "\n", 1) === 0) {
			$raw = substr($raw, 1);
		}
	}
	return $raw;
}

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

/**
 * 附件数组归一化。
 *
 * 前端用 `attachment[]` 提交多文件时，PHP 把 $_FILES['attachment'] 解析成
 * 「每个元素含 name/tmp_name/... 的数组」；而若某天有人改成单文件同名字段
 * （不带 []），PHP 则给出「单个文件描述的关联数组」。两种形态都要能处理，
 * 否则最常见的写法会静默丢掉附件。
 */
$attachmentItems = [];
if (isset($files['attachment']) && is_array($files['attachment'])) {
    if (isset($files['attachment']['name']) && is_array($files['attachment']['name'])) {
        foreach (array_keys($files['attachment']['name']) as $k) {
            $attachmentItems[] = [
                'name'     => (string) ($files['attachment']['name'][$k] ?? ''),
                'tmp_name' => (string) ($files['attachment']['tmp_name'][$k] ?? ''),
                'size'     => (int) ($files['attachment']['size'][$k] ?? 0),
                'error'    => (int) ($files['attachment']['error'][$k] ?? UPLOAD_ERR_NO_FILE),
            ];
        }
    } elseif (isset($files['attachment']['name'])) {
        $attachmentItems[] = [
            'name'     => (string) $files['attachment']['name'],
            'tmp_name' => (string) ($files['attachment']['tmp_name'] ?? ''),
            'size'     => (int) ($files['attachment']['size'] ?? 0),
            'error'    => (int) ($files['attachment']['error'] ?? UPLOAD_ERR_NO_FILE),
        ];
    }
}

foreach ($attachmentItems as $file) {
    $err = $file['error'];
    if ($err === UPLOAD_ERR_NO_FILE) {
        continue;
    }
    if ($err !== UPLOAD_ERR_OK) {
        respond(400, ['ok' => false, 'msg' => 'File upload failed (code ' . $err . ').']);
    }

    $tmp = $file['tmp_name'];
    $original = $file['name'];
    $size = $file['size'];

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
    $realMime = detectMime($tmp);
    if (!array_key_exists($realMime, ALLOWED_MIME)) {
        respond(415, ['ok' => false, 'msg' => 'Attachment content type ' . $realMime . ' is not accepted.']);
    }

    // 随机重命名：丢弃用户提供的任何名称片段
    $storedName = bin2hex(random_bytes(16)) . '.php';

    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0750, true) && !is_dir($uploadDir)) {
        respond(500, ['ok' => false, 'msg' => 'Upload storage is unavailable.']);
    }
    if (!is_dir($secureDir) && !mkdir($secureDir, 0750, true) && !is_dir($secureDir)) {
        respond(500, ['ok' => false, 'msg' => 'Data storage is unavailable.']);
    }

    $dest = $uploadDir . '/' . $storedName;
    $bytes = @file_get_contents($tmp);
    if ($bytes === false || !writePayload($dest, $bytes)) {
        respond(500, ['ok' => false, 'msg' => 'Attachment could not be stored.']);
    }
    @chmod($dest, 0640);

    $storedFiles[] = [
        'file_original' => cleanText($original, 200),
        'file_stored'   => $storedName,
        'file_size'     => $size,
        'file_mime'     => $realMime,
        'file_ext'      => $ext,
    ];
}


/* ── 8. 元数据持久化（PHP 载荷文件 + flock 排他锁） ────────────────────── */

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

if (!is_dir($secureDir) && !mkdir($secureDir, 0750, true) && !is_dir($secureDir)) {
    respond(500, ['ok' => false, 'msg' => 'Data storage is unavailable.']);
}

$existing = [];
if (is_file($dataFile)) {
    $decoded = json_decode(readPayload($dataFile), true);
    if (is_array($decoded)) {
        $existing = $decoded;
    }
}

// 读-改-写整个数组必须持锁，否则并发提交会互相覆盖记录（见 appendRecord 的说明）。
if (!appendRecord($dataFile, $record)) {
    respond(500, ['ok' => false, 'msg' => 'Inquiry could not be recorded. Please email us instead.']);
}
@chmod($dataFile, 0640);

/* ── 9. 邮件通知（附件不外传，只在正文列出文件名） ────────────────────── */

$lines = [];
$lines[] = 'New website inquiry — ' . $record['id'];
$lines[] = '';
$lines[] = 'Email:    ' . $email;
if ($company !== '') {
    $lines[] = 'Company:  ' . $company;
}
if ($intent !== '') {
    $lines[] = 'Intent:   ' . $intent;
}
if ($quantity !== '') {
    $lines[] = 'Quantity: ' . $quantity;
}
if ($source !== '') {
    $lines[] = 'Source:   ' . $source;
}
if ($pageUrl !== '') {
    $lines[] = 'Page:     ' . $pageUrl;
}
if (!empty($product)) {
    $lines[] = 'Product:  ' . json_encode($product, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
}
$lines[] = '';
$lines[] = 'Requirement:';
$lines[] = $requirement;
if (!empty($storedFiles)) {
    $lines[] = '';
    $lines[] = 'Attachments (' . count($storedFiles) . ') stored on the server:';
    foreach ($storedFiles as $sf) {
        $lines[] = '  - ' . $sf['file_original'] . ' (' . $sf['file_ext'] . ', ' . $sf['file_size'] . ' bytes, ' . $sf['file_stored'] . ')';
    }
}

$headers = [
    'From: BOZE Website <' . NOTIFY_FROM . '>',
    'Reply-To: ' . $email,
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$mailSent = false;
if (function_exists('mail')) {
    $mailSent = @mail(
        NOTIFY_TO,
        'New titanium fastener inquiry — ' . ($company !== '' ? $company : $email),
        implode("\r\n", $lines),
        implode("\r\n", $headers)
    );
}
if (!$mailSent) {
    // 邮件不可用不丢询盘：记录已落盘，可由人工在面板里查看。
    error_log('inquiry notification email failed; record ' . $record['id'] . ' stored at ' . $dataFile);
}

/* ── 10. 返回成功 ─────────────────────────────────────────────────────── */

respond(200, [
    'ok'        => true,
    'msg'       => 'Inquiry received.',
    'id'        => 'RFQ-' . strtoupper(substr($record['id'], 0, 8)),
    'files'     => count($storedFiles),
    'mailed'    => $mailSent,
]);
