import { useDispatch } from 'react-redux';
import { updateSheet, removeSheet } from '../../orderSlice';
import Button from '../../../../shared/UI/Button';
import NumberInput from '../../../../shared/UI/NumberInput';

export default function Sheet({ id, sheet }) {
	const dispatch = useDispatch();
	return (
		<div className='flex gap-2 text-xs items-center'>
			<NumberInput
				min={0}
				step={0.1}
				value={sheet.length}
				onChange={(length) => dispatch(updateSheet({ id: id, sheetId: sheet.id, length }))}
			/>
			<div>м</div>
			<NumberInput
				min={1}
				step={1}
				value={sheet.quantity}
				onChange={(quantity) => dispatch(updateSheet({ id: id, sheetId: sheet.id, quantity }))}
			/>
			<div>шт.</div>
			<Button variant="delete" icon='trash' onClick={() => dispatch(removeSheet({ id, sheetId: sheet.id }))}></Button>
		</div>
	);
}