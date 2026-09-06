import { useState } from 'react'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { togglePartialPayment, setPartialPayment } from '../orderSlice';
import { selectOrderSummary } from '../selectors/selectOrderSummary';
import DiscountForm from './DiscountForm';
import Button from '../../../shared/UI/Button';
import NumberInput from '../../../shared/UI/NumberInput';
import ToogleCheckbox from '../../../shared/UI/ToogleCheckbox';
import { PRINT_TEMPLATE_TYPES } from '../../../shared/constants/printTemplateTypes';

export default function OrderSummary() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { partialPayment, isPartiallyPaid, printTemplate } = order;
	const [discountModalOpened, setDiscountModalOpened] = useState(false);
	const { orderTotal, hasDiscount, finalDiscount, orderFinalTotal } = selectOrderSummary(order);
	const disabledUi = printTemplate === PRINT_TEMPLATE_TYPES.CASHLESS;

	const clampPartialPayment = (value) => {
		return Number(value) > orderFinalTotal ? orderFinalTotal : Number(value)
	}

	return (
		<div className='self-start w-80 p-5 flex flex-col justify-between bg-surface border border-border-light rounded-lg'>
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
				{isPartiallyPaid &&
					<div className='flex flex-col gap-2 border-t border-border-light pt-5'>
						<div className='flex justify-between items-center gap-5 text-text-secondary'>
							<div>Передплата:</div>
							<div className='relative'>
								<NumberInput
									variant="partialPayment"
									min={0}
									max={orderTotal}
									step={1}
									value={partialPayment}
									onChange={partialPayment => dispatch(setPartialPayment(clampPartialPayment(partialPayment)))} />
								<div className='text-text-muted absolute right-3 top-1/2 -translate-y-1/2'>грн</div>
							</div>
						</div>
						<div className='flex justify-between py-5 text-text-primary'>
							<div className='font-medium'>Залишок:</div>
							<div className='text-xl font-medium'>₴ {(orderFinalTotal - partialPayment).toFixed(2)}</div>
						</div>
					</div>}
				{discountModalOpened && <DiscountForm discountModalOpened={discountModalOpened} setDiscountModalOpened={setDiscountModalOpened} />}
			</div>
		</div>
	);
}