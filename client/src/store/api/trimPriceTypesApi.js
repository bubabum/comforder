import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const trimPriceTypesApi = createApi({
	reducerPath: 'trimPriceTypesApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getTrimPriceTypes: builder.query({
			query: () => '/trim-price-types',
		}),
	}),
});

export const { useGetTrimPriceTypesQuery } = trimPriceTypesApi;