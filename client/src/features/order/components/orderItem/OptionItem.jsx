import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useGetProductOptionsByProductIdQuery } from '../../../../store/api/productOptionsApi';
import { updateItem, removeItem } from '../../orderSlice';
import { getItemTotal } from '../../utils/orderCalculations';
import { AlertCircle } from 'lucide-react';
import Loader from '../../../../shared/UI/Loader';
import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';
import Select from '../../../../shared/UI/Select';
import OrderItemName from './OrderItemName';
import OrderItemUnits from './OrderItemUnits';
import OrderItemTotal from './OrderItemTotal';

export default function OptionItem({ item }) {
	const {
		data: options = [],
		isLoading,
		error,
	} = useGetProductOptionsByProductIdQuery(item.productId)

	const dispatch = useDispatch();
	const { price, optionId, quantity } = item.data;

	useEffect(() => {
		if (!options.length || item.data.optionId != null) return
		dispatch(updateItem({
			id: item.id,
			optionId: options[0].id,
			optionName: options[0].name,
			price: options[0].price,
		}));
	}, [options, item.data.optionId, item.id, dispatch])

	const getOptionPrice = id => {
		return options.find(o => o.id === id).price || null
	}

	return (
		<div className='flex justify-between text-sm'>
			<OrderItemName>{item.name}</OrderItemName>
			<div className='flex gap-1 items-center'>
				{isLoading ? (
					<div className='w-30'>
						<Loader className='size-4' />
					</div>

				) : error ? (
					<div
						className="w-30 flex items-center justify-center text-red-500"
						title="Не вдалося завантажити опції"
					>
						<AlertCircle size={20} />
					</div>
				) : (
					<Select
						value={optionId ?? ''}
						onChange={e => {
							const id = Number(e.target.value);
							dispatch(updateItem({
								id: item.id,
								optionId: id,
								optionName: options.find(o => o.id === id).name,
								price: getOptionPrice(id),
							}));
						}}
					>
						{options.map(option => (
							<option key={option.id} value={option.id}>
								{option.name}
							</option>
						))}
					</Select>
				)}
				<NumberInput
					disabled={isLoading || !!error}
					min={0}
					step={item.quantityStep}
					value={quantity}
					onChange={quantity => dispatch(updateItem({ id: item.id, quantity }))}
				/>
				<OrderItemUnits>{item.unitName}</OrderItemUnits>
				<NumberInput
					disabled={isLoading || !!error}
					min={0}
					step={1}
					value={price}
					onChange={price => dispatch(updateItem({ id: item.id, price }))}
				/>
				<OrderItemTotal>{getItemTotal(item).toFixed(2)}</OrderItemTotal>
				<Button variant="delete" icon='trash' onClick={() => dispatch(removeItem(item.id))}></Button>
			</div>
		</div>
	);
}