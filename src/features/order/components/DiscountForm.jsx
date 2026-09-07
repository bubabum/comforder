import { useState, useEffect } from 'react'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setDiscountType, setDiscountAmount, setDiscountToSheetItems, resetDiscount } from '../orderSlice';
import Button from '../../../shared/UI/Button';
import NumberInput from '../../../shared/UI/NumberInput';
import { getOrderTotal } from '../utils/orderCalculations';
import { selectOrderSummary } from '../selectors/selectOrderSummary';
import { DISCOUNT_TYPES } from '../../../shared/constants/discountTypes';
import { DISCOUNT_OPTIONS } from '../../../shared/constants/discountTypes';


export default function DiscountForm({ discountModalOpened, setDiscountModalOpened }) {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { discount } = order;
	const [amount, setAmount] = useState(discount.amount);
	const { orderTotal } = selectOrderSummary(order);

	const discountLabel = DISCOUNT_OPTIONS.find(o => o.id === discount.type)?.label ?? '';

	const clampAmount = amount => {
		switch (discount.type) {
			case DISCOUNT_TYPES.FIXED:
				return Math.min(orderTotal, Math.max(amount, 0));
			case DISCOUNT_TYPES.PERCENTAGE:
				return Math.min(100, Math.max(amount, 0));
			case DISCOUNT_TYPES.SHEET_ITEM_PRICE:
				return amount
			default:
				throw new Error('Unknown discount type');
		}
	}

	useEffect(() => {
		setAmount(clampAmount(amount))
	}, [discount.type])

	const hadleDiscountCancel = () => {
		setDiscountModalOpened(false);
	}

	const hadleDiscountSubmit = () => {
		switch (discount.type) {
			case DISCOUNT_TYPES.SHEET_ITEM_PRICE:
				dispatch(setDiscountToSheetItems(amount));
				return setDiscountModalOpened(false);
			case DISCOUNT_TYPES.FIXED:
			case DISCOUNT_TYPES.PERCENTAGE:
				dispatch(setDiscountAmount(amount));
				return setDiscountModalOpened(false);
			default:
				throw new Error('Unknown discount type');
		}
	}

	return (
		<div className='p-5 gap-5 flex flex-col bg-surface border border-border-light rounded-lg'>
			<div className='flex justify-between border-b border-border-light'>
				<div className='pb-2 text-m text-text-primary  font-medium'>Знижка</div>
				<Button variant="secondary" icon='close' onClick={hadleDiscountCancel}></Button>
			</div>
			<div className=' flex flex-col gap-5'>
				<div className='flex w-full'>
					<div className='relative'>
						<NumberInput
							variant='discountAmount'
							className='h-10 pr-10 w-full border-r-0 rounded-r-none'
							min={0}
							step={1}
							value={amount}
							onChange={amount => setAmount(clampAmount(amount))}
						/>
						<div className='text-text-muted absolute text-base right-3 top-1/2 -translate-y-1/2'>{discountLabel}</div>
					</div>
					<div className='inline-flex'>
						{DISCOUNT_OPTIONS.map((option, index) => {
							return <button
								className={`size-10 outline-none flex justify-center items-center cursor-pointer transition-all 
								${index === DISCOUNT_OPTIONS.length - 1 ? "rounded-r-md" : ""}
								${index !== 0 ? "border-l-0" : ""}
								${option.id === discount.type
										? "bg-primary text-white border-transparent"
										: " bg-white text-text-secondary border border-border hover:bg-primary-light"}`}
								key={option.id}
								onClick={() => dispatch(setDiscountType(option.id))}>
								{<option.icon className='size-4'></option.icon>}
							</button>
						})}
					</div>
				</div>
				<div className='flex justify-end gap-2'>
					{discount.type === "percentage" &&
						<div className='inline-flex justify-center items-center text-xs/0 text-secondary'>{(Math.round(getOrderTotal(order.items) * amount) / 100).toFixed(2)} грн</div>}
					<Button variant="ghost" onClick={() => dispatch(resetDiscount())}>Скасувати</Button>
					<Button variant="success" onClick={hadleDiscountSubmit}>Застосувати</Button>
				</div>
			</div>
		</div >
	);
}