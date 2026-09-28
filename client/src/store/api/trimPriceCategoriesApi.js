import { apiSlice } from './apiSlice';

export const trimPriceCategoriesApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getTrimPriceCategories: builder.query({
			query: () => '/trim-price-categories',
		}),
	}),
});

export const {
	useGetTrimPriceCategoriesQuery,
} = trimPriceCategoriesApi;