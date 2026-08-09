import { createSlice } from "@reduxjs/toolkit";
import { createInitialOrder } from "./utils/createInitialOrder";
import { getTotalLength } from "./utils/orderCalculations";
import { PRODUCT_TYPES } from "../../shared/constants/productTypes";
import { DISCOUNT_TYPES } from "../../shared/constants/discountTypes";

const initialState = createInitialOrder();
export const orderSlice = createSlice({
	name: "order",
	initialState,
	reducers: {
		setOrder(state, action) {
			return action.payload;
		},

		reset: () => createInitialOrder(),

		resetSummary: (state) => {
			state.isPartiallyPaid = false;
			state.partialPayment = 0;
			state.hasDiscount = false;
			state.discount = {
				type: DISCOUNT_TYPES.FIXED,
				amount: 0,
			};
		},

		setDate(state, action) {
			state.date = action.payload;
		},

		setCustomer(state, action) {
			const { id, name, phone, email } = action.payload;
			state.customerId = id;
			state.customerName = name;
			state.customerPhone = phone;
			state.customerEmail = email;
		},

		setCustomerPhone(state, action) {
			state.customerPhone = action.payload;
		},

		setCustomerEmail(state, action) {
			state.customerEmail = action.payload;
		},

		setPrintTemplate(state, action) {
			state.printTemplate = action.payload;
		},

		togglePartialPayment(state, action) {
			state.isPartiallyPaid = action.payload;
			state.partialPayment = 0;
		},

		setPartialPayment(state, action) {
			state.partialPayment = action.payload;
		},

		setDiscountType(state, action) {
			state.discount.type = action.payload;
		},

		setDiscountAmount(state, action) {
			state.discount.amount = action.payload;
		},

		setDiscountToSheetItems(state, action) {
			state.items.forEach(item => {
				if (item.type !== PRODUCT_TYPES.SHEET) return;
				item.data.price -= action.payload;
			});
		},

		resetDiscount(state) {
			state.discount = createInitialOrder().discount;
		},

		setItems(state, action) {
			state.items = action.payload;
		},

		addItem(state, action) {
			state.items.push(action.payload);
		},

		removeItem(state, action) {
			state.items = state.items.filter(i => i.id !== action.payload);
		},

		updateItem(state, action) {
			const { id, ...itemtData } = action.payload;
			const item = state.items.find(i => i.id === id);
			Object.assign(item.data, itemtData)
		},

		addSheet(state, action) {
			const item = state.items.find(i => i.id === action.payload.id);
			if (item) item.data.sheets.push(action.payload.sheet)
		},

		removeSheet(state, action) {
			const item = state.items.find(i => i.id === action.payload.id);
			if (item) item.data.sheets = item.data.sheets.filter(s => s.id !== action.payload.sheetId);
		},

		updateSheet(state, action) {
			const { id, sheetId, ...sheetData } = action.payload;
			const item = state.items.find(i => i.id === id);
			const sheet = item.data.sheets.find(s => s.id === sheetId);
			Object.assign(sheet, sheetData)
		},

		addTrim(state, action) {
			const item = state.items.find(i => i.id === action.payload.id);
			if (item) item.data.trims.push(action.payload.trim)
		},

		removeTrim(state, action) {
			const item = state.items.find(i => i.id === action.payload.id);
			if (item) item.data.trims = item.data.trims.filter(t => t.id !== action.payload.trimId);
			if (item.data.trims.length === 0) item.data.quantity = 0;
		},

		updateTrim(state, action) {
			const { id, trimId, ...trimData } = action.payload;
			const item = state.items.find(i => i.id === id);
			const trim = item.data.trims.find(t => t.id === trimId);
			Object.assign(trim, trimData);
			item.data.quantity = getTotalLength(item);
		},

		sortSheets(state, action) {
			const item = state.items.find(i => i.id === action.payload.id);
			if (item) item.data.sheets.sort((a, b) => b.length - a.length)
		},

		sortTrims(state, action) {
			const item = state.items.find(i => i.id === action.payload.id);
			if (item) item.data.trims.sort((a, b) => b.length - a.length)
		}
	},
});

export const {
	setOrder,
	reset,
	resetSummary,
	setDate,
	setCustomer,
	setCustomerPhone,
	setCustomerEmail,
	setPrintTemplate,
	togglePartialPayment,
	setPartialPayment,
	setDiscountType,
	setDiscountAmount,
	setDiscountToSheetItems,
	resetDiscount,
	setItems,
	addItem,
	removeItem,
	updateItem,
	addSheet,
	removeSheet,
	updateSheet,
	addTrim,
	removeTrim,
	updateTrim,
	sortSheets,
	sortTrims,
} = orderSlice.actions;

export default orderSlice.reducer;