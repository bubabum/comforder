import { apiSlice } from './apiSlice';

export const colorsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getColors: builder.query({
			query: () => '/colors',
		}),
	}),
});

export const { useGetColorsQuery } = colorsApi;