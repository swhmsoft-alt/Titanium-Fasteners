#!/usr/bin/env node
/**
 * scripts/install-hooks.mjs — install (or remove) the repository-local git hooks.
 *
 * WHY AN EXTERNAL HOOK DIRECTORY
 * ------------------------------
 * `.git/hooks/` is NOT distributed with the repository: a fresh `git clone`
 * produces an empty hook directory. By pointing `core.hooksPath` at the
 * tracked `.githooks/` directory, the hooks travel with the code, so every
 * clone and every teammate automatically gets them — no manual re-install.
 *
 * Usage:
 *   npm run hooks:install     # git config core.hooksPath .githooks
 *   npm run hooks:uninstall   # git config --unset core.hooksPath
 */

import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const uninstall = process.argv.includes('--uninstall');

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).trim();
}

try {
	if (uninstall) {
		try {
			git('config', '--unset', 'core.hooksPath');
			console.log('[install-hooks] core.hooksPath 已清除，钩子不再生效。');
		} catch {
			console.log('[install-hooks] core.hooksPath 本就未设置，无需清理。');
		}
	} else {
		git('config', 'core.hooksPath', '.githooks');
		const current = git('config', '--get', 'core.hooksPath');
		console.log(`[install-hooks] core.hooksPath = ${current}`);
		console.log('[install-hooks] 生效的钩子：post-commit、commit-msg');
	}
} catch (err) {
	console.error('[install-hooks] 执行失败：', err.message);
	process.exit(1);
}
