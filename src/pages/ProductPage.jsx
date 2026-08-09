import Product from "../features/products/Product"
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectProductById } from "../store/referenceData/referenceDataSelectors";

export default function ProductPage() {
	const { id } = useParams();
	///console.log(id) /////////
	const product = useSelector(state => selectProductById(state, id))
	if (!product) return
	return (
		<Product product={product} />
	)
}