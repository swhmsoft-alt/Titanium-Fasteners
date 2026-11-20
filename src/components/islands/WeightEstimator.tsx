/**
 * WeightEstimator — 钢 → 钛 减重估算岛（React island，client:load）。
 *
 * WHY AN ISLAND
 * -------------
 * 这是页面上唯一的交互点：改牌号/直径/长度 → 立刻出两侧质量与减重百分比。
 *
 * DATA IS BUILD-TIME, NOT SCRAPED
 * -------------------------------
 * 牌号与密度通过 props 在**构建期**由 @data/products 的 MATERIALS 注入，
 * 岛内不 import 数据层、也不读取 CSV —— 钢的 7.85 g/cm³ 是写在常量里的
 * 公开标称密度（碳钢通用值），不是我们的实测数据。
 *
 * RED LINES (不可放宽)
 * --------------------
 *   · 只算**体积 × 密度**的名义杆部质量，界面显式声明这不是实测值；
 *   · 不推算扭矩、预紧力、摩擦系数、夹紧力 —— 那些需要实测，不发布估计值；
 *   · 界面必须长期显示「按公开密度估算」的口径声明。
 */
import { useMemo, useState } from 'react';

/** 一个牌号的显示名与标称密度（g/cm³）。 */
export interface EstimatorGrade {
	id: string;
	name: string;
	density: number;
}

export interface WeightEstimatorProps {
	/** 构建期注入的牌号列表（来自 MATERIALS）。 */
	grades: EstimatorGrade[];
	/** 碳钢标称密度（g/cm³）—— 公开通用值。 */
	steelDensity: number;
	/** 钢的显示名。 */
	steelName: string;
}

/** 常用公称直径（mm）—— 只给标准系列，不做任意输入的自由联想。 */
const DIAMETERS = [3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 30];

export default function WeightEstimator({ grades, steelDensity, steelName }: WeightEstimatorProps) {
	const [gradeId, setGradeId] = useState(grades[0]?.id ?? '');
	const [diameter, setDiameter] = useState('8');
	const [length, setLength] = useState('40');

	const grade = grades.find((g) => g.id === gradeId) ?? grades[0];

	const result = useMemo(() => {
		const d = Number.parseFloat(diameter);
		const l = Number.parseFloat(length);
		if (!grade || !Number.isFinite(d) || !Number.isFinite(l) || d <= 0 || l <= 0) {
			return null;
		}
		/* 杆部按正圆柱近似：V = π·(d/2)²·l（mm³ → cm³）。 */
		const volumeCm3 = (Math.PI * Math.pow(d / 2, 2) * l) / 1000;
		const steelMass = volumeCm3 * steelDensity;
		const titaniumMass = volumeCm3 * grade.density;
		const saving = steelMass > 0 ? ((steelMass - titaniumMass) / steelMass) * 100 : 0;
		return { volumeCm3, steelMass, titaniumMass, saving };
	}, [diameter, length, grade, steelDensity]);

	const round = (n: number, digits = 2) => n.toFixed(digits);

	return (
		<div className="rounded-lg border border-blue-light p-16 lg:p-24">
			<div className="grid grid-cols-1 gap-16 md:grid-cols-3">
				<label className="flex flex-col gap-8">
					<span className="text-p-sm font-bold text-blue-dark3">Titanium grade</span>
					<select
						className="rounded border border-blue-70 bg-white p-8 text-p-sm text-gray"
						value={gradeId}
						onChange={(e) => setGradeId(e.target.value)}
					>
						{grades.map((g) => (
							<option key={g.id} value={g.id}>
								{g.name} ({g.density} g/cm³)
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-8">
					<span className="text-p-sm font-bold text-blue-dark3">Nominal diameter (mm)</span>
					<select
						className="rounded border border-blue-70 bg-white p-8 text-p-sm text-gray"
						value={diameter}
						onChange={(e) => setDiameter(e.target.value)}
					>
						{DIAMETERS.map((d) => (
							<option key={d} value={String(d)}>
								M{d}
							</option>
						))}
					</select>
				</label>

				<label className="flex flex-col gap-8">
					<span className="text-p-sm font-bold text-blue-dark3">Length under head (mm)</span>
					<input
						type="number"
						min="1"
						step="1"
						className="rounded border border-blue-70 bg-white p-8 text-p-sm text-gray"
						value={length}
						onChange={(e) => setLength(e.target.value)}
					/>
				</label>
			</div>

			{result && (
				<div className="mt-24 border-t border-blue-70 pt-24">
					<dl className="grid grid-cols-1 gap-16 md:grid-cols-3">
						<div>
							<dt className="text-p-sm text-gray-medium">{steelName} (nominal)</dt>
							<dd className="text-h4 text-blue-dark3">{round(result.steelMass)} g</dd>
						</div>
						<div>
							<dt className="text-p-sm text-gray-medium">
								{grade.name} (nominal)
							</dt>
							<dd className="text-h4 text-blue-dark3">{round(result.titaniumMass)} g</dd>
						</div>
						<div>
							<dt className="text-p-sm text-gray-medium">Weight saving</dt>
							<dd className="text-h4 text-blue-dark3">{round(result.saving, 1)} %</dd>
						</div>
					</dl>

					<p className="mt-16 text-p-sm text-gray-medium">
						Shank volume {round(result.volumeCm3, 3)} cm³ · densities{' '}
						{steelDensity} g/cm³ ({steelName}) and {grade.density} g/cm³ ({grade.name}).
					</p>
				</div>
			)}

			<p className="mt-24 border-t border-blue-70 pt-16 text-p-sm text-gray">
				Estimate only, calculated from published nominal densities for a cylindrical shank.
				Heads, thread roots, flanges and coatings are not modelled, and this is not a
				weighed value. Torque, preload and friction are deliberately not estimated.
			</p>
		</div>
	);
}
