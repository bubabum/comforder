import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setPartialPayment } from '../orderSlice';
import { selectOrderSummary } from '../selectors/selectOrderSummary';
import NumberInput from '../../../shared/UI/NumberInput';


export default function PartiallyPaymentForm() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { partialPayment } = order;
	const { orderTotal, orderFinalTotal } = selectOrderSummary(order);

	const clampPartialPayment = (value) => {
		return Number(value) > orderFinalTotal ? orderFinalTotal : Number(value)
	}

	return (
		<div className='p-5 flex flex-col gap-5 bg-surface border border-border-light rounded-lg'>
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
			<div className='flex justify-between text-text-primary'>
				<div className='font-medium'>Залишок:</div>
				<div className='text-xl font-medium'>₴ {(orderFinalTotal - partialPayment).toFixed(2)}</div>
			</div>
		</div>
	)
}