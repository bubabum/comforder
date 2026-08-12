import { useDispatch, useSelector } from 'react-redux';
import { useMaterialSelectionUI } from '../../hooks/useMaterialSelectionUI';

import { selectTrimPrices } from '../../../../store/referenceData/referenceDataSelectors';
import { updateItem, removeItem, addTrim, sortTrims } from '../../orderSlice';

import Trim from './Trim';
import { getItemTotal, getUnits } from '../../utils/orderCalculations';
import { resolveMaterial } from '../../utils/resolveMaterial';

import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';
import Select from '../../../../shared/UI/Select';
import OrderItemName from './OrderItemName';
import OrderItemUnits from './OrderItemUnits';
import OrderItemTotal from './OrderItemTotal';

export default function TrimItem({ item }) {
	const dispatch = useDispatch();
	const trimPrices = useSelector(selectTrimPrices);

	const { width, price, quantity } = item.data;

	const {
		material,
		colorId,
		coatingId,
		thickness,
		colorOptions,
		coatingOptions,
		thicknessOptions,
		handleColorChange,
		handleCoatingChange,
		handleThicknessChange,
	} = useMaterialSelectionUI({
		materialId: item.data.materialId,
		resolveMaterial,
		applyMaterialChange: (material) => {
			dispatch(updateItem({
				id: item.id,
				materialId: material.id,
				price: getDefaultItemPrice(material),
				color: material.color,
				coating: material.coating,
				thickness: material.thickness,
				width: item?.width || width,
			}));
		}
	});

	const getDefaultItemPrice = (newMaterial, newWidth) => {
		if (!newMaterial) return 0;
		const priceType = newMaterial.trimPriceType;
		if (!newWidth && item.priceType === 'fixed') {
			return item.prices?.[priceType] ?? 0;
		}
		const targetWidth = newWidth || Math.ceil(width / 10) * 10;
		return trimPrices[targetWidth]?.[priceType] ?? 0;
	};

	const handleWidthChange = newWidth => {
		dispatch(updateItem({
			id: item.id,
			width: Number(newWidth),
			price: getDefaultItemPrice(material, newWidth),
		}));
	};

	return (
		<div className='flex flex-col gap-2 w-full text-sm'>
			<div className='flex justify-between items-end gap-2'>
				<OrderItemName>{item.name}</OrderItemName>
				<div className='flex items-center gap-1'>
					<Select
						type={'color'}
						value={colorId || ''}
						onChange={e => handleColorChange(e.target.value)}
					>
						{colorOptions.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
					</Select>
					<Select
						type={'coating'}
						value={coatingId || ''}
						onChange={e => handleCoatingChange(e.target.value)}
					>
						{coatingOptions.map(coating => <option key={coating.id} value={coating.id}>{coating.name}</option>)}
					</Select>
					<Select
						type={'thickness'}
						value={thickness || ''}
						onChange={e => handleThicknessChange(e.target.value)}
					>
						{thicknessOptions.map(thickness => <option key={thickness} value={thickness}>{thickness}</option>)}
					</Select>
					<NumberInput
						type="number"
						min={0}
						step={10}
						value={width}
						onChange={(width) => handleWidthChange(width)}
					/>
					<div className='text-xs'>мм</div>
					<NumberInput
						type="number"
						disabled={item.data.trims.length > 0 ? true : false}
						min={0}
						step={item.quantityStep}
						value={quantity}
						onChange={(quantity) => dispatch(updateItem({ id: item.id, quantity }))}
					/>
					<OrderItemUnits>{getUnits(item)}</OrderItemUnits>
					<NumberInput
						type="number"
						min={0}
						step={1}
						value={price}
						onChange={price => dispatch(updateItem({ id: item.id, price }))}
					/>
					<OrderItemTotal>{getItemTotal(item).toFixed(2)}</OrderItemTotal>
					<Button variant="delete" icon='trash' onClick={() => dispatch(removeItem(item.id))}></Button>
				</div>
			</div>
			<div>
				<div className=' flex flex-col gap-1 mb-2'>
					{item.data.trims.map(trim => (
						<Trim key={trim.id} id={item.id} trim={trim} item={item} />
					))}
				</div>
				<div className=' flex gap-1'>
					<Button variant='success' icon="plus" onClick={() =>
						dispatch(addTrim({ id: item.id, trim: { id: crypto.randomUUID(), length: 0, quantity: 1 } }))
					}>Додати планку</Button>
					<Button variant='secondary' icon='arrowDownWideNarrow' onClick={() =>
						dispatch(sortTrims({ id: item.id }))
					}></Button>
					{/* <Button icon='arrowDownWideNarrow' onClick={() =>
						dispatch({
							type: 'SORT_SHEETS',
							payload: { id: item.id },
						})
					}></Button> */}
				</div>
			</div>
		</div>
	);
}