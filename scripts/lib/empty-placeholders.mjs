/**
 * scripts/lib/empty-placeholders.mjs — policy for zero-byte placeholder files.
 *
 * `public/**` is copied verbatim into `dist/`, so the repository's `.gitkeep`
 * placeholders reach the deployer. The FTP host closes the data connection
 * while storing such an empty file, which used to abort an otherwise
 * complete deployment — a successful publish turned red by an empty file.
 *
 * Policy: a zero-byte file is never sent. The directory that holds it is
 * still created, and the skip is always reported, so the log states exactly
 * what was left out and why.
 */

import { statSync } from 'node:fs';

/**
 * Whether a local file exists and is empty.
 *
 * A missing or unreadable path is NOT empty — it is reported as `false` so
 * that the caller still attempts the transfer and surfaces the real error.
 *
 * @param {string} filePath
 * @returns {boolean}
 */
export function isZeroByteFile(filePath) {
	try {
		return statSync(filePath).size === 0;
	} catch {
		return false;
	}
}

/**
 * Decide what the deployer does with one local file.
 *
 * @param {string} localPath
 * @returns {'skip-empty'|'upload'}
 */
export function classifyFile(localPath) {
	return isZeroByteFile(localPath) ? 'skip-empty' : 'upload';
}
