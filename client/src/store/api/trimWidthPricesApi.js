import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const trimWidthPricesApi = createApi({
	reducerPath: 'trimWidthPricesApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getTrimWidthPrices: builder.query({
			query: () => '/trim-width-prices',
		}),
	}),
});

export const { useGetTrimWidthPricesQuery } = trimWidthPricesApi;