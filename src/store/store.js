import { configureStore } from "@reduxjs/toolkit";
import orderReducer from "../features/order/orderSlice";
import referenceDataReducer from "../store/referenceData/referenceDataSlice";
import { LOCAL_STORAGE_KEYS } from "../shared/constants/localStorageKeys";

export const store = configureStore({
	reducer: {
		order: orderReducer,
		referenceData: referenceDataReducer,
	},
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
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.ORDER,
			JSON.stringify(state.order)
		);

		previousOrder = state.order;
	}
});