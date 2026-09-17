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
		widthPrices.forEach(p => map.set(`${p.width}:${p.trimPriceTypeId}`, p.price));
		return map;
	}, [widthPrices]);


	const getWidthPrice = (width, trimPriceTypeId) =>
		priceMap.get(`${width}:${trimPriceTypeId}`) ?? null;

	return { isLoading, error, widthPrices, getWidthPrice };
}