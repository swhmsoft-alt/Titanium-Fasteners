#!/usr/bin/env node
/**
 * .githooks/.post-commit.mjs — append one record to the local commit log.
 *
 * NEVER blocks the commit: every error is swallowed and the process always
 * exits 0. A broken log must not cost the user their commit.
 *
 * The log lives inside .git/ (never inside the working tree) because it is a
 * purely local artefact — it is not part of the repository content.
 */

import { appendFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const LOG_DIR = join(ROOT, '.git');
const LOG_FILE = join(LOG_DIR, 'hook-log.txt');

function git(...args) {
	return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
}

try {
	const sha = git('rev-parse', '--short', 'HEAD');
	const branch = git('rev-parse', '--abbrev-ref', 'HEAD');
	const subject = git('log', '-1', '--pretty=%s');

	mkdirSync(LOG_DIR, { recursive: true });
	appendFileSync(LOG_FILE, `${new Date().toISOString()}\t${branch}\t${sha}\t${subject}\n`, 'utf8');
} catch {
	// Silent by design — the hook must not fail a commit.
}

process.exit(0);
