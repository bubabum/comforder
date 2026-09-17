import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const trimFixedPricesApi = createApi({
	reducerPath: 'trimFixedPricesApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getTrimFixedPrices: builder.query({
			query: () => '/trim-fixed-prices',
		}),
	}),
});

export const { useGetTrimFixedPricesQuery } = trimFixedPricesApi;