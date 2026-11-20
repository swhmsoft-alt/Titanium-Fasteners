/**
 * ContactInquiryForm — /contact/ 左侧的「零涉密破冰」极简表单岛。
 *
 * WHY AN ISLAND
 * -------------
 * 只有这块表单需要交互（单选胶囊 + 提交态切换 + 回执卡），所以它是本页唯一的
 * hydration 点。**必须用 `client:load`**（不能用 `client:visible`）：
 * /contact/ 是站内的转化终点，访客常从导航/邮件链接直接落地并立即提交，
 * 若等滚动到可见才 hydrate，会出现「点了没反应」的失联窗口。
 *
 * DESIGN INTENT（为什么只有 3 个字段）
 * ----------------------------------
 * 目标读者是欧美 B2B 采购经理与研发工程师，第一次接触时的防备心来自
 * 「表单=我要暴露图纸 / 要暴露个人信息」。因此本页刻意做成 30 秒破冰：
 *   · 意图用单选胶囊代替下拉（免打字，也避免要求对方描述技术细节）；
 *   · 需求描述是唯一的长文本框，且明说「此时不需要任何机密文件」；
 *   · 只强制一个字段：企业邮箱（没有它就无法回 NDA）。
 * 姓名/公司/国家/电话一律**不问**——这些信息在回信里再问不迟，
 * 而多要一个字段就多一重「凭什么先给你信息」的对抗感。
 *
 * SUBMISSION
 * ----------
 * 承接渠道复用 @config/site 的 INQUIRY（与产品页询盘同一 webhook），不在本页
 * 新造端点。endpoint 为空时降级 mailto，保证「先上线页面、后接后端」不产生死按钮。
 * 蜜罐沿用同一字段名与静默成功策略（机器人填了就静默丢弃，不暴露风控）。
 */
import { useState } from 'react';

export interface ContactIntentOption {
	id: string;
	label: string;
	hint: string;
	recommended?: boolean;
}

export interface ContactInquiryFormProps {
	/** webhook 端点；空串则降级 mailto。 */
	endpoint: string;
	/** 降级收件邮箱。 */
	fallbackEmail: string;
	/** 蜜罐字段名；空串则不发该字段。 */
	trapField: string;
	/** 业务来源标识。 */
	source: string;
	/** 页面 URL（canonical），后端用于回溯来源。 */
	pageUrl: string;
	/** 意图胶囊选项（构建期由 data 层注入）。 */
	intents: ContactIntentOption[];
	/** 意图胶囊组的标题。 */
	intentsLabel: string;
	/** 文本框标签。 */
	textareaLabel: string;
	/** 文本框副提示。 */
	textareaHint: string;
	/** 文本框占位符。 */
	textareaPlaceholder: string;
	/** 邮箱字段标签。 */
	emailLabel: string;
	/** 邮箱字段弱提示。 */
	emailHint: string;
	/** 主按钮文案。 */
	cta: string;
	/** 按钮下方微文案。 */
	ctaNote: string;
	/** 回执卡标题。 */
	receiptTitle: string;
	/** 回执卡正文。 */
	receiptBody: string;
	/** 回执卡补充提示。 */
	receiptHint: string;
	/** 「再提交一次」按钮文案。 */
	resetLabel: string;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

const FIELD =
	'w-full border border-gray-vlight bg-white px-16 py-13 text-p-sm text-gray focus:border-blue focus:outline-none';

/**
 * 生成参考号（REF-2026-884 形态）。
 *
 * 仅用于给访客一个可引用的对话锚点，**不是**订单号 —— 真正的关联靠邮箱。
 */
function makeReference(): string {
	const year = new Date().getFullYear();
	const n = 100 + Math.floor(Math.random() * 900);
	return `REF-${year}-${n}`;
}

export default function ContactInquiryForm(props: ContactInquiryFormProps) {
	const {
		endpoint,
		fallbackEmail,
		trapField,
		source,
		pageUrl,
		intents,
		intentsLabel,
		textareaLabel,
		textareaHint,
		textareaPlaceholder,
		emailLabel,
		emailHint,
		cta,
		ctaNote,
		receiptTitle,
		receiptBody,
		receiptHint,
		resetLabel,
	} = props;

	const [intent, setIntent] = useState<string>(intents[0]?.id ?? '');
	const [status, setStatus] = useState<Status>('idle');
	const [error, setError] = useState('');
	const [reference, setReference] = useState('');
	const [email, setEmail] = useState('');

	const activeIntent = intents.find((i) => i.id === intent);

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (status === 'sending') return;

		const form = event.currentTarget;
		const data = new FormData(form);
		const brief = String(data.get('requirement') ?? '').trim();
		const workEmail = String(data.get('email') ?? '').trim();

		// 蜜罐：真人看不到，机器人会填。填了就静默成功，不暴露风控规则。
		if (trapField && String(data.get(trapField) ?? '').trim() !== '') {
			setStatus('sent');
			setReference(makeReference());
			return;
		}

		const payload = {
			source,
			/* 意图胶囊 —— 采购/工程分流的第一个标签。 */
			intent,
			intentLabel: activeIntent?.label ?? '',
			/* 与产品页询盘保持同一 payload 形状，后端无需分支。 */
			product: {
				familyId: '',
				sku: '',
				name: activeIntent?.label ?? 'Contact inquiry',
				standard: '',
				material: '',
				sizeRange: '',
				thread: '',
				length: '',
				pageUrl,
			},
			contact: {
				name: '',
				email: workEmail,
				company: '',
				country: '',
				phone: '',
			},
			requirement: brief,
			quantity: '',
			pageUrl,
		};

		if (!endpoint) {
			// 降级：mailto。带上意图与需求，工程师打开邮件就知道要处理什么。
			const body = [
				`Intent: ${payload.intentLabel}`,
				`Page: ${pageUrl}`,
				'',
				`Work email: ${workEmail}`,
				'',
				brief,
			]
				.filter(Boolean)
				.join('\n');
			window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
				'NDA & RFQ Inquiry - Titanium Fasteners',
			)}&body=${encodeURIComponent(body)}`;
			return;
		}

		setStatus('sending');
		setError('');
		try {
			const res = await fetch(endpoint, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
			setReference(makeReference());
			setStatus('sent');
			form.reset();
		} catch (e) {
			setStatus('error');
			setError(e instanceof Error ? e.message : 'Network error');
		}
	}

	/* ── 回执态：左栏原地切换，不跳转页面 ────────────────────────────── */
	if (status === 'sent') {
		return (
			<div className="flex flex-col gap-16 border border-blue-light bg-blue-light p-24 lg:p-32">
				<h3 className="text-h5 text-blue-dark3">{receiptTitle}</h3>
				<p className="text-p-sm text-gray">
					<span className="block font-bold text-blue-dark3">{reference}</span>
					{receiptBody}
				</p>
				<p className="text-p-sm text-gray-medium">{receiptHint}</p>
				<div className="flex flex-wrap gap-12">
					<a
						href={`mailto:${fallbackEmail}?subject=${encodeURIComponent(
							'NDA & RFQ Inquiry - Titanium Fasteners',
						)}`}
						className="inline-flex items-center justify-center rounded-pill bg-blue px-24 py-13 pb-14 text-button leading-none text-white transition-colors duration-300 hover:bg-blue-dark3"
					>
						Request NDA by email
					</a>
					<button
						type="button"
						onClick={() => {
							setStatus('idle');
							setReference('');
							setEmail('');
						}}
						className="inline-flex items-center justify-center rounded-pill border-2 border-blue-dark3 bg-transparent px-20 py-8 text-button leading-none text-blue-dark3 transition-colors duration-300 hover:bg-blue-dark3 hover:text-white"
					>
						{resetLabel}
					</button>
				</div>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate className="flex flex-col gap-24">
			{/* ── 1. 快捷意图标签（免打字） ───────────────────────────── */}
			<fieldset>
				<legend className="mb-12 block text-p-sm font-bold text-blue-dark3">
					{intentsLabel}
				</legend>
				<div className="flex flex-wrap gap-8">
					{intents.map((option) => {
						const active = option.id === intent;
						return (
							<label
								key={option.id}
								className={`flex cursor-pointer flex-col rounded-pill border px-16 py-8 transition-colors duration-300 ${
									active
										? 'border-blue bg-blue text-white'
										: 'border-gray-soft bg-white text-gray hover:border-blue hover:text-blue-dark3'
								}`}
							>
								<input
									type="radio"
									name="intent"
									value={option.id}
									checked={active}
									onChange={() => setIntent(option.id)}
									className="sr-only"
								/>
								<span className="text-p-sm font-bold">{option.label}</span>
								<span
									className={`text-p-sm ${
										active ? 'text-blue-light' : 'text-gray-medium'
									}`}
								>
									{option.recommended ? `Recommended — ${option.hint}` : option.hint}
								</span>
							</label>
						);
					})}
				</div>
			</fieldset>

			{/* ── 2. 极简需求描述 ───────────────────────────────────── */}
			<div>
				<label htmlFor="contact-requirement" className="mb-8 block text-p-sm font-bold text-blue-dark3">
					{textareaLabel}
				</label>
				<p className="mb-8 text-p-sm text-gray-medium">{textareaHint}</p>
				<textarea
					id="contact-requirement"
					name="requirement"
					rows={4}
					required
					className={`${FIELD} resize-y`}
					placeholder={textareaPlaceholder}
				/>
			</div>

			{/* ── 3. 仅留企业邮箱 ───────────────────────────────────── */}
			<div>
				<label htmlFor="contact-email" className="mb-8 block text-p-sm font-bold text-blue-dark3">
					{emailLabel} <span className="text-accent-rose">*</span>
				</label>
				<p className="mb-8 text-p-sm text-gray-medium">{emailHint}</p>
				<input
					id="contact-email"
					name="email"
					type="email"
					required
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					className={FIELD}
				/>
			</div>

			{/* 蜜罐 —— 视觉隐藏但对机器人可见 */}
			{trapField && (
				<div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
					<label htmlFor="contact-trap">Website</label>
					<input id="contact-trap" name={trapField} type="text" tabIndex={-1} autoComplete="off" />
				</div>
			)}

			{status === 'error' && (
				<p role="alert" className="text-p-sm text-accent-rose">
					Submission failed ({error}). Please email{' '}
					<a className="text-blue underline" href={`mailto:${fallbackEmail}`}>
						{fallbackEmail}
					</a>{' '}
					instead — we will pick it up from there.
				</p>
			)}

			{/* ── 主行动按钮 + 顾虑消除微文案 ───────────────────────── */}
			<div className="flex flex-col gap-8">
				<button
					type="submit"
					disabled={status === 'sending'}
					className="inline-flex items-center justify-center self-start rounded-pill bg-blue px-24 py-13 pb-14 text-button leading-none text-white transition-colors duration-300 hover:bg-blue-dark3 disabled:opacity-60"
				>
					{status === 'sending' ? 'Sending…' : cta}
				</button>
				<p className="text-p-sm text-gray-medium">🔒 {ctaNote}</p>
			</div>
		</form>
	);
}
