import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const productsApi = createApi({
	reducerPath: 'productsApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getProducts: builder.query({
			query: () => '/products',
		}),
	}),
});

export const { useGetProductsQuery } = productsApi;