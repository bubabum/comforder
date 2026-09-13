import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCategories } from '../../../store/referenceData/referenceDataSelectors';
import {
	setCustomerPhone,
	setCustomerEmail,
	setItems,
} from '../orderSlice';
import { sortByCategory } from '../utils/sortByCategory';
import OrderItem from './orderItem/OrderItem';
import CustomerSelect from './CustomerSelect';
import Button from '../../../shared/UI/Button';
import Input from '../../../shared/UI/Input';

export default function Order() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const { items, customerPhone, customerEmail } = order;
	const categories = useSelector(selectCategories);
	return (
		<div className="h-full min-h-0 grow bg-surface border border-border-light rounded-lg p-3 flex flex-col">
			<div className="flex justify-between shrink-0">
				<div className="flex items-center gap-2 pb-5">
					<CustomerSelect />
					<div className="text-xs text-text-secondary">тел:</div>
					<Input
						variant="phone"
						value={customerPhone}
						onChange={e => dispatch(setCustomerPhone(e.target.value))}
					/>
					<div className="text-xs text-text-secondary">email:</div>
					<Input
						variant="email"
						value={customerEmail}
						onChange={e => dispatch(setCustomerEmail(e.target.value))}
					/>
				</div>
				<div>
					<Button
						variant="secondary"
						icon="arrowDownWideNarrow"
						onClick={() =>
							dispatch(setItems(sortByCategory(items, categories)))
						}
					>
						За категорією
					</Button>
				</div>
			</div>
			<div className="min-h-0 flex-1 flex flex-col divide-y divide-border-light">
				<div className="shrink-0 flex justify-between text-xs text-text-muted pb-2">
					<div>Товар</div>
					<div className="flex space-x-1.5">
						<div className="w-20 text-center">Кількість</div>
						<div className="w-10">Од.</div>
						<div className="w-20">Ціна</div>
						<div className="w-20 text-center">Сума</div>
						<div className="w-7 mr-4">Дії</div>
					</div>
				</div>
				<div className="flex-1 min-h-0 divide-y divide-border-light overflow-y-auto scrollbar-gutter-stable">
					{items.map(item => (
						<div
							key={item.id}
							className="bg-white py-3 mr-1"
						>
							<OrderItem item={item} />
						</div>
					))}
				</div>
			</div>
		</div>
	);
}