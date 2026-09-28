import { apiSlice } from './apiSlice';

export const productOptionsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getProductOptionsByProductId: builder.query({
			query: (productId) => `/product-options/${productId}`,
			providesTags: (result, error, productId) => [{ type: 'ProductOption', productId }],
		}),
	}),
});

export const {
	useGetProductOptionsByProductIdQuery,
} = productOptionsApi;