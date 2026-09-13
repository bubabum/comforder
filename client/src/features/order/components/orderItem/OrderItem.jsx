import SheetItem from './SheetItem';
import TrimItem from './TrimItem';
import QuantityItem from "./QuantityItem";
import OptionItem from './OptionItem';
import { PRODUCT_TYPES } from '../../../../shared/constants/productTypes';

const ITEM_COMPONENTS = {
	[PRODUCT_TYPES.SHEET]: SheetItem,
	[PRODUCT_TYPES.TRIM]: TrimItem,
	[PRODUCT_TYPES.OPTION]: OptionItem,
	[PRODUCT_TYPES.QUANTITY]: QuantityItem,
};

export default function OrderItem({ item }) {
	const Component = ITEM_COMPONENTS[item.type];

	if (!Component) {
		throw new Error(`Unknown product type: ${item.type}`);
	}

	return <Component item={item} />;
}