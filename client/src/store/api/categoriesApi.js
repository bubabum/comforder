import { apiSlice } from './apiSlice';

export const categoriesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => '/categories',
		}),
	}),
});

export const {
	useGetCategoriesQuery,
} = categoriesApi;