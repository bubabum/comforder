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

store.subscribe(() => {
	const currentReferenceData = store.getState().referenceData;
	const {
		status,
		error,
		...referenceData
	} = currentReferenceData;

	if (status !== "succeeded") {
		return;
	}

	if (currentReferenceData !== previousReferenceData) {
		localStorage.setItem(
			LOCAL_STORAGE_KEYS.REFERENCE_DATA,
			JSON.stringify(referenceData)
		);

		previousReferenceData = currentReferenceData;
	}
});