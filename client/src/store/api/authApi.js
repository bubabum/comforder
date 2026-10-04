import { apiSlice } from './apiSlice';

export const authApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (password) => ({ url: '/login', method: 'POST', body: { password } }),
		}),
		logout: builder.mutation({
			query: () => ({ url: '/logout', method: 'POST' }),
		}),
		checkAuth: builder.query({
			query: () => '/me',
		}),
	}),
});

export const { useLoginMutation, useLogoutMutation, useCheckAuthQuery } = authApi;