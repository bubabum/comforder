import { useMemo } from 'react';
import { useGetTrimWidthPricesQuery } from '../../../store/api/trimWidthPricesApi';

export function useTrimWidthPrices() {
	const {
		data: widthPrices = [],
		isLoading,
		error,
	} = useGetTrimWidthPricesQuery();

	const priceMap = useMemo(() => {
		const map = new Map();
		widthPrices.forEach(p => map.set(`${p.width}:${p.trimPriceCategoryId}`, p.price));
		return map;
	}, [widthPrices]);

	const getWidthPrice = (width, trimPriceCategoryId) =>
		priceMap.get(`${width}:${trimPriceCategoryId}`) ?? null;

	return { isLoading, error, widthPrices, getWidthPrice };
}