import { useState, useRef } from 'react';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { PRINT_TEMPLATE_TYPES, PRINT_TEMPLATE_OPTIONS } from '../../../shared/constants/printTemplateTypes';
import {
	resetPartialPayment,
	setPrintTemplate,
} from '../orderSlice';
import Button from '../../../shared/UI/Button';
import Select from '../../../shared/UI/Select';

export default function PrintForm() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { printTemplate } = order;
	const contentRef = useRef(null);
	const reactToPrintFn = useReactToPrint({ contentRef });
	const TemplateComponent = PRINT_TEMPLATE_OPTIONS.find(p => p.id === printTemplate).template;
	const title = PRINT_TEMPLATE_OPTIONS.find(p => p.id === printTemplate).title;

	const handleChangePrintTemplate = printTemplate => {
		dispatch(setPrintTemplate(printTemplate))
		if (printTemplate === PRINT_TEMPLATE_TYPES.CASHLESS) return dispatch(resetPartialPayment())
	}

	return (
		<div className='flex gap-2'>
			<Select className='w-40' value={printTemplate} onChange={e => handleChangePrintTemplate(e.target.value)}>
				{PRINT_TEMPLATE_OPTIONS.map(p => (<option key={p.id} value={p.id}>{p.title}</option>))}
			</Select>
			<Button variant="primary" icon="printer" onClick={reactToPrintFn}>Друк</Button>
			<div className='hidden print:block' ref={contentRef}>
				{<TemplateComponent title={title} order={order} />}
			</div>
		</div>
	)
}