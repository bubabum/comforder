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
	const { data: product, isLoading, error } = useGetProductByIdQuery(isNew ? skipToken : id);

	if (!isNew && isLoading) return <Loader />;
	if (!isNew && error) return <MessageError message={`Не вдалося завантажити товар. ${error.data?.error}`} />;

	const Component = ITEM_COMPONENTS[product?.type || searchParams.get('type')];

	if (!Component) {
		return <MessageError message={`Некоректний тип товару: ${product?.type || searchParams.get('type')}`} />;
	}

	return <Component product={product} />;
}