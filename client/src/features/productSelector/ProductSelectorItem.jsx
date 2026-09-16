import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addItem } from '../order/orderSlice';
import { createOrderItem } from '../order/utils/createOrderItem';
import Button from '../../shared/UI/Button';
import Loader from "../../shared/UI/Loader";
// import { useLazyGetProductOptionsByProductIdQuery } from "../../store/api/productOptionsApi";

export default function ProductSelectorItem({ product, index }) {
	const referenceData = useSelector(state => state.referenceData);
	const dispatch = useDispatch();
	const handleAddItem = async (product) => {
		dispatch(addItem(createOrderItem(product, referenceData)))
	}
	return (
		<li className="flex gap-2 justify-between items-center py-1 text-sm">
			<div className="text-xs">{product.name}</div>
			<Button variant="add" icon='plus' onClick={() => handleAddItem(product)} ></Button>
		</li>
	)
}