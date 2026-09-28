import { twMerge } from "tailwind-merge";

export default function Select({
	children,
	className = '',
	variant = 'default',
	...props
}) {
	const baseStyles = 'flex items-center jystify-center h-6 px-1 outline-none rounded-md text-xs font-medium bg-surface text-text-primary placeholder:text-text-muted border border-border focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

	const variants = {
		default: 'w-30',
		color: 'w-25',
		coating: 'w-30',
		thickness: 'w-15',
		formField: 'h-10 text-sm',
	}

	return (
		<select className={twMerge(baseStyles, variants[variant], className)} {...props}>
			{children}
		</select>
	)
}