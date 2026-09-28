import { apiSlice } from './apiSlice';

export const productsApi = apiSlice.injectEndpoints({
	endpoints: (builder) => ({

		getProducts: builder.query({
			query: () => '/products',
			providesTags: (result) =>
				result
					? [...result.map(({ id }) => ({ type: 'Product', id })), { type: 'Product', id: 'LIST' }]
					: [{ type: 'Product', id: 'LIST' }],
		}),

		getProductById: builder.query({
			query: (id) => `/products/${id}`,
			providesTags: (result, error, id) => [{ type: 'Product', id }],
		}),

		createProduct: builder.mutation({
			query: (newProduct) => ({
				url: '/products',
				method: 'POST',
				body: newProduct,
			}),
			invalidatesTags: [{ type: 'Product', id: 'LIST' }],
		}),

		updateProduct: builder.mutation({
			query: ({ id, ...data }) => ({
				url: `/products/${id}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: (result, error, { id }) => [
				{ type: 'Product', id },
				{ type: 'Product', id: 'LIST' },
				{ type: 'TrimFixedPrice', productId: id },
				{ type: 'ProductOption', productId: id },
			],
		}),

		deleteProduct: builder.mutation({
			query: (id) => ({
				url: `/products/${id}`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Product', id: 'LIST' }],
		}),

		hardDeleteProduct: builder.mutation({
			query: (id) => ({
				url: `/products/${id}/hard`,
				method: 'DELETE',
			}),
			invalidatesTags: [{ type: 'Product', id: 'LIST' }],
		}),
	}),
});

export const {
	useGetProductsQuery,
	useGetProductByIdQuery,
	useCreateProductMutation,
	useUpdateProductMutation,
	useDeleteProductMutation,
	useHardDeleteProductMutation,
} = productsApi;