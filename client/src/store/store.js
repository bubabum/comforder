import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from '@reduxjs/toolkit/query';
import { apiSlice } from './api/apiSlice';
import orderReducer from "../features/order/orderSlice";
import toastReducer from './toastSlice';
import { LOCAL_STORAGE_KEYS } from "../shared/constants/localStorageKeys";

export const store = configureStore({
	reducer: {
		[apiSlice.reducerPath]: apiSlice.reducer,
		order: orderReducer,
		toast: toastReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(apiSlice.middleware),
});

setupListeners(store.dispatch);

let previousOrder = store.getState().order;

store.subscribe(() => {
	const state = store.getState();
	if (state.order !== previousOrder) {
		sessionStorage.setItem(
			LOCAL_STORAGE_KEYS.ORDER,
			JSON.stringify(state.order)
		);

		previousOrder = state.order;
	}
});