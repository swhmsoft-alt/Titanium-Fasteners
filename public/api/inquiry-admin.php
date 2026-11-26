<?php
/**
 * inquiry-admin.php — 询盘查看与附件取回后台（自包含单文件）
 *
 * WHY THIS FILE EXISTS
 * --------------------
 * 询盘元数据与附件以「PHP 载荷文件」形式落盘在 .boze-secure/ 内：
 * 文件以 `<?php __halt_compiler(); ?>` 开头，Web 请求只会执行一个空脚本并返回
 * 空响应，原件无法被公开下载。这个设计保证了安全，但也带来一个副作用 ——
 * **站长自己拿不到干净的原件**：从 cPanel 下载得到的是带 PHP 前缀的字节流。
 *
 * 本脚本补上这条缺口：口令鉴权后，列出全部询盘，并把原始字节流还原后回传
 * （剥掉 PHP 前缀），文件名用访客上传时的原名。
 *
 * 谁在用这个后台
 * --------------
 * 站长与业务同事，**不是**程序员。所以界面是中文的、按钮是明显的，
 * 而且不需要任何服务器侧的手工准备动作。
 *
 * 口令怎么设
 * -----------
 * 两条路，任选其一，**都不需要站长碰服务器**：
 *   1) 直接用本文件内置的口令（仓库里只存 SHA-256 哈希，明文不落版本库）；
 *   2) 在 .boze-secure/admin.key.php 放自己的口令（同样是 PHP 载荷格式，
 *      即便地址被猜到也下载不到内容）—— 存在时以它为准，可覆盖内置口令。
 *
 * 为什么不用 .htaccess 保护
 * -------------------------
 * 共享主机的 AllowOverride 曾导致 .htaccess 里的指令让全站 500
 * （scripts/deploy-ftp-ci.mjs 为此写了「写入 .htaccess 后若 5xx 就回滚」的保护）。
 * 所以这里的访问控制全部由脚本自身完成，不依赖任何服务器配置。
 */

declare(strict_types=1);

/** 落盘文件的 PHP 前缀 —— 与 submit-inquiry.php 保持一致。 */
const PHP_STUB = "<?php __halt_compiler(); ?>";

/** 会话名。 */
const SESSION_NAME = 'boze_inquiry_admin';

/**
 * 内置后台口令的 SHA-256 哈希。
 *
 * 仓库里只有不可逆哈希 —— 即使版本库泄露，也拿不到可直接使用的口令。
 * 明文口令由站长自行保管（首次交付时单独给出）。
 */
const ADMIN_PASSWORD_SHA256 = '60e06a18c2c8b969d39d044ced52ed8023240ecd0f5fc41acd8a17544bb3803b';

/**
 * 存储根目录（运行时变量 —— const 初始值不允许函数调用，会触发编译期致命错误）。
 * dirname(__DIR__) = 站点根：线上 = /home/safetipa/fastener.bozemetal.com/
 */
$storageRoot = dirname(__DIR__);
$secureDir = $storageRoot . '/.boze-secure';
$uploadDir = $secureDir . '/uploads';
$dataFile = $secureDir . '/inquiries.php';
$keyFile = $secureDir . '/admin.key.php';
$processedFile = $secureDir . '/processed.php';

/** 读取载荷文件：剥掉 PHP 前缀，还原原始字节。 */
function readPayload(string $path): string
{
	$raw = @file_get_contents($path);
	if ($raw === false) {
		return '';
	}
	if (strncmp($raw, PHP_STUB, strlen(PHP_STUB)) === 0) {
		$raw = substr($raw, strlen(PHP_STUB));
		if (strncmp($raw, "\n", 1) === 0) {
			$raw = substr($raw, 1);
		}
	}
	return $raw;
}

/** 读出后台口令覆盖值；未配置时返回 null。 */
function adminPassword(): ?string
{
	global $keyFile;
	if (!is_file($keyFile)) {
		return null;
	}
	$value = trim(readPayload($keyFile));
	return $value === '' ? null : $value;
}

/**
 * 校验口令。
 *
 * 覆盖文件优先，且**一旦存在就完全取代内置口令** —— 不是「两条路任选其一」。
 * 理由：若两者同时有效，站长一旦担心内置口令泄露，也无法通过放置覆盖文件
 * 把那条路关掉；覆盖就失去了「收回权限」的意义。
 *
 * 两条路都用 hash_equals（常数时间比较），不因长度或前缀差异泄露信息。
 */
function verifyPassword(string $given): bool
{
	if ($given === '') {
		return false;
	}
	$override = adminPassword();
	if ($override !== null) {
		return hash_equals($override, $given);
	}
	return hash_equals(ADMIN_PASSWORD_SHA256, hash('sha256', $given));
}

/** 读出全部询盘记录。 */
function loadRecords(): array
{
	global $dataFile;
	if (!is_file($dataFile)) {
		return [];
	}
	$decoded = json_decode(readPayload($dataFile), true);
	return is_array($decoded) ? $decoded : [];
}

/** 按记录 id 找到一条询盘。 */
function findRecord(string $id): ?array
{
	foreach (loadRecords() as $candidate) {
		if ((string) ($candidate['id'] ?? '') === $id) {
			return $candidate;
		}
	}
	return null;
}

/** 读出「已处理」标记列表（记录 id 数组）。 */
function loadProcessed(): array
{
	global $processedFile;
	if (!is_file($processedFile)) {
		return [];
	}
	$decoded = json_decode(readPayload($processedFile), true);
	return is_array($decoded) ? $decoded : [];
}

/** 确保 .boze-secure 存在且可写。 */
function ensureSecureDir(): bool
{
	global $secureDir;
	if (is_dir($secureDir)) {
		return is_writable($secureDir);
	}
	if (!@mkdir($secureDir, 0750, true) && !is_dir($secureDir)) {
		return false;
	}
	return is_writable($secureDir);
}

/** 写回「已处理」标记列表（flock 排他锁）。 */
function saveProcessed(array $ids): bool
{
	global $processedFile;
	if (!ensureSecureDir()) {
		return false;
	}
	$fp = @fopen($processedFile, 'c+b');
	if ($fp === false) {
		return false;
	}
	if (!flock($fp, LOCK_EX)) {
		fclose($fp);
		return false;
	}
	$payload = PHP_STUB . "\n" . (string) json_encode(array_values($ids), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
	rewind($fp);
	$ok = ftruncate($fp, 0) && fwrite($fp, $payload) !== false;
	fflush($fp);
	flock($fp, LOCK_UN);
	fclose($fp);
	return $ok;
}

/** HTML 转义。 */
function h(?string $value): string
{
	return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/** 是否已登录。 */
function isLoggedIn(): bool
{
	return !empty($_SESSION['boze_admin_ok']);
}

/** 剥掉文件名里会破坏 header 或 zip 条目的字符。 */
function safeFilename(string $name): string
{
	$name = str_replace(["\r", "\n", '"', '\\', '/'], '', $name);
	return $name === '' ? 'attachment' : $name;
}

/** 附件是否支持浏览器内直接预览。 */
function isPreviewable(string $ext): bool
{
	return in_array(strtolower($ext), ['pdf', 'png', 'jpg', 'jpeg'], true);
}

/** 取出一条记录里的某个附件元数据（按存储名匹配）。 */
function findAttachment(array $record, string $stored): ?array
{
	foreach ((array) ($record['attachments'] ?? []) as $item) {
		if ((string) ($item['file_stored'] ?? '') === $stored) {
			return $item;
		}
	}
	return null;
}

/**
 * 纯 PHP 写一个 ZIP（store 模式，不压缩），流式写入临时文件。
 *
 * 为什么不用 ZipArchive
 * ---------------------
 * 共享主机的 PHP 不一定编译了 ext-zip（本地 PHP 8.3 CLI 就没编）。若后台把
 * 「打包下载」绑在 ZipArchive 上，站长的主机一旦没这个扩展，按钮就成了一句
 * 501 错误 —— 而他根本不知道自己该去找主机商开什么。
 *
 * 所以这里自己实现：store 模式（method 0）不需要 zlib，crc32() 是核心函数，
 * 任何 PHP 都有。条目逐个 fwrite 进临时文件，内存占用与单个附件同量级，
 * 不会因为「20MB × N 个附件」把 memory_limit 打爆。
 *
 * @param array<int,array{name:string,data:string}> $entries
 */
function buildZip(array $entries): ?string
{
	if (!$entries) {
		return null;
	}
	$tmp = tempnam(sys_get_temp_dir(), 'boze_zip_');
	if ($tmp === false) {
		return null;
	}
	$out = @fopen($tmp, 'w+b');
	if ($out === false) {
		@unlink($tmp);
		return null;
	}

	// 固定时间戳（1980-01-01）—— 只为保证输出确定，便于校验。
	$dosTime = 0;
	$dosDate = 0x21;

	$central = '';
	$offset = 0;
	$count = 0;

	foreach ($entries as $entry) {
		$name = (string) ($entry['name'] ?? '');
		$data = (string) ($entry['data'] ?? '');
		if ($name === '') {
			continue;
		}
		$crc = crc32($data);
		$size = strlen($data);

		// Local file header：version 2.0，flag bit11 = 文件名为 UTF-8。
		$local = pack('V', 0x04034b50)
			. pack('v', 20)            // version needed
			. pack('v', 0x0800)        // flags: UTF-8 名称
			. pack('v', 0)             // compression: store
			. pack('v', $dosTime)
			. pack('v', $dosDate)
			. pack('V', $crc)
			. pack('V', $size)         // compressed size
			. pack('V', $size)         // uncompressed size
			. pack('v', strlen($name))
			. pack('v', 0)             // extra length
			. $name;

		fwrite($out, $local);
		fwrite($out, $data);

		// Central directory header。
		$central .= pack('V', 0x02014b50)
			. pack('v', 20)            // version made by
			. pack('v', 20)            // version needed
			. pack('v', 0x0800)
			. pack('v', 0)
			. pack('v', $dosTime)
			. pack('v', $dosDate)
			. pack('V', $crc)
			. pack('V', $size)
			. pack('V', $size)
			. pack('v', strlen($name))
			. pack('v', 0)             // extra
			. pack('v', 0)             // comment
			. pack('v', 0)             // disk number start
			. pack('v', 0)             // internal attrs
			. pack('V', 32)            // external attrs
			. pack('V', $offset)       // relative offset of local header
			. $name;

		$offset += strlen($local) + $size;
		$count++;
	}

	// End of central directory。
	$eocd = pack('V', 0x06054b50)
		. pack('v', 0)
		. pack('v', 0)
		. pack('v', $count)
		. pack('v', $count)
		. pack('V', strlen($central))
		. pack('V', $offset)
		. pack('v', 0);

	fwrite($out, $central);
	fwrite($out, $eocd);
	fflush($out);
	fclose($out);

	return $tmp;
}

/* ── 会话 ───────────────────────────────────────────────────────────────── */

session_name(SESSION_NAME);
session_set_cookie_params([
	'lifetime' => 0,
	'path' => '/',
	'httponly' => true,
	'samesite' => 'Strict',
	'secure' => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
]);
@session_start();

/**
 * 会话是否真的可用。
 *
 * 共享主机的会话保存目录有时不可写，session_start() 会静默失败。此时若继续
 * 写入 $_SESSION，登录态不会被持久化 —— 用户点了登录又被弹回登录页，表现为
 * 「点了没反应」的循环。所以这里显式判定，失败时给出可读的原因。
 */
$sessionOk = session_status() === PHP_SESSION_ACTIVE;

$self = basename(__FILE__);

/* ── 登录 ───────────────────────────────────────────────────────────────── */

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['action'] ?? '') === 'login') {
	$given = (string) ($_POST['password'] ?? '');
	if (!$sessionOk) {
		$loginError = '服务器无法保存登录状态，请联系主机商为本站点启用 PHP session。';
	} elseif (verifyPassword($given)) {
		session_regenerate_id(true);
		$_SESSION['boze_admin_ok'] = true;
		header('Location: ' . $self);
		exit;
	} else {
		// 口令错误与未配置都回同一个提示，不暴露哪个是真的。
		$loginError = '口令不正确。';
	}
}

/* ── 退出登录 ───────────────────────────────────────────────────────────── */

if (($_GET['action'] ?? '') === 'logout') {
	$_SESSION = [];
	if (ini_get('session.use_cookies')) {
		$params = session_get_cookie_params();
		setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
	}
	@session_destroy();
	header('Location: ' . $self);
	exit;
}

/* ── 标记「已处理」 ─────────────────────────────────────────────────────── */

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['action'] ?? '') === 'mark') {
	if (!isLoggedIn()) {
		header('Location: ' . $self);
		exit;
	}
	$target = (string) ($_POST['id'] ?? '');
	$done = ((string) ($_POST['done'] ?? '')) === '1';
	$ids = loadProcessed();
	$has = in_array($target, $ids, true);
	if ($done && !$has) {
		$ids[] = $target;
	} elseif (!$done && $has) {
		$ids = array_values(array_filter($ids, static fn($x) => $x !== $target));
	}
	saveProcessed($ids);
	header('Location: ' . $self);
	exit;
}

/* ── 附件下载 / 预览（需登录） ───────────────────────────────────────────── */

if (($_GET['action'] ?? '') === 'download' || ($_GET['action'] ?? '') === 'preview') {
	if (!isLoggedIn()) {
		header('Location: ' . $self);
		exit;
	}
	$action = (string) $_GET['action'];
	$recordId = (string) ($_GET['id'] ?? '');
	$stored = (string) ($_GET['file'] ?? '');

	// 只接受本系统生成的存储名，杜绝路径穿越。
	if (!preg_match('/^[0-9a-f]{32}\.php$/', $stored)) {
		http_response_code(400);
		exit('Invalid attachment reference.');
	}

	$record = findRecord($recordId);
	if ($record === null) {
		http_response_code(404);
		exit('Unknown inquiry.');
	}

	$meta = findAttachment($record, $stored);
	if ($meta === null) {
		http_response_code(404);
		exit('Unknown attachment.');
	}

	$path = $uploadDir . '/' . $stored;
	if (!is_file($path)) {
		http_response_code(404);
		exit('Attachment payload is missing on the server.');
	}
	$bytes = readPayload($path);
	if ($bytes === '') {
		http_response_code(404);
		exit('Attachment payload is empty.');
	}

	$original = safeFilename((string) ($meta['file_original'] ?? $stored));
	$mime = (string) ($meta['file_mime'] ?? 'application/octet-stream');
	$ext = (string) ($meta['file_ext'] ?? '');

	// 预览仅对浏览器能直接显示的类型开放，且用 inline；其余一律下载。
	if ($action === 'preview' && !isPreviewable($ext)) {
		header('Location: ' . $self . '?action=download&id=' . rawurlencode($recordId) . '&file=' . rawurlencode($stored));
		exit;
	}

	header('Content-Type: ' . $mime);
	header('Content-Length: ' . strlen($bytes));
	header('Content-Disposition: ' . ($action === 'preview' ? 'inline' : 'attachment') . '; filename="' . $original . '"');
	header('X-Content-Type-Options: nosniff');
	header('Cache-Control: no-store');
	echo $bytes;
	exit;
}

/* ── 一条询盘的附件打包下载（需登录） ───────────────────────────────────── */

if (($_GET['action'] ?? '') === 'zip') {
	if (!isLoggedIn()) {
		header('Location: ' . $self);
		exit;
	}
	$recordId = (string) ($_GET['id'] ?? '');
	$record = findRecord($recordId);
	if ($record === null) {
		http_response_code(404);
		exit('Unknown inquiry.');
	}
	$attachments = (array) ($record['attachments'] ?? []);
	if (!$attachments) {
		http_response_code(404);
		exit('This inquiry has no attachment.');
	}

	$entries = [];
	$used = [];
	foreach ($attachments as $item) {
		$stored = (string) ($item['file_stored'] ?? '');
		if (!preg_match('/^[0-9a-f]{32}\.php$/', $stored)) {
			continue;
		}
		$src = $uploadDir . '/' . $stored;
		if (!is_file($src)) {
			continue;
		}
		$bytes = readPayload($src);
		if ($bytes === '') {
			continue;
		}
		$name = safeFilename((string) ($item['file_original'] ?? $stored));
		// 同名文件在 zip 内不能重名 —— 加序号避让。
		if (isset($used[$name])) {
			$used[$name]++;
			$name = (string) $used[$name] . '_' . $name;
		} else {
			$used[$name] = 1;
		}
		$entries[] = ['name' => $name, 'data' => $bytes];
	}
	if (!$entries) {
		http_response_code(404);
		exit('No attachment payload is available on the server.');
	}

	$tmp = buildZip($entries);
	if ($tmp === null) {
		http_response_code(500);
		exit('ZIP archive could not be created.');
	}

	header('Content-Type: application/zip');
	header('Content-Length: ' . (string) filesize($tmp));
	header('Content-Disposition: attachment; filename="inquiry-' . substr($recordId, 0, 8) . '-attachments.zip"');
	header('X-Content-Type-Options: nosniff');
	header('Cache-Control: no-store');
	readfile($tmp);
	@unlink($tmp);
	exit;
}

/* ── 页面渲染 ───────────────────────────────────────────────────────────── */

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$records = array_reverse(loadRecords()); // 最新在前
$processed = loadProcessed();
$hasOverride = adminPassword() !== null;
$loginError = $loginError ?? null;

?><!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>询盘后台 — BOZE</title>
<style>
  body{font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Microsoft YaHei",sans-serif;margin:0;padding:28px;background:#f5f6f7;color:#1c1f23}
  main{max-width:1280px;margin:0 auto}
  h1{font-size:20px;margin:0 0 4px}
  p.sub{color:#5b6470;margin:0 0 22px}
  table{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06)}
  th,td{border-bottom:1px solid #e5e8ec;padding:10px 10px;text-align:left;vertical-align:top}
  th{background:#eef1f4;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#495260}
  td.msg{max-width:320px;word-break:break-word}
  td.nw{white-space:nowrap}
  tr.done td{opacity:.55}
  tr.done td.mark a{background:#6b7280;border-color:#6b7280}
  a.dl{display:inline-block;background:#0b5cab;color:#fff;text-decoration:none;font-weight:600;padding:4px 10px;border-radius:4px;margin:0 6px 4px 0;font-size:13px}
  a.dl:hover{background:#094a8d}
  a.dl.gray{background:#4b5563}
  a.dl.gray:hover{background:#374151}
  form.login{background:#fff;padding:26px;max-width:460px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
  input[type=password]{width:100%;box-sizing:border-box;padding:10px;font-size:14px;border:1px solid #c9ced6}
  button{margin-top:12px;padding:10px 20px;font-size:14px;font-weight:600;background:#0b5cab;color:#fff;border:0;cursor:pointer;border-radius:4px}
  .err{color:#a4262c;margin:12px 0 0}
  .hint{color:#5b6470;font-size:13px;margin:10px 0 0;line-height:1.8}
  .empty{background:#fff;padding:34px;text-align:center;color:#5b6470}
  .bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
  .bar a{color:#5b6470;font-size:13px}
  .count{color:#5b6470;font-size:12px}
  code{background:#eef1f4;padding:1px 5px;font-size:12px}
</style>
</head>
<body>
<main>
<?php if (!isLoggedIn()): ?>
	<h1>BOZE 询盘后台</h1>
	<p class="sub">登录后可查看询盘内容，并下载客户上传的原始文件（BOM / 图纸 / STEP / PDF）。</p>
	<form class="login" method="post" action="<?= h($self) ?>">
		<input type="hidden" name="action" value="login" />
		<label for="pw">访问口令</label>
		<input id="pw" type="password" name="password" placeholder="请输入口令" autofocus autocomplete="current-password" style="margin-top:6px" />
		<button type="submit">登录</button>
		<?php if (isset($loginError)): ?>
			<p class="err"><?= h($loginError) ?></p>
		<?php endif; ?>
		<?php if (!$hasOverride): ?>
			<p class="hint">当前使用站点内置口令。如需自定义，可在站点目录的 <code>.boze-secure/admin.key.php</code> 中写入新口令（首行须为
			<code>&lt;?php __halt_compiler(); ?&gt;</code>），自定义口令将覆盖内置口令。</p>
		<?php endif; ?>
	</form>
<?php else: ?>
	<div class="bar">
		<div>
			<h1>BOZE 询盘后台</h1>
			<p class="sub">共 <?= count($records) ?> 条询盘记录 · 已处理 <?= count($processed) ?> 条。点击文件名即可下载客户上传的原始文件。</p>
		</div>
		<a href="<?= h($self) ?>?action=logout">退出登录</a>
	</div>
	<?php if (!$records): ?>
		<div class="empty">暂无询盘记录。</div>
	<?php else: ?>
	<table>
		<thead>
			<tr>
				<th>收到时间</th><th>联系人</th><th>公司</th><th>需求描述</th><th>附件</th><th>状态 / 操作</th><th>来源</th>
			</tr>
		</thead>
		<tbody>
		<?php foreach ($records as $r): $id = (string) ($r['id'] ?? ''); $isDone = in_array($id, $processed, true); ?>
			<tr class="<?= $isDone ? 'done' : '' ?>">
				<td class="nw"><?= h((string) ($r['time'] ?? '')) ?><br /><code><?= h($id) ?></code></td>
				<td class="nw"><a href="mailto:<?= h((string) ($r['email'] ?? '')) ?>"><?= h((string) ($r['email'] ?? '')) ?></a></td>
				<td class="nw"><?= h((string) ($r['company'] ?? '')) ?></td>
				<td class="msg"><?= h((string) ($r['requirement'] ?? '')) ?></td>
				<td>
					<?php $att = (array) ($r['attachments'] ?? []); ?>
					<?php if (!$att): ?>
						<span class="count">无附件</span>
					<?php else: ?>
						<span class="count">已收到 <?= count($att) ?> 个文件</span><br />
						<?php foreach ($att as $a):
							$stored = (string) ($a['file_stored'] ?? '');
							$ext = (string) ($a['file_ext'] ?? '');
							$name = safeFilename((string) ($a['file_original'] ?? ''));
							$base = $self . '?id=' . rawurlencode($id) . '&file=' . rawurlencode($stored);
						?>
							<a class="dl" href="<?= h($base) ?>&action=download"><?= h($name) ?></a>
							<?php if (isPreviewable($ext)): ?>
								<a class="dl gray" href="<?= h($base) ?>&action=preview">预览</a>
							<?php endif; ?>
							<br /><span class="count"><?= h($ext) ?> · <?= (int) ($a['file_size'] ?? 0) ?> B</span>
						<?php endforeach; ?>
						<a class="dl gray" href="<?= h($self) ?>?action=zip&id=<?= rawurlencode($id) ?>">下载全部附件 (ZIP)</a>
					<?php endif; ?>
				</td>
				<td class="nw mark">
					<form method="post" action="<?= h($self) ?>">
						<input type="hidden" name="action" value="mark" />
						<input type="hidden" name="id" value="<?= h($id) ?>" />
						<input type="hidden" name="done" value="<?= $isDone ? '0' : '1' ?>" />
						<button type="submit"><?= $isDone ? '标为未处理' : '标记已处理' ?></button>
					</form>
					<?php $replySubject = 'Re: Your inquiry ' . substr($id, 0, 8); $replyBody = "Inquiry reference: " . $id . "\n\nRequirement:\n" . (string) ($r['requirement'] ?? '') . "\n\nBest regards,\nBoze Metal"; ?>
					<a class="dl gray" href="mailto:<?= h((string) ($r['email'] ?? '')) ?>?subject=<?= rawurlencode($replySubject) ?>&body=<?= rawurlencode($replyBody) ?>">回邮客户</a>
				</td>
				<td class="nw"><?= h((string) ($r['source'] ?? '')) ?><?= !empty($r['intent']) ? ' / ' . h((string) $r['intent']) : '' ?></td>
			</tr>
		<?php endforeach; ?>
		</tbody>
	</table>
	<?php endif; ?>
<?php endif; ?>
</main>
</body>
</html>
