export default function OrderItemUnits({
	children,
	className = '',
	...props
}) {

	return (
		<div className='text-xs w-10 flex items-center'>{children}</div>
	)
}