import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useMaterialSelectionUI } from '../../hooks/useMaterialSelectionUI';
import { useTrimPrice } from '../../hooks/useTrimPrice';

import { updateItem, removeItem, addTrim, sortTrims } from '../../orderSlice';

import Trim from './Trim';
import { getItemTotal } from '../../utils/orderCalculations';
import { AlertCircle } from 'lucide-react';
import Loader from '../../../../shared/UI/Loader';
import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';
import Select from '../../../../shared/UI/Select';
import OrderItemName from './OrderItemName';
import OrderItemUnits from './OrderItemUnits';
import OrderItemTotal from './OrderItemTotal';

export default function TrimItem({ item }) {
	const dispatch = useDispatch();
	const { width, quantity } = item.data;

	const {
		isLoading: isLoadingMaterials,
		error: errorMaterials,
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
				price: getPrice(width, material.trimPriceCategoryId),
				color: material.color,
				coating: material.coating,
				thickness: material.thickness,
				width: item?.width || width,
			}));
		}
	});

	const {
		getPrice,
		isLoading: isLoadingPrice,
		error: errorPrice
	} = useTrimPrice({
		item,
		trimPriceType: item.trimPriceType, // 'fixed' | 'widthBased' з самого товару
	});

	const isLoading = isLoadingMaterials || isLoadingPrice;
	const error = errorMaterials || errorPrice;

	const handleWidthChange = width => {
		dispatch(updateItem({
			id: item.id,
			width,
			price: getPrice(width, material.trimPriceCategoryId),
		}));
	};

	useEffect(() => {
		if (!material || item.data.materialId != null) return
		dispatch(updateItem({
			id: item.id,
			materialId: material.id,
			price: getPrice(width, material.trimPriceCategoryId),
			colorName: material.colorName,
			coatingName: material.coatingName,
			thickness: material.thickness,
		}));
	}, [material, item.data.materialId, item.id, width, dispatch])

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
					<NumberInput
						disabled={isLoading || !!error}
						min={0}
						step={10}
						value={width}
						onChange={(width) => handleWidthChange(width)}
					/>
					<div className='text-xs'>мм</div>
					<NumberInput
						disabled={isLoading || !!error || item.data.trims.length > 0}
						min={0}
						step={item.quantityStep}
						value={quantity}
						onChange={(quantity) => dispatch(updateItem({ id: item.id, quantity }))}
					/>
					<OrderItemUnits>{item.unitName}</OrderItemUnits>
					<NumberInput
						disabled={isLoading || !!error}
						min={0}
						step={1}
						value={item.data.price}
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
				</div>
			</div>
		</div>
	);
}