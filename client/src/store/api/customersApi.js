import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const customersApi = createApi({
	reducerPath: 'customersApi',
	baseQuery: baseQueryWithCredentials,
	tagTypes: ['Customer'],
	endpoints: (builder) => ({

		getCustomers: builder.query({
			query: () => '/customers',
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: 'Customer', id })), { type: 'Customer', id: 'LIST' }]
					: [{ type: 'Customer', id: 'LIST' }],
		}),

		getCustomerById: builder.query({
			query: (id) => `/customers/${id}`,
			providesTags: (result, error, id) => [{ type: 'Customer', id }],
		}),

		createCustomer: builder.mutation({
			query: (newCustomer) => ({
				url: '/customers',
				method: 'POST',
				body: newCustomer, // { name, phone, email, address, notes }
			}),
			invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
		}),

		updateCustomer: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/customers/${id}`,
				method: 'PUT',
				body: data, // { name, phone, email, address, notes } — без id в тілі
			}),
			invalidatesTags: (result, error, { id }) => [{ type: 'Customer', id }],
		}),

		deleteCustomer: builder.mutation({
			query: (id) => ({
				url: `/customers/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Customer', id: 'LIST' }],
		}),

	}),
});

export const {
	useGetCustomersQuery,
	useGetCustomerByIdQuery,
	useCreateCustomerMutation,
	useUpdateCustomerMutation,
	useDeleteCustomerMutation,
} = customersApi;