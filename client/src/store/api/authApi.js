import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (password) => ({ url: '/login', method: 'POST', body: { password } }),
			invalidatesTags: ['Auth'],
		}),
		logout: builder.mutation({
			query: () => ({ url: '/logout', method: 'POST' }),
			invalidatesTags: ['Auth'],
		}),
		checkAuth: builder.query({
			query: () => '/me',
			providesTags: ['Auth'],
		}),
	}),
});

export const { useLoginMutation, useLogoutMutation, useCheckAuthQuery } = authApi;