import { apiSlice } from './apiSlice';

export const trimFixedPricesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({

		getTrimFixedPrices: builder.query({
			query: () => '/trim-fixed-prices',
			providesTags: (result) =>
				result
					? [
						...result.map((r) => ({ type: 'TrimFixedPrice', productId: r.productId })),
						{ type: 'TrimFixedPrice', id: 'LIST' },
					]
					: [{ type: 'TrimFixedPrice', id: 'LIST' }],
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