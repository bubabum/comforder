import { useState, useEffect, useRef } from 'react'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCategories } from '../../../store/referenceData/referenceDataSelectors';
import {
	reset,
	resetPartialPayment,
	setDate,
	setCustomerPhone,
	setCustomerEmail,
	setPrintTemplate,
	setItems,
} from '../orderSlice';
import { useReactToPrint } from "react-to-print";
import { sortByCategory } from '../utils/sortByCategory';
import { PRINT_TEMPLATE_TYPES, PRINT_TEMPLATE_OPTIONS } from '../../../shared/constants/printTemplateTypes';
import { selectOrderSummary } from '../selectors/selectOrderSummary';
import OrderItem from './orderItem/OrderItem';
import CustomerSelect from './CustomerSelect';
import Button from '../../../shared/UI/Button';
import Input from '../../../shared/UI/Input';
import Select from '../../../shared/UI/Select';
import ToogleCheckbox from '../../../shared/UI/ToogleCheckbox';

export default function Order() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { items, date, customerPhone, customerEmail, printTemplate } = order;
	const categories = useSelector(selectCategories);
	const contentRef = useRef(null);
	const reactToPrintFn = useReactToPrint({ contentRef });
	const TemplateComponent = PRINT_TEMPLATE_OPTIONS.find(p => p.id === printTemplate).template;
	const title = PRINT_TEMPLATE_OPTIONS.find(p => p.id === printTemplate).title;

	const handleChangePrintTemplate = printTemplate => {
		dispatch(setPrintTemplate(printTemplate))
		if (printTemplate === PRINT_TEMPLATE_TYPES.CASHLESS) return dispatch(resetPartialPayment())
	}

	return (
		<div className='h-full flex flex-col grow bg-background p-2'>
			<div className='flex justify-between gap-2 py-2'>
				<div className='flex gap-2'>
					<h2 className='font-medium'>Замовлення</h2 >
					<Input type="date" value={date.split("T")[0]} onChange={e => dispatch(setDate(new Date(e.target.value).toISOString()))} />
				</div>
				<div className='flex gap-2'>
					<Select value={printTemplate} onChange={e => handleChangePrintTemplate(e.target.value)}>
						{PRINT_TEMPLATE_OPTIONS.map(p => (<option key={p.id} value={p.id}>{p.title}</option>))}
					</Select>
					<Button variant="primary" onClick={reactToPrintFn}>Друк</Button>
					<div className='hidden print:block' ref={contentRef}>
						{<TemplateComponent title={title} order={order} />}
					</div>
					<Button variant='success' icon="plus" onClick={() =>
						dispatch(reset())
					}>Створити</Button>
				</div>
			</div>
			<div className='grow bg-surface border border-border-light rounded-lg p-3 overflow-y-auto scrollbar-gutter-stable'>
				<div className='flex justify-between'>
					<div className='flex items-center gap-2 pb-5 '>
						<CustomerSelect />
						<div className='text-xs text-text-secondary'>тел:</div>
						<Input variant='phone' value={customerPhone} onChange={e => dispatch(setCustomerPhone(e.target.value))}></Input>
						<div className='text-xs text-text-secondary'>email:</div>
						<Input variant='email' value={customerEmail} onChange={e => dispatch(setCustomerEmail(e.target.value))}></Input>
					</div >
					<div>
						<Button variant="secondary" icon="arrowDownWideNarrow" onClick={() => dispatch(setItems(sortByCategory(items, categories)))
						}>За категорією</Button>
					</div>
				</div>
				<div className='divide-y divide-border-light'>
					<div className='flex justify-between text-xs text-text-muted pb-2'>
						<div>Товар</div>
						<div className='flex space-x-1.5'>
							<div className='w-20 text-center'>Кількість</div>
							<div className='w-10'>Од.</div>
							<div className='w-20'>Ціна</div>
							<div className='w-20 text-center'>Сума</div>
							<div className='w-7'></div>
						</div>
					</div>
					{items.map(item => (
						<div key={item.id} className='bg-white py-3'>
							<OrderItem item={item} />
						</div>
					))}
				</div>
			</div>
		</div >
	);
}