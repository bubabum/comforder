import { apiSlice } from './apiSlice';

export const coatingsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCoatings: builder.query({
			query: () => '/coatings',
		}),
	}),
});

export const {
	useGetCoatingsQuery,
} = coatingsApi;