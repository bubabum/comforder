import { apiSlice } from './apiSlice';

export const trimWidthPricesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTrimWidthPrices: builder.query({
			query: () => '/trim-width-prices',
		}),
	}),
});

export const {
	useGetTrimWidthPricesQuery,
} = trimWidthPricesApi;