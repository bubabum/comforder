import { useDispatch } from 'react-redux';
import { updateItem, removeItem } from '../../orderSlice';
import { getItemTotal, getUnits } from '../../utils/orderCalculations';
import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';
import OrderItemName from './OrderItemName';
import OrderItemUnits from './OrderItemUnits';
import OrderItemTotal from './OrderItemTotal';

export default function QuantityItem({ item }) {
	const dispatch = useDispatch();
	const { price, quantity } = item.data;

	return (
		<div className='flex justify-between text-sm'>
			<OrderItemName>{item.name}</OrderItemName>
			<div className='flex gap-1'>
				<NumberInput
					min={0}
					step={item.quantityStep}
					value={quantity}
					onChange={quantity => dispatch(updateItem({ id: item.id, quantity }))}
				/>
				<OrderItemUnits>{getUnits(item)}</OrderItemUnits>
				<NumberInput
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