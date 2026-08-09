export default function OrderItemName({
	children,
	className = '',
	type,
	...props
}) {
	const baseStyles = 'flex items-center text-sm font-medium';

	const variants = {
		color: 'w-25',
		coating: 'w-30',
		thickness: 'w-15',
	}

	return (
		<div className={`${baseStyles} ${variants[type]} ${className}`} {...props}>
			{children}
		</div>
	)
}