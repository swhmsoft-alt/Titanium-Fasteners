#!/usr/bin/env node
/**
 * .githooks/.commit-msg.mjs — advisory commit-message marker check.
 *
 * If the subject line carries no conventional-commit marker
 * (feat / fix / docs / refactor / perf / test / build / ci / chore / revert),
 * an advisory block is APPENDED below the original message.
 *
 * It never rejects the commit (exit 0 always) and never rewrites what the
 * user wrote — the original text stays byte-for-byte intact at the top.
 */

import { readFileSync, writeFileSync } from 'node:fs';

const MARKER = /^(feat|fix|docs|refactor|perf|test|build|ci|chore|revert)(\([^)]*\))?!?:\s*\S/;

const file = process.argv[2];
if (!file) process.exit(0);

const HINT = [
	'',
	'---',
	'[commit-msg] 这条提交信息没有类型标记（conventional commit）。',
	'[commit-msg] 建议格式：<type>(<scope>): <subject>',
	'[commit-msg] 可用 type：feat / fix / docs / refactor / perf / test / build / ci / chore / revert',
	'',
].join('\n');

try {
	const raw = readFileSync(file, 'utf8');
	// Only the subject line (before the first blank line) is inspected.
	const subject = raw.split(/\r?\n/)[0] ?? '';
	const body = raw.trimEnd();

	if (MARKER.test(subject.trim())) process.exit(0);

	writeFileSync(file, `${body}\n${HINT}`, 'utf8');
} catch {
	// Silent by design — never block a commit.
}

process.exit(0);
