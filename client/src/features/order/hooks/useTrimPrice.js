import { useTrimWidthPrices } from "./useTrimWidthPrices";
import { useTrimFixedPrices } from "./useTrimFixedPrices";
import { TRIM_PRICE_TYPES } from "../../../shared/constants/trimPriceTypes";

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

	const getPrice = (width, trimPriceCategoryId) => {
		const roundedWidth = Math.ceil(width / 10) * 10;
		if (trimPriceType === TRIM_PRICE_TYPES.WIDTH_BASED || productWidth != null && productWidth != width) {
			return getWidthPrice(roundedWidth, trimPriceCategoryId);
		}
		if (trimPriceType === TRIM_PRICE_TYPES.FIXED) {
			return getFixedPrice(productId, trimPriceCategoryId);
		}
		return null
	}

	return { getPrice, isLoading, error };
}