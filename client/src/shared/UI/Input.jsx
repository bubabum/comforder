import { twMerge } from "tailwind-merge";

export default function Input({
	className = '',
	type,
	variant = 'default',
	...props
}) {
	const baseStyles = 'h-6 px-2 py-1 rounded-md appearance-auto font-medium outline-none bg-surface text-text-primary placeholder:text-text-muted border border-border hover:border-slate-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed';

	const types = {
		number: 'w-20',
		file: 'p-0  file:h-full file:p-3 file:mr-3 text-text-secondary file:border-r file:border-border-light file:bg-card-hover hover:file:bg-primary-light file:transition-all',
		// secondary: 'bg-gray-200 hover:bg-gray-300',
		// add: 'text-white bg-teal-600 hover:bg-teal-500',
		// delete: 'bg-zinc-100 text-zinc-600 border-1 border-zinc-200 hover:bg-zinc-200'
	}

	const variants = {
		default: 'text-xs',
		partialPayment: 'text-base h-11 w-full pr-10',
		discountAmount: 'text-lg',
		phone: 'w-30 text-xs',
		email: 'w-60 text-xs',
	}


	return (
		<input type={type} className={twMerge(baseStyles, types[type], variants[variant], className)} {...props} />
	)
}