import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const categoriesApi = createApi({
	reducerPath: 'categoriesApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => '/categories',
		}),
	}),
});

export const { useGetCategoriesQuery } = categoriesApi;