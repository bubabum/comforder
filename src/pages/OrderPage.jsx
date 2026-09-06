import Page from '../shared/UI/Page'
import ProductSelector from '../features/productSelector/ProductSelector'
import OrderHeader from '../features/order/components/OrderHeader'
import Order from '../features/order/components/Order'
import OrderSummary from '../features/order/components/OrderSummary'

export default function OrderPage() {
	return (
		<Page>
			<ProductSelector />
			<div className='w-full h-full flex flex-col bg-background p-2'>
				<OrderHeader />
				<div className='flex-1 min-h-0 flex gap-2'>
					<Order />
					<OrderSummary />
				</div>
			</div>
		</Page>
	)
}