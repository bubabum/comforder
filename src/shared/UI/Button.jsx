import { Plus, Trash, Printer, Percent, X, Check, Ban, ArrowDownWideNarrow, Pen, ArrowLeft, Download, Upload } from 'lucide-react';
import { twMerge } from "tailwind-merge";

export default function Button({
	children,
	className = '',
	variant = 'primary',
	icon,
	...props
}) {
	const baseStyles =
		'h-6 px-2 flex items-center justify-center rounded-md text-xs/1 font-normal active:scale-95 cursor-pointer transition-all disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100 focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none'

	const variants = {
		primary: 'text-zinc-100 bg-primary border border-transparent hover:bg-primary-hover',
		secondary: 'bg-white text-text-secondary border border-border hover:bg-primary-light',
		add: 'text-primary hover:bg-primary-light w-[28px]',
		edit: 'text-text-muted hover:bg-amber-50 hover:text-warning active:bg-amber-100 transition-all',
		delete: 'text-text-muted hover:bg-red-50 hover:text-error active:bg-red-100 transition-all',
		discount: 'text-primary hover:bg-primary-light',
		discounted: 'px-0 text-base text-primary hover:text-primary-hover',
		success: 'bg-success text-white hover:brightness-95 active:brightness-90 transition-all',
		warning: 'bg-warning text-white hover:brightness-95 active:brightness-90 transition-all',
		error: 'bg-error text-white hover:brightness-95 active:brightness-90 transition-all',
		successGhost: 'bg-green-50 text-success border border-green-200 hover:bg-green-100 transition-all',
		warningGhost: 'bg-amber-50 text-warning border border-amber-200 hover:bg-amber-100 transition-all',
		errorGhost: 'bg-red-50 text-error border border-red-200 hover:bg-red-100 transition-all',
	}
	const icons = {
		plus: Plus,
		trash: Trash,
		printer: Printer,
		percent: Percent,
		close: X,
		check: Check,
		ban: Ban,
		arrowDownWideNarrow: ArrowDownWideNarrow,
		pen: Pen,
		arrowLeft: ArrowLeft,
		download: Download,
		upload: Upload,
	}

	const Icon = icons[icon];

	return (
		<button className={twMerge(baseStyles, variants[variant], className)} {...props}>
			{children}
			{Icon && <Icon className={`size-3 ${children ? "ml-1" : ''}`} />}
		</button>
	)
}