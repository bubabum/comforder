import { useTrimWidthPrices } from "./useTrimWidthPrices";
import { useTrimFixedPrices } from "./useTrimFixedPrices";

export function useTrimPrice({ item, trimPriceType }) {

	const { productId, width: productWidth } = item;
	const {
		getWidthPrice,
		isLoading: isLoadingWidthPrices,
		error: errorWidthPrices
	} = useTrimWidthPrices();

	const {
		getFixedPrice,
		isLoading: isLoadingFixedPrices,
		error: errorFixedPrices
	} = useTrimFixedPrices();

	const isLoading = isLoadingWidthPrices || isLoadingFixedPrices;
	const error = errorWidthPrices || errorFixedPrices;

	const getPrice = (width, material) => {
		const roundedWidth = Math.ceil(width / 10) * 10;
		if (trimPriceType === 'widthBased' || productWidth != null && productWidth != width) {
			return getWidthPrice(roundedWidth, material?.trimPriceTypeId);
		}
		if (item.trimPriceType === 'fixed') {
			return getFixedPrice(productId, material?.trimPriceTypeId);
		}
		return null
	}

	return { getPrice, isLoading, error };
}