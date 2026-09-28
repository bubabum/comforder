import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeToast } from '../../store/toastSlice';
import { X, CircleCheck, CircleAlert, } from 'lucide-react';

const TYPE_STYLES = {
	success: 'bg-success-toast border border-success-border',
	error: 'bg-error-toast border border-error-border',
};

const ICONS = {
	success: <CircleCheck className='text-success size-6' />,
	error: <CircleAlert className='text-error size-6' />,
}

export default function Toast({ id, message, type }) {
	const dispatch = useDispatch();

	useEffect(() => {
		const timer = setTimeout(() => {
			dispatch(removeToast(id));
		}, 4000);

		return () => clearTimeout(timer);
	}, [id, dispatch]);

	return (
		<div className={`relative min-w-120 flex items-center justify-between gap-5 px-15 py-5 rounded-md text-text-secondary ${TYPE_STYLES[type]}`}>
			<div className='flex items-center gap-5'>
				{ICONS[type]}
				<div className='flex flex-col'>
					<span className="text-sm">{message}</span>
				</div>
			</div>
			<button onClick={() => dispatch(removeToast(id))} className="absolute right-2 top-2 text-text-secondary/80 hover:text-text-secondary">
				<X className='cursor-pointer size-5' />
			</button>
		</div >
	);
}