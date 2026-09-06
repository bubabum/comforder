import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useRef } from 'react';
import {
	reset,
	setDate,
	setOrder,
} from '../orderSlice';
import PrintForm from "./PrintForm";
import Button from '../../../shared/UI/Button';
import Input from '../../../shared/UI/Input';
import { DropdownMenu } from "../../../shared/UI/Dropdown";

export default function OrderHeader() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { date } = order;
	const fileInputRef = useRef(null);

	const handleImportClick = () => {
		fileInputRef.current?.click();
	};

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
		<div className='flex justify-between gap-2 py-2'>
			<div className='flex gap-2'>
				<h2 className='font-medium'>Замовлення</h2 >
				<Input type="date" value={date.split("T")[0]} onChange={e => dispatch(setDate(new Date(e.target.value).toISOString()))} />
			</div>
			<div className='flex gap-2'>
				<PrintForm />
				<Input className="w-full" hidden ref={fileInputRef} onChange={importOrder} type="file"></Input>
				<DropdownMenu
					triggerClassName="h-6"
					trigger={<span>Дії</span>}
					items={[
						{ label: "Очистити", onClick: () => dispatch(reset()) },
						{ type: "divider" },
						{ label: "Експорт", onClick: exportOrder },
						{ label: "Імпорт", onClick: handleImportClick },
						// { type: "divider" },
						// { label: "Видалити", onClick: () => { }, danger: true },
						// { label: "Архівувати", onClick: () => { }, disabled: true },
					]}
				/>
				<Button variant='success' icon="plus" onClick={() =>
					dispatch(reset())
				}>Створити</Button>
			</div>
		</div>
	)
}