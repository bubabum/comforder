import { PRODUCT_TYPES } from "../../shared/constants/productTypes"
import SheetProduct from "./SheetProduct";
import TrimProduct from "./TrimProduct";
import OptionProduct from "./OptionProduct";
import QuantityProduct from "./QuantityProduct";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams, useSearchParams } from "react-router-dom";
import { useGetProductByIdQuery } from "../../store/api/productsApi";
import Loader from "../../shared/UI/Loader";
import MessageError from "../../shared/UI/MessageError";

const ITEM_COMPONENTS = {
	[PRODUCT_TYPES.SHEET]: SheetProduct,
	[PRODUCT_TYPES.TRIM]: TrimProduct,
	[PRODUCT_TYPES.OPTION]: OptionProduct,
	[PRODUCT_TYPES.QUANTITY]: QuantityProduct,
};

export default function Product() {
	const { id } = useParams();
	const [searchParams] = useSearchParams();
	const isNew = id === "new";
	const duplicatedId = searchParams.get('duplicatedId');
	const isDuplicate = duplicatedId !== null;
	const idToFetch = isDuplicate ? duplicatedId : id;

	const { data: fetchedProduct, isLoading, error } = useGetProductByIdQuery(isNew && !duplicatedId ? skipToken : idToFetch);

	const product = isDuplicate && fetchedProduct
		? { ...fetchedProduct, id: undefined, name: `${fetchedProduct.name} (копія)` }
		: fetchedProduct;

	const needsFetch = !isNew || isDuplicate;

	if (needsFetch && isLoading) return <Loader />;
	if (needsFetch && error) return <MessageError message={`Не вдалося завантажити товар. ${error.data?.error}`} />

	const Component = ITEM_COMPONENTS[product?.type || searchParams.get('type')];

	if (!Component) {
		return <MessageError message={`Некоректний тип товару: ${product?.type || searchParams.get('type')}`} />;
	}

	return <Component product={product} isDuplicate={isDuplicate} sourceProductId={isDuplicate ? duplicatedId : null} />;
}