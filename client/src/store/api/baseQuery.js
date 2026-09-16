import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import camelcaseKeys from 'camelcase-keys';
import snakecaseKeys from 'snakecase-keys';

const rawBaseQuery = fetchBaseQuery({
	baseUrl: '/api',
	credentials: 'include',
});

export const baseQueryWithCredentials = async (args, api, extraOptions) => {
	// Конвертуємо тіло запиту camelCase → snake_case перед відправкою на бекенд
	if (typeof args === 'object' && args.body) {
		args = {
			...args,
			body: snakecaseKeys(args.body, { deep: true }),
		};
	}

	const result = await rawBaseQuery(args, api, extraOptions);

	// Конвертуємо відповідь snake_case → camelCase перед тим, як віддати у фронтенд-код
	if (result.data) {
		result.data = camelcaseKeys(result.data, { deep: true });
	}

	return result;
};