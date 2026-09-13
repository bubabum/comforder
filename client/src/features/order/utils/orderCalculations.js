import { PRODUCT_TYPES } from "../../../shared/constants/productTypes";
import { UNIT_TYPES } from "../../../shared/constants/units";
import { UNIT_OPTIONS } from "../../../shared/constants/units";
import { DISCOUNT_TYPES } from "../../../shared/constants/discountTypes";

export const round = (value, decimals = 2) => {
	const cleaned = Number(value.toPrecision(12));
	const factor = Math.pow(10, decimals);
	return Math.round(cleaned * factor) / factor;
};

export const getUnits = item => {
	return UNIT_OPTIONS.find(u => u.id === item.unitId).name
}

export const getArea = item => {
	return round(item.data.sheets.reduce((acc, cur) => acc + round(cur.length * cur.quantity * item.width, 3), 0), 3)
}

export const getTotalLength = item => {
	return round(item.data.trims.reduce((acc, cur) => acc + cur.length * cur.quantity, 0))
}

export const getTotal = item => {
	return round(item.data.quantity * item.data.price)
}

export const getSheetItemTotal = item => {
	return round(getArea(item) * item.data.price)
}

export const getItemTotal = item => {
	switch (item.type) {
		case PRODUCT_TYPES.SHEET:
			return getSheetItemTotal(item)
		case PRODUCT_TYPES.TRIM:
		case PRODUCT_TYPES.OPTION:
		case PRODUCT_TYPES.QUANTITY:
			return getTotal(item)
		default:
			throw new Error('Unknown product type');
	}
}

export const getOrderTotal = items => {
	return round(items.reduce((acc, cur) => acc + getItemTotal(cur), 0))
}

export const getFinalDiscount = ({ type, amount }, orderTotal) => {
	switch (type) {
		case DISCOUNT_TYPES.FIXED:
			return amount
		case DISCOUNT_TYPES.PERCENTAGE:
			return round(orderTotal * amount / 100)
		case DISCOUNT_TYPES.SHEET_ITEM_PRICE:
			return 0
		default:
			throw new Error('Unknown discount type');
	}
}

export const getDefaultSheetItemPrice = (material, item) => {
	return material.extraPrice * item.priceMultiplier + material.price
}