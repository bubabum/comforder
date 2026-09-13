import { useDispatch } from 'react-redux';
import { removeTrim, updateTrim } from '../../orderSlice';
import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';

export default function Trim({ id, trim }) {
	const dispatch = useDispatch();
	return (
		<div className='flex gap-2 text-xs items-center'>
			<NumberInput
				min={0}
				step={0.1}
				value={trim.length}
				onChange={(length) => dispatch(updateTrim({ id: id, trimId: trim.id, length }))}
			/>
			<div>м</div>
			<NumberInput
				min={1}
				step={1}
				value={trim.quantity}
				onChange={(quantity) => dispatch(updateTrim({ id: id, trimId: trim.id, quantity }))}
			/>
			<div>шт.</div>
			<Button variant="delete" icon='trash' onClick={() => dispatch(removeTrim({ id, trimId: trim.id }))}></Button>
		</div>
	);
}