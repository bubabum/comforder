import { PRODUCT_TYPES } from "../../../shared/constants/productTypes"
import { getUnits, getArea, getItemTotal } from "./orderCalculations"

const getPrintName = item => {
	switch (item.type) {
		case PRODUCT_TYPES.SHEET:
			const sheets = item.data.sheets.map(sheet => `${sheet.length}м-${sheet.quantity}шт`).join(', ')
			return `${item.name} ${item.data.color} ${item.data.coating} (${item.width}м) ${item.data.thickness?.toFixed(2)}мм ${sheets}`
		case PRODUCT_TYPES.TRIM: //чи відображати товщину?
			const trims = item.data.trims.map(trim => `${trim.length}м-${trim.quantity}шт`).join(", ")
			return `${item.name} ${item.data.color} ${item.data.coating} ${item.data.thickness > 0.45 ? item.data.thickness.toFixed(2) + "мм" : ""} заг. ${item.data.width}мм ${trims}`
		case PRODUCT_TYPES.OPTION:
			return `${item.name} ${item.data.option}`
		case PRODUCT_TYPES.QUANTITY:
			return item.name
		default:
			throw new Error('Unknown product type' + item.type);
	}
}

const getPrintQuantity = item => {
	switch (item.type) {
		case PRODUCT_TYPES.SHEET:
			return getArea(item)
		case PRODUCT_TYPES.TRIM:
		case PRODUCT_TYPES.OPTION:
		case PRODUCT_TYPES.QUANTITY:
			return item.data.quantity
		default:
			throw new Error('Unknown product type');
	}
}

export const createPrintOrderItem = item => {
	return {
		id: item.id,
		name: getPrintName(item),
		quantity: getPrintQuantity(item).toFixed(3),
		units: getUnits(item),
		price: item.data.price.toFixed(2),
		total: getItemTotal(item).toFixed(2)
	}
}