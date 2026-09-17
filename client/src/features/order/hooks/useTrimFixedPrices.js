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
		fixedPrices.forEach(p => map.set(`${p.productId}:${p.trimPriceTypeId}`, p.price));
		return map;
	}, [fixedPrices]);

	const getFixedPrice = (productId, trimPriceTypeId) =>
		priceMap.get(`${productId}:${trimPriceTypeId}`) ?? null;

	return { isLoading, error, getFixedPrice };
}