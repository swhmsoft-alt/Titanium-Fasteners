/**
 * InquiryForm — B2B 询盘岛（React island，client:visible）。
 *
 * WHY AN ISLAND
 * -------------
 * 整站是纯静态 HTML；只有这个表单需要交互，所以它是唯一的 hydration 点，
 * 且用 `client:visible` —— 滚动到表单才加载 JS。产品页首屏（标题、规格表、
 * 图片、JSON-LD）全部是静态的，不受这��影响。
 *
 * PRODUCT CONTEXT IS BUILD-TIME, NOT SCRAPED
 * ------------------------------------------
 * 产品名 / 材质 / 标准 / 规格 是**构建期**由 data 层传进来的 props，
 * 不是运行时从 DOM 里抓 <h1>。理由：
 *   · 无 JS 时表单仍能显示正确的产品上下文（渐进增强）；
 *   · SEO 抓取到的标题与提交内容天然一致；
 *   · 抓 DOM 的做法在标题含图标/换行时会拿到脏值。
 *
 * SUBMISSION
 * ----------
 * 承接渠道：自建 webhook（client-confirmed）。静态站没有服务端，所以由浏览器
 * 直接 POST 到 webhook 端点。endpoints 是公开信息，防滥用在服务端做。
 * endpoint 为空时降级为 mailto: —— 保证「先上线页面、后接后端」不产生死按钮。
 */
import { useEffect, useId, useState } from 'react';

export interface InquiryContext {
	/** 产品族 id。 */
	familyId: string;
	/** 产品 SKU（管理凭据）—— 随询盘一起发出，工程师直接报号。 */
	sku?: string;
	/** 产品名称。 */
	productName: string;
	/** 执行标准（展示用，如 "DIN 912"）。 */
	standard: string;
	/** 可选材质（展示用，如 "Titanium Grade 5 (Ti-6Al-4V)"）。 */
	material: string;
	/** 规格范围摘要（如 "M4–M10"）。 */
	sizeRange: string;
	/** 页面 URL（canonical），后端用于回溯来源。 */
	pageUrl: string;
}

export interface InquiryFormProps {
	/** webhook 端点；空串则降级 mailto。 */
	endpoint: string;
	/** 带附件时的落盘端点；空串则附件一律退回纯文本通道。 */
	uploadEndpoint: string;
	/** 单个附件体积上限（MB），仅用于前端预检与提示。 */
	maxAttachmentMb: number;
	/** 降级收件邮箱。 */
	fallbackEmail: string;
	/** 业务来源标识。 */
	source: string;
	/** 蜜罐字段名；空串则不发该字段。 */
	trapField: string;
	/** 构建期注入的产品上下文。 */
	context: InquiryContext;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** URL query 携带的规格上下文。 */
interface Spec {
	standard?: string;
	thread?: string;
	length?: string;
}

const FIELD =
	'w-full border border-gray-vlight bg-white px-16 py-13 text-p-sm text-gray focus:border-blue focus:outline-none';

export default function InquiryForm(props: InquiryFormProps) {
	const { endpoint, uploadEndpoint, maxAttachmentMb, fallbackEmail, source, trapField, context } = props;
	const uid = useId();
	const [status, setStatus] = useState<Status>('idle');
	const [error, setError] = useState('');
	const [sent, setSent] = useState(false);
	/**
	 * 规格上下文 —— 来自 URL query（规格表行内询盘链接带过来）。
	 *
	 * 时序陷阱：岛在 client:visible 触发时才 hydrate。三种进入方式都会踩到
	 * 「state 与 hash 不同步」：带 query 的 URL 直接进来、点击表格行后再提交、
	 * 点击表格行时岛尚未 hydrate。因此这里**不缓存** —— 每次渲染都直接读
	 * window.location.hash（纯函数、无副作用、成本可忽略），hash 变化由浏览器
	 * 自身触发重渲染（hash 变化会引发 URL 更新，但不必然触发 React 重渲染，
	 * 所以额外保留 hashchange 监听强制刷新）。
	 */
	const readSpec = (): Spec => {
		if (typeof window === 'undefined') return {};
		const hash = window.location.hash;
		const qi = hash.indexOf('?');
		if (qi < 0) return {};
		const q = new URLSearchParams(hash.slice(qi + 1));
		const out: Spec = {};
		const std = q.get('standard');
		const th = q.get('thread');
		const len = q.get('length');
		if (std) out.standard = std;
		if (th) out.thread = th;
		if (len) out.length = len;
		return out;
	};

	/* hash 变化时强制重渲染（点击规格表行 → hash 变 → 表单上下文要跟着变）。 */
	const [, forceRender] = useState(0);
	useEffect(() => {
		const onHashChange = () => forceRender((n) => n + 1);
		window.addEventListener('hashchange', onHashChange);
		return () => window.removeEventListener('hashchange', onHashChange);
	}, []);

	const spec = readSpec();

	const productLine = [
		context.productName,
		spec.standard ?? context.standard,
		spec.thread ? `Thread ${spec.thread}` : '',
		spec.length ? `L ${spec.length} mm` : '',
		context.material,
	]
		.filter(Boolean)
		.join(' · ');

	async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (status === 'sending') return;

		const form = event.currentTarget;
		const data = new FormData(form);

	/**
	 * 提交时直接读 hash，不依赖渲染期的 spec。
	 *
	 * 关键：同页 hash 跳转（点击规格表行 → #inquiry?thread=M6）**不会**触发
	 * React 重渲染，也**不一定**触发 window 的 hashchange 事件。所以渲染期
	 * 缓存的 spec 可能是旧值。提交时现读一次，是唯一可靠的做法。
	 */
	const activeSpec = readSpec();

		// 蜜罐：真人看不到这个字段，机器人会填。填了就直接静默丢弃。
		if (trapField && String(data.get(trapField) ?? '').trim() !== '') {
			setStatus('sent');
			setSent(true);
			return;
		}

		const payload = {
			source,
			product: {
				familyId: context.familyId,
				sku: context.sku ?? '',
				name: context.productName,
				standard: activeSpec.standard ?? context.standard,
				material: context.material,
				sizeRange: context.sizeRange,
				thread: activeSpec.thread ?? '',
				length: activeSpec.length ?? '',
				pageUrl: context.pageUrl,
			},
			contact: {
				name: String(data.get('name') ?? ''),
				email: String(data.get('email') ?? ''),
				company: String(data.get('company') ?? ''),
				country: String(data.get('country') ?? ''),
				phone: String(data.get('phone') ?? ''),
			},
			requirement: String(data.get('requirement') ?? ''),
			quantity: String(data.get('quantity') ?? ''),
			pageUrl: context.pageUrl,
		};

		/**
		 * 附件：文件走 multipart 落盘端点，文字字段同批提交。
		 *
		 * 真实类型判定在服务端 finfo 完成，这里只拦明显超限的文件。
		 */
		const fileInput = form.querySelector<HTMLInputElement>(`#${uid}-attachment`);
		const picked = fileInput?.files ? Array.from(fileInput.files) : [];
		const maxBytes = maxAttachmentMb * 1024 * 1024;
		const oversized = picked.find((f) => f.size > maxBytes);
		if (oversized) {
			setError(`${oversized.name} is larger than ${maxAttachmentMb} MB. Please send a smaller file or email it separately.`);
			return;
		}
		// 主机 post_max_size 约束的是**整个 POST 包**，不是单个文件 ——
		// 多个附件累加超限时 PHP 会整体丢弃请求体，访客只会看到一句
		// 与真实原因无关的「邮箱无效」。因此这里也查累计体积。
		const totalBytes = picked.reduce((sum, f) => sum + f.size, 0);
		if (picked.length > 1 && totalBytes > maxBytes) {
			setError(
				`The selected attachments total ${(totalBytes / 1024 / 1024).toFixed(1)} MB, which exceeds the ${maxAttachmentMb} MB limit for one submission. Please attach fewer files or email them separately.`
			);
			return;
		}
		if (picked.length > 0 && !uploadEndpoint) {
			setError('File upload is not available on this form. Please email the attachment to our engineering inbox.');
			return;
		}

		if (picked.length > 0) {
			setStatus('sending');
			setError('');
			try {
				const fd = new FormData();
				fd.append('source', source);
				fd.append('email', payload.contact.email);
				fd.append('company', payload.contact.company);
				fd.append('country', payload.contact.country);
				fd.append('phone', payload.contact.phone);
				fd.append('quantity', payload.quantity);
				fd.append('requirement', payload.requirement);
				fd.append('pageUrl', payload.pageUrl);
				fd.append('product', JSON.stringify(payload.product));
				if (trapField) fd.append(trapField, '');
				// 字段名必须带 []：PHP 对**不带 [] 的同名字段只保留最后一个**，
				// 多文件会静默只剩最后一个，且结构不成数组。
				picked.forEach((f) => fd.append('attachment[]', f));

				const res = await fetch(uploadEndpoint, { method: 'POST', body: fd });
				// 后端把失败原因写在 msg 里（例：File upload failed (code 1)），
				// 必须读出来显示，否则访客只会看到一句笼统的失败提示。
				const body = await res.json().catch(() => null);
				if (!res.ok) {
					throw new Error(String(body?.msg ?? `HTTP ${res.status}`));
				}
				// files = 后端实际落盘的附件数。少于用户选择数 → 有文件没送达，
				// 不能报「提交成功」。
				const stored = typeof body?.files === 'number' ? body.files : picked.length;
				if (stored < picked.length) {
					throw new Error(
						`We received your message, but only ${stored} of ${picked.length} attachment(s) were stored. Please email the remaining file to ${fallbackEmail}.`
					);
				}
				setStatus('sent');
				setSent(true);
				form.reset();
			} catch (e) {
				setStatus('error');
				setError(e instanceof Error ? e.message : 'Network error');
			}
			return;
		}

		if (!endpoint) {
			// 降级：mailto。带上产品上下文，工程师打开邮件就知道询的是哪款。
			const body = [
				`Product: ${payload.product.name}`,
				payload.product.sku ? `SKU: ${payload.product.sku}` : '',
				`Standard: ${payload.product.standard}`,
				`Material: ${payload.product.material}`,
				payload.product.thread ? `Thread: ${payload.product.thread}` : '',
				payload.product.length ? `Length: ${payload.product.length} mm` : '',
				`Page: ${payload.pageUrl}`,
				'',
				`Name: ${payload.contact.name}`,
				`Company: ${payload.contact.company}`,
				`Email: ${payload.contact.email}`,
				`Phone: ${payload.contact.phone}`,
				`Country: ${payload.contact.country}`,
				`Quantity: ${payload.quantity}`,
				'',
				payload.requirement,
			]
				.filter(Boolean)
				.join('\n');
			window.location.href = `mailto:${fallbackEmail}?subject=${encodeURIComponent(
				`Inquiry: ${payload.product.name}`,
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
			setStatus('sent');
			setSent(true);
			form.reset();
		} catch (e) {
			setStatus('error');
			setError(e instanceof Error ? e.message : 'Network error');
		}
	}

	if (sent) {
		return (
			<div className="border border-blue-light bg-blue-light p-24">
				<h3 className="text-h5 mb-8 text-blue-dark3">Inquiry received</h3>
				<p className="text-p-sm text-gray">
					Thank you. Our engineering team will reply to your email within 12 business hours
					with a quotation for <strong>{productLine}</strong>.
				</p>
			</div>
		);
	}

	return (
		<form onSubmit={onSubmit} noValidate className="flex flex-col gap-16">
			<p className="text-p-sm text-gray-medium">
				Inquiry: <span className="text-gray">{productLine}</span>
			</p>

			<div className="grid grid-cols-1 gap-16 md:grid-cols-2">
				<div>
					<label htmlFor={`${uid}-name`} className="mb-8 block text-p-sm text-gray">
						Name <span className="text-accent-rose">*</span>
					</label>
					<input id={`${uid}-name`} name="name" type="text" required className={FIELD} />
				</div>
				<div>
					<label htmlFor={`${uid}-email`} className="mb-8 block text-p-sm text-gray">
						Email <span className="text-accent-rose">*</span>
					</label>
					<input id={`${uid}-email`} name="email" type="email" required className={FIELD} />
				</div>
				<div>
					<label htmlFor={`${uid}-company`} className="mb-8 block text-p-sm text-gray">
						Company
					</label>
					<input id={`${uid}-company`} name="company" type="text" className={FIELD} />
				</div>
				<div>
					<label htmlFor={`${uid}-country`} className="mb-8 block text-p-sm text-gray">
						Country
					</label>
					<input id={`${uid}-country`} name="country" type="text" className={FIELD} />
				</div>
				<div>
					<label htmlFor={`${uid}-quantity`} className="mb-8 block text-p-sm text-gray">
						Estimated quantity
					</label>
					<input id={`${uid}-quantity`} name="quantity" type="text" className={FIELD} />
				</div>
				<div>
					<label htmlFor={`${uid}-phone`} className="mb-8 block text-p-sm text-gray">
						Phone
					</label>
					<input id={`${uid}-phone`} name="phone" type="tel" className={FIELD} />
				</div>
			</div>

			<div>
				<label htmlFor={`${uid}-requirement`} className="mb-8 block text-p-sm text-gray">
					Requirement <span className="text-accent-rose">*</span>
				</label>
				<textarea
					id={`${uid}-requirement`}
					name="requirement"
					rows={5}
					required
					className={`${FIELD} resize-y`}
					placeholder="e.g. M6 x 20, Gr5, black anodized, 2000 pcs, MTC required"
				/>
			</div>

			<div>
				<label htmlFor={`${uid}-attachment`} className="mb-8 block text-p-sm text-gray">
					Attachment (optional)
				</label>
				<input
					id={`${uid}-attachment`}
					name="attachment[]"
					type="file"
					multiple
					accept=".pdf,.csv,.txt,.xls,.xlsx,.ods,.step,.stp,.iges,.igs,.dwg,.dxf,.zip,.jpg,.jpeg,.png"
					className={FIELD}
				/>
				<p className="mt-8 text-p-sm text-gray-medium">
					BOM, drawing or photo — up to {maxAttachmentMb} MB each. Attach only after our
					mutual NDA is in place; files are stored outside the public web directory. Larger
					files can be emailed to {fallbackEmail}.
				</p>
			</div>

			{/* 蜜罐 —— 视觉隐藏但对机器人可见 */}
			{trapField && (
				<div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
					<label htmlFor={`${uid}-trap`}>Website</label>
					<input id={`${uid}-trap`} name={trapField} type="text" tabIndex={-1} autoComplete="off" />
				</div>
			)}

			{status === 'error' && (
				<p role="alert" className="text-p-sm text-accent-rose">
					Submission failed ({error}). Please email {fallbackEmail} instead.
				</p>
			)}

			<button
				type="submit"
				disabled={status === 'sending'}
				className="inline-flex items-center justify-center self-start rounded-pill bg-blue px-24 py-13 pb-14 text-button leading-none text-white transition-colors duration-300 hover:bg-blue-dark3 disabled:opacity-60"
			>
				{status === 'sending' ? 'Sending…' : 'Send inquiry'}
			</button>
		</form>
	);
}
