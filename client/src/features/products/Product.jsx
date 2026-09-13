import { PRODUCT_TYPES } from "../../shared/constants/productTypes"
import SheetProduct from "./SheetProduct";
import TrimProduct from "./TrimProduct";
import OptionProduct from "./OptionProduct";
import QuantityProduct from "./QuantityProduct";

const ITEM_COMPONENTS = {
	[PRODUCT_TYPES.SHEET]: SheetProduct,
	[PRODUCT_TYPES.TRIM]: TrimProduct,
	[PRODUCT_TYPES.OPTION]: OptionProduct,
	[PRODUCT_TYPES.QUANTITY]: QuantityProduct,
};

export default function Product({ product }) {
	const Component = ITEM_COMPONENTS[product.type];

	if (!Component) {
		throw new Error(`Unknown product type: ${product.type}`);
	}

	return <Component product={product} />;
}