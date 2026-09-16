import { configureStore } from "@reduxjs/toolkit";
import { customersApi } from './api/customersApi';
import { materialsApi } from "./api/materialsApi";
import { coatingsApi } from "./api/coatingsApi";
import { colorsApi } from "./api/colorsApi";
import { trimPriceTypesApi } from "./api/trimPriceTypesApi";
import { productsApi } from "./api/productsApi";
import { categoriesApi } from "./api/categoriesApi";
import { productOptionsApi } from "./api/productOptionsApi";
import orderReducer from "../features/order/orderSlice";
import referenceDataReducer from "../store/referenceData/referenceDataSlice";
import { LOCAL_STORAGE_KEYS } from "../shared/constants/localStorageKeys";


export const store = configureStore({
	reducer: {
		[customersApi.reducerPath]: customersApi.reducer,
		[materialsApi.reducerPath]: materialsApi.reducer,
		[coatingsApi.reducerPath]: coatingsApi.reducer,
		[colorsApi.reducerPath]: colorsApi.reducer,
		[trimPriceTypesApi.reducerPath]: trimPriceTypesApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
		[categoriesApi.reducerPath]: categoriesApi.reducer,
		[productOptionsApi.reducerPath]: productOptionsApi.reducer,
		order: orderReducer,
		referenceData: referenceDataReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware()
			.concat(customersApi.middleware)
			.concat(materialsApi.middleware)
			.concat(coatingsApi.middleware)
			.concat(colorsApi.middleware)
			.concat(trimPriceTypesApi.middleware)
			.concat(productsApi.middleware)
			.concat(categoriesApi.middleware)
			.concat(productOptionsApi.middleware)
});

let previousReferenceData = store.getState().referenceData;
let previousOrder = store.getState().order;

store.subscribe(() => {
	const state = store.getState();
	if (state.referenceData !== previousReferenceData) {
		const {
			status,
			error,
			...referenceData
		} = state.referenceData;

		if (status === "succeeded") {
			localStorage.setItem(
				LOCAL_STORAGE_KEYS.REFERENCE_DATA,
				JSON.stringify(referenceData)
			);
		}

		previousReferenceData = state.referenceData;
	}
	if (state.order !== previousOrder) {
		sessionStorage.setItem(
			LOCAL_STORAGE_KEYS.ORDER,
			JSON.stringify(state.order)
		);

		previousOrder = state.order;
	}
});