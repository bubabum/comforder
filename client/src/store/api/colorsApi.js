import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const colorsApi = createApi({
	reducerPath: 'colorsApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getColors: builder.query({
			query: () => '/colors',
		}),
	}),
});

export const { useGetColorsQuery } = colorsApi;