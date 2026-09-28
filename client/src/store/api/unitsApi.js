import { apiSlice } from './apiSlice';

export const unitsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		getUnits: builder.query({
			query: () => '/units',
		}),
	}),
});

export const {
	useGetUnitsQuery,
} = unitsApi;