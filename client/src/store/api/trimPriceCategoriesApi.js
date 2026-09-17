import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const trimPriceCategoriesApi = createApi({
	reducerPath: 'trimPriceCategoriesApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getTrimPriceCategories: builder.query({
			query: () => '/trim-price-categories',
		}),
	}),
});

export const { useGetTrimPriceCategoriesQuery } = trimPriceCategoriesApi;