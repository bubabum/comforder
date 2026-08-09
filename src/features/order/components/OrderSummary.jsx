import { useState, useEffect } from 'react'
import { useRef } from 'react';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { togglePartialPayment, setPartialPayment, setOrder } from '../orderSlice';
import { selectOrderSummary } from '../selectors/selectOrderSummary';
import Discount from './Discount';
import Button from '../../../shared/UI/Button';
import Input from '../../../shared/UI/Input';
import NumberInput from '../../../shared/UI/NumberInput';
import ToogleCheckbox from '../../../shared/UI/ToogleCheckbox';
import { PRINT_TEMPLATE_TYPES } from '../../../shared/constants/printTemplateTypes';

export default function OrderSummary() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { items, discount, partialPayment, isPartiallyPaid, printTemplate } = order;
	const [discountModalOpened, setDiscountModalOpened] = useState(false);
	const { orderTotal, hasDiscount, finalDiscount, orderFinalTotal } = selectOrderSummary(order);
	const disabledUi = printTemplate === PRINT_TEMPLATE_TYPES.CASHLESS;
	const fileInputRef = useRef(null);

	useEffect(() => {
		if (printTemplate === PRINT_TEMPLATE_TYPES.CASHLESS) {
			setDiscountModalOpened(false);
		}
	}, [printTemplate]);

	const clampPartialPayment = (value) => {
		return Number(value) > orderFinalTotal ? orderFinalTotal : Number(value)
	}

	const exportOrder = async () => {
		const handle = await window.showSaveFilePicker({
			suggestedName: "order.json",
			types: [{
				description: 'JSON file',
				accept: { 'application/json': ['.json'] }
			}]
		});
		const writable = await handle.createWritable();
		await writable.write(JSON.stringify(order, null, 2));
		await writable.close();
	}

	const importOrder = async () => {
		const file = fileInputRef.current.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target.result);
				dispatch(setOrder(json));
				fileInputRef.current.value = '';
			} catch (err) {
				console.error('Invalid JSON file', err);
			}
		};

		reader.readAsText(file);
	}

	return (
		<div className='w-80 p-5 flex flex-col justify-between bg-surface border-l border-border-light'>
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
							: <Button variant="discount" icon='percent' disabled={disabledUi} onClick={() => setDiscountModalOpened(!discountModalOpened)}>Додати</Button>}
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
				{discountModalOpened && <Discount discountModalOpened={discountModalOpened} setDiscountModalOpened={setDiscountModalOpened} />}
			</div>
			<div className='flex flex-col gap-2'>
				<div className='flex gap-2'>
					<Button className="h-10" variant="secondary" icon="download" onClick={exportOrder}>Експорт</Button>
					<Button className="h-10" variant="secondary" icon="upload" onClick={importOrder}>Імпорт</Button>
				</div>
				<Input className="h-10 w-full" ref={fileInputRef} type="file"></Input>
			</div>
		</div>
	);
}