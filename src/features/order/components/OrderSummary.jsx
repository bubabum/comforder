import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { togglePartialPayment } from '../orderSlice';
import { selectOrderSummary } from '../selectors/selectOrderSummary';
import Button from '../../../shared/UI/Button';
import ToogleCheckbox from '../../../shared/UI/ToogleCheckbox';
import { PRINT_TEMPLATE_TYPES } from '../../../shared/constants/printTemplateTypes';

export default function OrderSummary({ discountModalOpened, setDiscountModalOpened }) {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { isPartiallyPaid, printTemplate } = order;
	const { orderTotal, hasDiscount, finalDiscount, orderFinalTotal } = selectOrderSummary(order);
	const disabledUi = printTemplate === PRINT_TEMPLATE_TYPES.CASHLESS;



	return (
		<div className='w-full p-5 flex flex-col justify-between bg-surface border border-border-light rounded-lg'>
			<div className='flex flex-col'>
				<div className='pb-2 text-m text-text-primary border-b border-border-light font-medium'>Підсумок</div>
				<div className='flex gap-5 py-5'>
					<div className='text-sm font-medium text-text-secondary'>Передплата</div>
					<ToogleCheckbox state={isPartiallyPaid} disabled={disabledUi} onChange={() => dispatch(togglePartialPayment(!isPartiallyPaid))}></ToogleCheckbox>
				</div>
				<div className='flex flex-col gap-2 pb-5'>
					<div className='flex justify-between text-text-secondary'>
						<div>До оплати:</div>
						<div>₴ {orderTotal.toFixed(2)}</div>
					</div>
					<div className='flex justify-between text-text-secondary'>
						<div>Знижка:</div>
						{hasDiscount
							? <Button variant="discounted" onClick={() => setDiscountModalOpened(!discountModalOpened)}>₴ {finalDiscount.toFixed(2)}</Button>
							: <Button variant="discount" icon='percent' onClick={() => setDiscountModalOpened(!discountModalOpened)}>Додати</Button>}
					</div>
				</div>
				<div className='flex justify-between items-center py-5 border-t border-border-light text-text-primary'>
					<div className='font-medium'>Всього:</div>
					<div className='text-2xl font-bold'>₴ {orderFinalTotal.toFixed(2)}</div>
				</div>
			</div>
		</div>
	);
}