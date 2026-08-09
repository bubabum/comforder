import Page from '../shared/UI/Page'
import ProductSelector from '../features/productSelector/ProductSelector'
import Order from '../features/order/components/Order'
import OrderSummary from '../features/order/components/OrderSummary'

export default function OrderPage() {
	return (
		<Page>
			<ProductSelector />
			<Order />
			<OrderSummary />
		</Page>
	)
}