import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const coatingsApi = createApi({
	reducerPath: 'coatingsApi',
	baseQuery: baseQueryWithCredentials,
	endpoints: (builder) => ({
		getCoatings: builder.query({
			query: () => '/coatings',
		}),
	}),
});

export const { useGetCoatingsQuery } = coatingsApi;