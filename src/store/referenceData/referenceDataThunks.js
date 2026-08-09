import { createAsyncThunk } from "@reduxjs/toolkit";

import { getProducts } from "./services/getProducts";
import { getCategories } from "./services/getCategories";
import { getMaterials } from "./services/getMaterials";
import { getTrimPrices } from "./services/getTrimPrices";
import { getCustomers } from "./services/getCustomers";
import { getColors } from "./services/getColors";
import { getCoatings } from "./services/getCoatings";

import { LOCAL_STORAGE_KEYS } from "../../shared/constants/localStorageKeys";

export const loadReferenceData = createAsyncThunk(
	"referenceData/loadAll",
	async () => {
		const saved = localStorage.getItem(LOCAL_STORAGE_KEYS.REFERENCE_DATA);

		if (saved) {
			return JSON.parse(saved);
		}

		const [
			products,
			categories,
			materials,
			trimPrices,
			customers,
			colors,
			coatings,
		] = await Promise.all([
			getProducts(),
			getCategories(),
			getMaterials(),
			getTrimPrices(),
			getCustomers(),
			getColors(),
			getCoatings(),
		]);

		return {
			products,
			categories,
			materials,
			trimPrices,
			customers,
			colors,
			coatings,
		};
	}
);