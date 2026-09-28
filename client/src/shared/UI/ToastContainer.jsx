import { useSelector } from 'react-redux';
import Toast from './Toast';

export default function ToastContainer() {
	const toasts = useSelector((state) => state.toast);

	return (
		<div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-50">
			{toasts.map((toast) => (
				<Toast key={toast.id} {...toast} />
			))}
		</div>
	);
}