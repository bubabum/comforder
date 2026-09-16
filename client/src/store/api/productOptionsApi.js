import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const productOptionsApi = createApi({
	reducerPath: 'productOptionsApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getProductOptionsByProductId: builder.query({
			query: (id) => `/product-options/${id}`,
		}),
	}),
});

export const { useGetProductOptionsByProductIdQuery, useLazyGetProductOptionsByProductIdQuery } = productOptionsApi;