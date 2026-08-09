export default function OrderItemTotal({
	children,
	className = '',
	...props
}) {

	return (
		<div className={`flex items-center ${className}`} {...props}>
			<span className='inline-block w-20 ml-1 text-center font-medium'>{children}</span >
		</div>
	)
}