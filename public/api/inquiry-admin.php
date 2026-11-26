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
 * 本脚本补上这条缺口：口令鉴权后，列出全部询盘，并以附件形式把原始字节流
 * 还原后回传（剥掉 PHP 前缀），文件名用访客上传时的原名。
 *
 * 为什么不用 .htaccess 保护
 * -----------------------
 * 共享主机的 AllowOverride 曾导致 .htaccess 里的指令让全站 500
 * （scripts/deploy-ftp-ci.mjs 为此写了「写入 .htaccess 后若 5xx 就回滚」的保护）。
 * 所以这里的访问控制全部由脚本自身完成，不依赖任何服务器配置。
 *
 * 口令怎么设
 * ---------
 * 口令**不写在本文件里**（那会进版本库），而是放在
 *     .boze-secure/admin.key.php
 * 该文件同样是 PHP 载荷格式，因此即便地址被猜到也下载不到内容。
 * 在 cPanel 文件管理器里新建该文件，内容为两行：
 *     <?php __halt_compiler(); ?>
 *     你的口令
 * 口令比对用 hash_equals（常数时间），登录态放在会话里。
 */

declare(strict_types=1);

/** 落盘文件的 PHP 前缀 —— 与 submit-inquiry.php 保持一致。 */
const PHP_STUB = "<?php __halt_compiler(); ?>";

/** 会话名。 */
const SESSION_NAME = 'boze_inquiry_admin';

/**
 * 存储根目录（运行时变量 —— const 初始值不允许函数调用，会触发编译期致命错误）。
 * dirname(__DIR__) = 站点根：线上 = /home/safetipa/fastener.bozemetal.com/
 */
$storageRoot = dirname(__DIR__);
$secureDir = $storageRoot . '/.boze-secure';
$uploadDir = $secureDir . '/uploads';
$dataFile = $secureDir . '/inquiries.php';
$keyFile = $secureDir . '/admin.key.php';

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

/** 读出后台口令；未配置时返回 null。 */
function adminPassword(): ?string
{
	global $keyFile;
	if (!is_file($keyFile)) {
		return null;
	}
	$value = trim(readPayload($keyFile));
	return $value === '' ? null : $value;
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

/* ── 会话 ───────────────────────────────────────────────────────────────── */

session_name(SESSION_NAME);
session_set_cookie_params([
	'lifetime' => 0,
	'path'     => '/',
	'httponly' => true,
	'samesite' => 'Strict',
	'secure'   => !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off',
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

/* ── 登录 ───────────────────────────────────────────────────────────────── */

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'POST' && ($_POST['action'] ?? '') === 'login') {
	$expected = adminPassword();
	$given = (string) ($_POST['password'] ?? '');
	if (!$sessionOk) {
		$loginError = 'The server cannot store sessions. Ask the host to enable PHP sessions for this site.';
	} elseif ($expected !== null && $given !== '' && hash_equals($expected, $given)) {
		session_regenerate_id(true);
		$_SESSION['boze_admin_ok'] = true;
		header('Location: ' . basename(__FILE__));
		exit;
	} else {
		// 口令错误与未配置都回同一个提示，不暴露哪个是真的。
		$loginError = '口令不正确。';
	}
}

/* ── 附件下载（需登录） ─────────────────────────────────────────────────── */

if (($_GET['action'] ?? '') === 'download') {
	if (!isLoggedIn()) {
		header('Location: ' . basename(__FILE__));
		exit;
	}
	$recordId = (string) ($_GET['id'] ?? '');
	$stored = (string) ($_GET['file'] ?? '');

	// 只接受本系统生成的存储名，杜绝路径穿越。
	if (!preg_match('/^[0-9a-f]{32}\.php$/', $stored)) {
		http_response_code(400);
		exit('Invalid attachment reference.');
	}

	$record = null;
	foreach (loadRecords() as $candidate) {
		if (($candidate['id'] ?? '') === $recordId) {
			$record = $candidate;
			break;
		}
	}
	if ($record === null) {
		http_response_code(404);
		exit('Unknown inquiry.');
	}

	$meta = null;
	foreach ((array) ($record['attachments'] ?? []) as $item) {
		if (($item['file_stored'] ?? '') === $stored) {
			$meta = $item;
			break;
		}
	}
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

	$original = (string) ($meta['file_original'] ?? $stored);
	// 文件名里的引号与换行会破坏 header，必须剥掉。
	$original = str_replace(["\r", "\n", '"'], '', $original);
	$mime = (string) ($meta['file_mime'] ?? 'application/octet-stream');

	header('Content-Type: ' . $mime);
	header('Content-Length: ' . strlen($bytes));
	header('Content-Disposition: attachment; filename="' . $original . '"');
	header('X-Content-Type-Options: nosniff');
	header('Cache-Control: no-store');
	echo $bytes;
	exit;
}

/* ── 退出登录 ───────────────────────────────────────────────────────────── */

if (($_GET['action'] ?? '') === 'logout') {
	$_SESSION = [];
	if (ini_get('session.use_cookies')) {
		$params = session_get_cookie_params();
		setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
	}
	@session_destroy();
	header('Location: ' . basename(__FILE__));
	exit;
}


/* ── 页面渲染 ───────────────────────────────────────────────────────────── */

header('Content-Type: text/html; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$records = array_reverse(loadRecords()); // 最新在前
$keyExists = adminPassword() !== null;
$self = basename(__FILE__);

?><!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Inquiry admin — BOZE</title>
<style>
 body{font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;margin:0;padding:32px;background:#f5f6f7;color:#1c1f23}
 main{max-width:1200px;margin:0 auto}
 h1{font-size:19px;margin:0 0 4px}
 p.sub{color:#5b6470;margin:0 0 24px}
 table{width:100%;border-collapse:collapse;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.06)}
 th,td{border-bottom:1px solid #e5e8ec;padding:9px 10px;text-align:left;vertical-align:top}
 th{background:#eef1f4;font-size:12px;text-transform:uppercase;letter-spacing:.04em;color:#495260}
 td.msg{max-width:340px;word-break:break-word}
 td.nw{white-space:nowrap}
 a.dl{color:#0b5cab;text-decoration:none;font-weight:600}
 a.dl:hover{text-decoration:underline}
 form.login{background:#fff;padding:24px;max-width:430px;box-shadow:0 1px 2px rgba(0,0,0,.06)}
 input[type=password]{width:100%;box-sizing:border-box;padding:9px;font-size:14px;border:1px solid #c9ced6}
 button{margin-top:12px;padding:9px 18px;font-size:14px;font-weight:600;background:#0b5cab;color:#fff;border:0;cursor:pointer}
 .err{color:#a4262c;margin:12px 0 0}
 .setup{color:#5b6470;font-size:13px;margin:12px 0 0;line-height:1.7}
 .empty{background:#fff;padding:32px;text-align:center;color:#5b6470}
 .bar{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
 .bar a{color:#5b6470;font-size:13px}
 code{background:#eef1f4;padding:1px 5px;font-size:12px}
</style>
</head>
<body>
<main>
<?php if (!isLoggedIn()): ?>
	<h1>BOZE inquiry admin</h1>
	<p class="sub">Sign in to review inquiries and retrieve attachment originals.</p>
	<form class="login" method="post" action="<?= h($self) ?>">
		<input type="hidden" name="action" value="login" />
		<input type="password" name="password" placeholder="Password" autofocus autocomplete="current-password" />
		<button type="submit">Sign in</button>
		<?php if (!$keyExists): ?>
			<p class="err">Admin access is not configured yet.</p>
			<p class="setup">Set the password in the hosting panel: create the file
			<code>.boze-secure/admin.key.php</code> next to this site&rsquo;s other files, with these two lines<br />
			<code>&lt;?php __halt_compiler(); ?&gt;</code><br />
			<code>your-password</code><br />
			The first line makes the file unreadable over the web — the password can only be read by this script.</p>
		<?php elseif (isset($loginError)): ?>
			<p class="err"><?= h($loginError) ?></p>
		<?php endif; ?>
	</form>
<?php else: ?>
	<div class="bar">
		<div>
			<h1>BOZE inquiry admin</h1>
			<p class="sub"><?= count($records) ?> inquiry record(s) on the server.</p>
		</div>
		<a href="<?= h($self) ?>?action=logout">Sign out</a>
	</div>
	<?php if (!$records): ?>
		<div class="empty">No inquiries recorded yet.</div>
	<?php else: ?>
	<table>
		<thead>
			<tr>
				<th>Received</th><th>Contact</th><th>Company</th><th>Requirement</th><th>Attachments</th><th>Source</th>
			</tr>
		</thead>
		<tbody>
		<?php foreach ($records as $r): $id = (string) ($r['id'] ?? ''); ?>
			<tr>
				<td class="nw"><?= h((string) ($r['time'] ?? '')) ?><br /><code><?= h($id) ?></code></td>
				<td class="nw"><a href="mailto:<?= h((string) ($r['email'] ?? '')) ?>"><?= h((string) ($r['email'] ?? '')) ?></a></td>
				<td class="nw"><?= h((string) ($r['company'] ?? '')) ?></td>
				<td class="msg"><?= h((string) ($r['requirement'] ?? '')) ?></td>
				<td>
				<?php $att = (array) ($r['attachments'] ?? []); ?>
				<?php if (!$att): ?>
					—
				<?php else: ?>
					<?php foreach ($att as $a): $stored = (string) ($a['file_stored'] ?? ''); ?>
						<a class="dl" href="<?= h($self) ?>?action=download&amp;id=<?= h($id) ?>&amp;file=<?= h($stored) ?>"><?= h((string) ($a['file_original'] ?? '')) ?></a><br />
						<span class="nw"><?= h((string) ($a['file_ext'] ?? '')) ?> · <?= (int) ($a['file_size'] ?? 0) ?> B</span><br />
					<?php endforeach; ?>
				<?php endif; ?>
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
