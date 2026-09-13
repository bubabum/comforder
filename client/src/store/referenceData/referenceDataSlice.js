import { createSlice } from "@reduxjs/toolkit";
import { loadReferenceData } from "./referenceDataThunks";
import { coatings } from "../../data/coatings";

const initialState = {
	materials: [],
	products: [],
	categories: [],
	trimPrices: {},
	customers: [],
	colors: [],
	coatings: [],

	status: "idle",
	error: null,
};

export const referenceDataSlice = createSlice({
	name: "referenceData",
	initialState,
	reducers: {

		reset: () => initialState,

		setProducts: (state, action) => {
			state.products = action.payload;
		},

		addCustomer: (state, action) => {
			state.customers.push(action.payload);
		},

		updateCustomer: (state, action) => {
			const { id, name, phone, email } = action.payload;
			const customer = state.customers.find(c => c.id === id);
			if (!customer) return;
			customer.name = name;
			customer.phone = phone;
			customer.email = email;
		},

		removeCustomer: (state, action) => {
			state.customers = state.customers.filter(c => c.id !== action.payload);
		},

		addMaterial: (state, action) => {
			state.materials.push(action.payload);
		},

		updateMaterial: (state, action) => {
			const { id, ...materialData } = action.payload;
			const material = state.materials.find(m => m.id === id);
			Object.assign(material, materialData)
		},

		updateMaterialsPrice: (state, action) => {
			state.materials.forEach(m => m.price += Number(action.payload.addend))
		},

		updateProduct: (state, action) => {
			const { id, ...productData } = action.payload;
			const product = state.products.find(p => p.id === id);
			Object.assign(product, productData)
		},

	},
	extraReducers: (builder) => {
		builder
			.addCase(loadReferenceData.pending, (state) => {
				state.status = "loading";
			})
			.addCase(loadReferenceData.fulfilled, (state, action) => {
				state.status = "succeeded";
				state.products = action.payload.products;
				state.categories = action.payload.categories;
				state.materials = action.payload.materials;
				state.trimPrices = action.payload.trimPrices;
				state.customers = action.payload.customers;
				state.colors = action.payload.colors;
				state.coatings = action.payload.coatings;
			})
			.addCase(loadReferenceData.rejected, (state, action) => {
				state.status = "failed";
				state.error = action.error.message;
			});
	},
});

export const {
	reset,
	setProducts,
	addCustomer,
	updateCustomer,
	removeCustomer,
	addMaterial,
	updateMaterial,
	updateMaterialsPrice,
	updateProduct,
} = referenceDataSlice.actions;

export default referenceDataSlice.reducer;