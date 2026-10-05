import { useEffect, useState } from "react";
import Input from "./Input";

function formatValue(value) {
	return Number.isFinite(value) ? String(value) : "";
}

function clamp(value, min, max) {
	if (min !== undefined) value = Math.max(value, min);
	if (max !== undefined) value = Math.min(value, max);
	return value;
}

export default function NumberInput({
	label = null,
	value,
	onChange,
	emptyValue = 0,
	min,
	max,
	...props
}) {
	const [text, setText] = useState(formatValue(value));

	useEffect(() => {
		setText(formatValue(value));
	}, [value]);

	const handleChange = (e) => {
		// Зберігаємо саме текст, щоб можна було вводити
		// "-", "1.", "0.", "1e" тощо.
		setText(e.target.value);
	};

	const handleBlur = () => {
		// Якщо поле порожнє
		if (text === "") {
			const normalized = clamp(emptyValue, min, max);

			if (normalized !== value) {
				onChange?.(normalized);
			}

			setText(formatValue(normalized));
			return;
		}

		let num = Number(text);

		// Якщо введене значення не є валідним числом,
		// повертаємо попереднє.
		if (!Number.isFinite(num)) {
			setText(formatValue(value));
			return;
		}

		num = clamp(num, min, max);

		setText(formatValue(num));

		if (num !== value) {
			onChange?.(num);
		}
	};

	if (label) return (
		<div className="relative">
			<Input
				className="pr-5"
				type="number"
				value={text}
				onChange={handleChange}
				onBlur={handleBlur}
				min={min}
				max={max}
				{...props}
			/>
			<div className="absolute text-xs text-text-secondary top-1 right-1">{label}</div>
		</div>
	)

	return (
		<Input
			className="pr-0"
			type="number"
			value={text}
			onChange={handleChange}
			onBlur={handleBlur}
			min={min}
			max={max}
			{...props}
		/>
	);
}