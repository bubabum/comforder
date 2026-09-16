import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const materialsApi = createApi({
	reducerPath: 'materialsApi',
	baseQuery: baseQueryWithCredentials,
	tagTypes: ['Material'],
	endpoints: (builder) => ({

		getMaterials: builder.query({
			query: () => '/materials',
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: 'Material', id })), { type: 'Material', id: 'LIST' }]
					: [{ type: 'Material', id: 'LIST' }],
		}),

		getMaterialById: builder.query({
			query: (id) => `/materials/${id}`,
			providesTags: (result, error, id) => [{ type: 'Material', id }],
		}),

		createMaterial: builder.mutation({
			query: (newMaterial) => ({
				url: '/materials',
				method: 'POST',
				body: newMaterial, // { color_id, coating_id, thickness, price, extra_price, trim_price_type_id }
			}),
			invalidatesTags: [{ type: 'Material', id: 'LIST' }],
		}),

		updateMaterial: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/materials/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Material', id }],
		}),

		deleteMaterial: builder.mutation({
			query: (id) => ({
				url: `/materials/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Material', id: 'LIST' }],
		}),

	}),
});

export const {
	useGetMaterialsQuery,
	useGetMaterialByIdQuery,
	useCreateMaterialMutation,
	useUpdateMaterialMutation,
	useDeleteMaterialMutation,
} = materialsApi;