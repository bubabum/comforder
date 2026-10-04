import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";

/* ------------------------------------------------------------------
 * useClickOutside — спільний хук для закриття dropdown при кліку поза ним.
 * Приймає масив ref'ів (тригер + меню), бо меню тепер рендериться
 * через портал окремо від тригера і контейнер .contains() більше
 * не бачить його як "усередині" себе.
 * ------------------------------------------------------------------ */
function useClickOutside(onOutside, refs) {
	useEffect(() => {
		function handler(e) {
			const isInside = refs.some((r) => r.current && r.current.contains(e.target));
			if (!isInside) onOutside();
		}
		document.addEventListener("mousedown", handler);
		return () => document.removeEventListener("mousedown", handler);
	}, [onOutside, refs]);
}

/* ------------------------------------------------------------------
 * useMenuPosition — рахує ФІКСОВАНІ (viewport) координати меню так,
 * щоб воно завжди лишалось у межах вікна — незалежно від того, чи
 * тригер лежить усередині прокручуваного контейнера (таблиця, модалка
 * з overflow тощо). Меню рендериться через портал у document.body,
 * тому рахуємо position: fixed від країв вікна, а не відносні offset'и.
 *
 * Горизонталь: тригер у правій половині екрана → меню розкривається
 * ліворуч (right-aligned), у лівій половині → праворуч (left-aligned).
 * Явний align має пріоритет над автовизначенням.
 *
 * Вертикаль: якщо знизу від тригера не вистачає місця під меню (і
 * згори місця більше) — меню розкривається ВГОРУ від тригера, а не
 * вниз. Інакше — як завжди, під тригером.
 *
 * triggerRef — кнопка-тригер (position не важливий, просто для rect).
 * menuRef — сама панель меню (усередині портал-контейнера).
 * align — "left" | "right" | "auto".
 * ------------------------------------------------------------------ */
function useMenuPosition(triggerRef, menuRef, isOpen, align = "auto") {
	const [style, setStyle] = useState({ position: "fixed", visibility: "hidden" });

	useLayoutEffect(() => {
		if (!isOpen) return;

		function recalc() {
			const trigger = triggerRef.current;
			const menu = menuRef.current;
			if (!trigger || !menu) return;

			const margin = 8;
			const gap = 4; // відступ меню від тригера
			const triggerRect = trigger.getBoundingClientRect();
			const menuWidth = menu.offsetWidth;
			const menuHeight = menu.offsetHeight;
			const viewportWidth = window.innerWidth;
			const viewportHeight = window.innerHeight;

			// --- Горизонталь ---
			const triggerCenter = triggerRect.left + triggerRect.width / 2;
			const effectiveAlign =
				align === "auto"
					? triggerCenter > viewportWidth / 2
						? "right"
						: "left"
					: align;

			let left =
				effectiveAlign === "right"
					? triggerRect.right - menuWidth
					: triggerRect.left;

			const maxLeft = Math.max(margin, viewportWidth - menuWidth - margin);
			left = Math.min(Math.max(left, margin), maxLeft);

			// --- Вертикаль ---
			const spaceBelow = viewportHeight - triggerRect.bottom;
			const spaceAbove = triggerRect.top;
			const opensUp = spaceBelow < menuHeight + gap && spaceAbove > spaceBelow;

			let top = opensUp
				? triggerRect.top - menuHeight - gap
				: triggerRect.bottom + gap;

			// підстраховка, якщо навіть "кращий" бік не вміщує меню повністю
			top = Math.min(Math.max(top, margin), viewportHeight - menuHeight - margin);

			setStyle({ position: "fixed", top, left, visibility: "visible" });
		}

		recalc();
		window.addEventListener("resize", recalc);
		window.addEventListener("scroll", recalc, true);
		return () => {
			window.removeEventListener("resize", recalc);
			window.removeEventListener("scroll", recalc, true);
		};
	}, [isOpen, align, triggerRef, menuRef]);

	return style;
}

// Базові стилі кнопки-тригера "за замовчуванням"
const DEFAULT_TRIGGER_CLASSES =
	"cursor-pointer flex items-center gap-1 rounded-md border border-border bg-white px-3 py-2 text-xs/1 text-text-secondary font-medium hover:bg-gray-50 focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none";

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
 *   triggerClassName="border-purple-400 text-purple-700"
 *   unstyledTrigger
 * />
 *
 * Меню рендериться через портал у document.body — працює коректно
 * навіть якщо Dropdown лежить усередині прокручуваної таблиці/модалки.
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
	const triggerRef = useRef(null);
	const menuRef = useRef(null);
	useClickOutside(() => setIsOpen(false), [triggerRef, menuRef]);
	const menuPositionStyle = useMenuPosition(triggerRef, menuRef, isOpen, "auto");
	const selected = options.find((opt) => opt.value === value);

	return (
		<div ref={triggerRef} className="relative w-56 font-sans">
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

			{isOpen &&
				createPortal(
					<ul
						ref={menuRef}
						style={{ ...menuPositionStyle, width: triggerRef.current?.offsetWidth }}
						className="z-50 max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white p-1 shadow-lg"
					>
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
					</ul>,
					document.body
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
 *   triggerClassName="bg-blue-600 text-white border-none hover:bg-blue-700"
 *   unstyledTrigger
 * />
 *
 * trigger={(isOpen) => <MyIcon active={isOpen} />} — кастомний тригер
 * без дефолтних класів кнопки.
 *
 * align — "left" | "right" | "auto" (за замовчуванням "auto") —
 * горизонтальне вирівнювання, автовизначення за позицією тригера.
 * Вертикально меню саме вирішує, розкриватись вниз чи вгору, залежно
 * від вільного місця над/під тригером.
 *
 * Меню рендериться через портал у document.body: не обрізається
 * жодним overflow:hidden/auto батьківських контейнерів (таблиці,
 * модалки зі скролом тощо) і завжди лишається в межах вікна.
 * ------------------------------------------------------------------ */
export function DropdownMenu({
	trigger = "Меню",
	items = [],
	align = "auto",
	triggerClassName = "",
	unstyledTrigger = false,
	hideArrow = false,
}) {
	const [isOpen, setIsOpen] = useState(false);
	const triggerRef = useRef(null);
	const menuRef = useRef(null);
	useClickOutside(() => setIsOpen(false), [triggerRef, menuRef]);
	const menuPositionStyle = useMenuPosition(triggerRef, menuRef, isOpen, align);
	const isCustomTrigger = typeof trigger === "function";

	return (
		<div ref={triggerRef} className="relative inline-block font-sans">
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
						{!hideArrow &&
							<svg
								className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`}
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
							</svg>
						}
					</>
				)}
			</button>

			{isOpen &&
				createPortal(
					<div
						ref={menuRef}
						style={menuPositionStyle}
						className="z-50 w-48 rounded-md border border-gray-200 bg-white p-1 shadow-lg"
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
					</div>,
					document.body
				)}
		</div>
	);
}