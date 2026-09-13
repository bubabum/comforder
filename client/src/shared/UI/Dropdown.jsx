import { useState, useRef, useEffect, useLayoutEffect } from "react";

/* ------------------------------------------------------------------
 * useClickOutside — спільний хук для закриття dropdown при кліку поза ним
 * ------------------------------------------------------------------ */
function useClickOutside(onOutside) {
	const ref = useRef(null);
	useEffect(() => {
		function handler(e) {
			if (ref.current && !ref.current.contains(e.target)) onOutside();
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [onOutside]);
	return ref;
}

/* ------------------------------------------------------------------
 * useMenuPosition — рахує inline-style для панелі меню так, щоб вона
 * завжди лишалась у межах вікна, навіть якщо тригер прилип до краю екрана.
 * containerRef — обгортка (position: relative), відносно якої меню absolute.
 * menuRef — сама панель меню.
 * preferredAlign — "left" | "right", початкове бажане вирівнювання.
 * ------------------------------------------------------------------ */
function useMenuPosition(containerRef, menuRef, isOpen, preferredAlign = "left") {
	const [style, setStyle] = useState({});

	useLayoutEffect(() => {
		if (!isOpen) return;

		function recalc() {
			const container = containerRef.current;
			const menu = menuRef.current;
			if (!container || !menu) return;

			const margin = 8; // мінімальний відступ від краю екрана
			const containerRect = container.getBoundingClientRect();
			const menuWidth = menu.offsetWidth;
			const viewportWidth = window.innerWidth;

			// бажана позиція лівого краю меню у координатах вікна
			let desiredLeft =
				preferredAlign === "right"
					? containerRect.right - menuWidth
					: containerRect.left;

			// затискаємо в межах [margin, viewportWidth - menuWidth - margin]
			const maxLeft = Math.max(margin, viewportWidth - menuWidth - margin);
			desiredLeft = Math.min(Math.max(desiredLeft, margin), maxLeft);

			// переводимо у координати відносно контейнера (бо меню position: absolute всередині нього)
			const relativeLeft = desiredLeft - containerRect.left;
			setStyle({ left: relativeLeft, right: "auto" });
		}

		recalc();
		window.addEventListener("resize", recalc);
		window.addEventListener("scroll", recalc, true);
		return () => {
			window.removeEventListener("resize", recalc);
			window.removeEventListener("scroll", recalc, true);
		};
	}, [isOpen, preferredAlign, containerRef, menuRef]);

	return style;
}

// Базові стилі кнопки-тригера "за замовчуванням"
const DEFAULT_TRIGGER_CLASSES =
	"cursor-pointer flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-xs/1 text-text-secondary hover:bg-gray-50 focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none";

function cx(...classes) {
	return classes.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------
 * 1) Dropdown — select-подібний (обираємо одне значення зі списку)
 *
 * <Dropdown
 *   options={[{ label: "Один", value: 1 }, { label: "Два", value: 2 }]}
 *   value={selected}
 *   onChange={(val) => setSelected(val)}
 *   placeholder="Оберіть..."
 *   // додає класи ПОВЕРХ дефолтних стилів кнопки:
 *   triggerClassName="border-purple-400 text-purple-700"
 *   // або повністю замінює дефолтні стилі кнопки своїми:
 *   unstyledTrigger
 * />
 * ------------------------------------------------------------------ */
export function Dropdown({
	options = [],
	value,
	onChange,
	placeholder = "Оберіть...",
	triggerClassName = "",
	unstyledTrigger = false,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useClickOutside(() => setIsOpen(false));
	const selected = options.find((opt) => opt.value === value);

	return (
		<div ref={ref} className="relative w-56 font-sans">
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={cx(
					"flex w-full items-center justify-between",
					!unstyledTrigger && DEFAULT_TRIGGER_CLASSES,
					triggerClassName
				)}
			>
				<span className={selected ? "text-gray-800" : "text-gray-400"}>
					{selected ? selected.label : placeholder}
				</span>
				<svg
					className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
				</svg>
			</button>

			{isOpen && (
				<ul className="absolute z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg">
					{options.length === 0 && (
						<li className="px-3 py-2 text-sm text-gray-400">Немає варіантів</li>
					)}
					{options.map((option) => (
						<li
							key={option.value}
							onClick={() => {
								onChange(option.value);
								setIsOpen(false);
							}}
							className={`cursor-pointer rounded px-3 py-2 text-sm hover:bg-gray-100 ${option.value === value ? "bg-gray-100 font-medium text-gray-900" : "text-gray-700"
								}`}
						>
							{option.label}
						</li>
					))}
				</ul>
			)}
		</div>
	);
}

/* ------------------------------------------------------------------
 * 2) DropdownMenu — меню дій (кнопки типу "Редагувати", "Видалити"...)
 *
 * <DropdownMenu
 *   trigger={<span>Дії</span>}
 *   items={[
 *     { label: "Редагувати", onClick: () => {} },
 *     { label: "Дублювати", onClick: () => {} },
 *     { type: "divider" },
 *     { label: "Видалити", onClick: () => {}, danger: true },
 *     { label: "Архівувати", onClick: () => {}, disabled: true },
 *   ]}
 *   // додає класи ПОВЕРХ дефолтних стилів кнопки-тригера:
 *   triggerClassName="bg-blue-600 text-white border-none hover:bg-blue-700"
 *   // або повністю відмовляється від дефолтних стилів (свій вигляд з нуля):
 *   unstyledTrigger
 * />
 *
 * Якщо потрібен НЕ button-тригер (наприклад іконка чи аватар),
 * можна передати функцію: trigger={(isOpen) => <MyIcon active={isOpen} />}
 * — тоді компонент обгорне її кнопкою без жодних класів.
 *
 * align — лише ПОЧАТКОВЕ бажане вирівнювання ("left" | "right").
 * Реальна позиція завжди автоматично підганяється під видиму область
 * вікна (useMenuPosition), тож меню більше не вилазить за екран,
 * навіть якщо тригер прилип до самого краю.
 * ------------------------------------------------------------------ */
export function DropdownMenu({
	trigger = "Меню",
	items = [],
	align = "left",
	triggerClassName = "",
	unstyledTrigger = false,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useClickOutside(() => setIsOpen(false));
	const menuRef = useRef(null);
	const menuPositionStyle = useMenuPosition(ref, menuRef, isOpen, align);
	const isCustomTrigger = typeof trigger === "function";

	return (
		<div ref={ref} className="relative inline-block font-sans">
			<button
				type="button"
				onClick={() => setIsOpen((prev) => !prev)}
				className={cx(
					isCustomTrigger ? "" : "flex items-center gap-1",
					!unstyledTrigger && !isCustomTrigger && DEFAULT_TRIGGER_CLASSES,
					triggerClassName
				)}
			>
				{isCustomTrigger ? (
					trigger(isOpen)
				) : (
					<>
						{trigger}
						<svg
							className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</>
				)}
			</button>

			{isOpen && (
				<div
					ref={menuRef}
					style={menuPositionStyle}
					className="absolute z-10 mt-1 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
				>
					{items.map((item, i) =>
						item.type === "divider" ? (
							<div key={i} className="my-1 h-px bg-gray-200" />
						) : (
							<button
								key={i}
								type="button"
								disabled={item.disabled}
								onClick={() => {
									if (item.disabled) return;
									item.onClick?.();
									setIsOpen(false);
								}}
								className={`flex w-full items-center gap-2 rounded px-3 py-2 text-left text-sm transition-colors ${item.disabled
									? "cursor-not-allowed text-gray-300"
									: item.danger
										? "text-red-600 hover:bg-red-50"
										: "text-gray-700 hover:bg-gray-100"
									}`}
							>
								{item.icon && <span className="shrink-0">{item.icon}</span>}
								{item.label}
							</button>
						)
					)}
					{items.length === 0 && (
						<div className="px-3 py-2 text-sm text-gray-400">Немає дій</div>
					)}
				</div>
			)}
		</div>
	);
}
