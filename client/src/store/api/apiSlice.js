import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithCredentials } from './baseQuery';

export const apiSlice = createApi({
	reducerPath: 'api',
	baseQuery: baseQueryWithCredentials,
	tagTypes: ['Customer', 'Product', 'ProductOption', 'Material', 'Category', 'Unit', 'Color', 'Coating', 'TrimWidthPrice', 'TrimFixedPrice'],
	endpoints: () => ({}),
});