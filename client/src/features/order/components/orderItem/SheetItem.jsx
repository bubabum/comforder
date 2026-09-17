import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMaterialSelectionUI } from '../../hooks/useMaterialSelectionUI';

import { updateItem, removeItem, addSheet, sortSheets } from '../../orderSlice';

import Sheet from './Sheet';
import { getArea, getSheetItemTotal, getDefaultSheetItemPrice } from '../../utils/orderCalculations';
import { AlertCircle } from 'lucide-react';
import Loader from '../../../../shared/UI/Loader';
import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';
import Select from '../../../../shared/UI/Select';
import OrderItemName from './OrderItemName';
import OrderItemUnits from './OrderItemUnits';
import OrderItemTotal from './OrderItemTotal';

export default function SheetItem({ item }) {
	const dispatch = useDispatch();
	const price = item.data.price;

	const {
		isLoading,
		error,
		material,
		colorId,
		coatingId,
		thickness,
		colorOptions,
		coatingOptions,
		thicknessOptions,
		handleChange,
	} = useMaterialSelectionUI({
		materialId: item.data.materialId,
		applyMaterialChange: (material) => {
			dispatch(updateItem({
				id: item.id,
				materialId: material.id,
				price: getDefaultSheetItemPrice(material, item),
				colorName: material.colorName,
				coatingName: material.coatingName,
				thickness: material.thickness,
			}));
		}
	});

	useEffect(() => {
		if (!material || item.data.materialId != null) return
		dispatch(updateItem({
			id: item.id,
			materialId: material.id,
			price: getDefaultSheetItemPrice(material, item),
			colorName: material.colorName,
			coatingName: material.coatingName,
			thickness: material.thickness,
		}));
	}, [material, item, dispatch])

	return (
		<div className='flex flex-col gap-2 w-full text-sm'>
			<div className='flex justify-between items-end gap-2'>
				<OrderItemName>{item.name}</OrderItemName>
				<div className='flex items-center gap-1'>
					{isLoading ? (
						<div className='w-70'>
							<Loader className='size-4' />
						</div>
					) : error ? (
						<div
							className="w-70 flex items-center justify-center text-red-500"
							title="Не вдалося завантажити матеріали"
						>
							<AlertCircle size={20} />
						</div>
					) : (
						<div className='flex items-center gap-1'>
							<Select
								type={'color'}
								value={colorId || ''}
								onChange={e => handleChange({ colorId: Number(e.target.value) })}
							>
								{colorOptions.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
							</Select>
							<Select
								type={'coating'}
								value={coatingId || ''}
								onChange={e => handleChange({ coatingId: Number(e.target.value) })}
							>
								{coatingOptions.map(coating => <option key={coating.id} value={coating.id}>{coating.name}</option>)}
							</Select>
							<Select
								type={'thickness'}
								value={thickness || ''}
								onChange={e => handleChange({ thickness: Number(e.target.value) })}
							>
								{thicknessOptions.map(thickness => <option key={thickness} value={thickness}>{thickness}</option>)}
							</Select>
						</div>
					)}
					<div className='font-medium w-20 text-center'>{getArea(item).toFixed(3)}</div>
					<OrderItemUnits>{item.unitName}</OrderItemUnits>
					<NumberInput
						disabled={isLoading || !!error}
						min={0}
						step={1}
						value={price}
						onChange={price => dispatch(updateItem({ id: item.id, price }))}
					/>
					<OrderItemTotal>{getSheetItemTotal(item).toFixed(2)}</OrderItemTotal>
					<Button variant="delete" icon='trash' onClick={() => dispatch(removeItem(item.id))}></Button>
				</div>
			</div>
			<div>
				<div className=' flex flex-col gap-1 mb-2'>
					{item.data.sheets.map(sheet => (
						<Sheet key={sheet.id} id={item.id} sheet={sheet} />
					))}
				</div>
				<div className=' flex gap-1'>
					<Button variant='success' icon="plus" onClick={() =>
						dispatch(addSheet({ id: item.id, sheet: { id: crypto.randomUUID(), length: 0, quantity: 1 } }))
					}>Додати лист</Button>
					<Button variant='secondary' icon='arrowDownWideNarrow' onClick={() =>
						dispatch(sortSheets({ id: item.id }))
					}></Button>
				</div>
			</div>
		</div >
	);
}