import { apiSlice } from './apiSlice';

export const trimFixedPricesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({

		getTrimFixedPrices: builder.query({
			query: () => '/trim-fixed-prices',
		}),

		getTrimFixedPricesByProductId: builder.query({
			query: (productId) => `/trim-fixed-prices/${productId}`,
			providesTags: (result, error, productId) => [{ type: 'TrimFixedPrice', productId }],
		}),

	}),
});

export const {
	useGetTrimFixedPricesQuery,
	useGetTrimFixedPricesByProductIdQuery,
} = trimFixedPricesApi;