/**
 * PHP 语法校验 —— 用 php-parser 真正解析 AST。
 *
 * 为什么要 AST 而不是括号计数：
 * 2026-11-26 的线上 500 就是括号计数漏检的 —— 文件里少一个 `}`、多一个 `}`，
 * 净误差为 0，计数法报 "balanced"，但 PHP 引擎把整段业务代码吞进了函数体。
 * 解析器能报出真实的语法错误，还能单独检出 PHP 的编译期致命错误：
 * `const X = dirname(...)` —— const 初始值必须是常量表达式，不允许函数调用。
 */
import fs from 'node:fs';
import path from 'node:path';

import phpParser from 'php-parser';

const { parseCode } = phpParser;

const targets = process.argv.slice(2);
let failed = 0;

for (const rel of targets) {
	const file = path.resolve(rel);
	const code = fs.readFileSync(file, 'utf8');
	try {
		const ast = parseCode(code, file);

		// const 初始值里的函数调用 → 编译期致命错误（解析器不会报错，必须单独查）
		const offenders = [];
		const scanForCall = (n) => {
			if (!n || typeof n !== 'object') return false;
			if (Array.isArray(n)) return n.some(scanForCall);
			if (n.kind === 'call' || n.kind === 'new') return true;
			for (const k of Object.keys(n)) {
				if (k === 'loc' || k === 'kind') continue;
				if (scanForCall(n[k])) return true;
			}
			return false;
		};
		const walk = (node) => {
			if (!node || typeof node !== 'object') return;
			if (Array.isArray(node)) {
				node.forEach(walk);
				return;
			}
			if (node.kind === 'const' || node.kind === 'constantstatement') {
				const items = node.items || node.constants || [];
				for (const item of items) {
					const value = item.value ?? item.expr;
					if (!value) continue;
					if (scanForCall(value)) {
						offenders.push(
							`${item.name?.name ?? '?'} (line ${value.loc?.start?.line ?? '?'})`
						);
					}
				}
			}
			for (const k of Object.keys(node)) {
				if (k === 'loc' || k === 'kind') continue;
				walk(node[k]);
			}
		};
		walk(ast);

		if (offenders.length > 0) {
			failed++;
			console.error(`FAIL ${rel}: const initialiser calls a function (compile-time fatal):`);
			offenders.forEach((o) => console.error(`   - ${o}`));
		} else {
			console.log(`OK   ${rel}: parsed clean, const initialisers are constant expressions`);
		}
	} catch (err) {
		failed++;
		console.error(`FAIL ${rel}: ${err.message}`);
	}
}

process.exit(failed > 0 ? 1 : 0);
