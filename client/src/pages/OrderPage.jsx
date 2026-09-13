import { useState } from 'react'
import { useSelector } from "react-redux";
import Page from '../shared/UI/Page'
import ProductSelector from '../features/productSelector/ProductSelector'
import OrderHeader from '../features/order/components/OrderHeader'
import Order from '../features/order/components/Order'
import OrderSummary from '../features/order/components/OrderSummary'
import PartiallyPaymentForm from '../features/order/components/PartiallyPaymentForm'
import DiscountForm from '../features/order/components/DiscountForm'

export default function OrderPage() {
	const [discountModalOpened, setDiscountModalOpened] = useState(false);
	const order = useSelector(state => state.order);
	const { isPartiallyPaid } = order;

	return (
		<Page>
			<ProductSelector />
			<div className='w-full h-full flex flex-col bg-background p-2'>
				<OrderHeader />
				<div className='flex-1 min-h-0 flex gap-2'>
					<Order />
					<div className='w-80 flex flex-col gap-2'>
						<OrderSummary discountModalOpened={discountModalOpened} setDiscountModalOpened={setDiscountModalOpened} />
						{isPartiallyPaid && <PartiallyPaymentForm />}
						{discountModalOpened && <DiscountForm discountModalOpened={discountModalOpened} setDiscountModalOpened={setDiscountModalOpened} />}
					</div>
				</div>
			</div>
		</Page>
	)
}