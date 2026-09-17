import { useMemo } from 'react';
import { useGetTrimFixedPricesQuery } from '../../../store/api/trimFixedPricesApi';

export function useTrimFixedPrices() {
	const {
		data: fixedPrices = [],
		isLoading,
		error,
	} = useGetTrimFixedPricesQuery();

	const priceMap = useMemo(() => {
		const map = new Map();
		fixedPrices.forEach(p => map.set(`${p.productId}:${p.trimPriceCategoryId}`, p.price));
		return map;
	}, [fixedPrices]);

	const getFixedPrice = (productId, trimPriceCategoryId) =>
		priceMap.get(`${productId}:${trimPriceCategoryId}`) ?? null;

	return { isLoading, error, getFixedPrice };
}