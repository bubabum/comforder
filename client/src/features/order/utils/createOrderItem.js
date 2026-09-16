import { PRODUCT_TYPES } from "../../../shared/constants/productTypes";
import { getDefaultSheetItemPrice } from "./orderCalculations";

export function createOrderItem(product, referenceData) {
	switch (product.type) {
		case PRODUCT_TYPES.SHEET:
			return createSheetItem(product, referenceData);

		case PRODUCT_TYPES.TRIM:
			return createTrimItem(product, referenceData);

		case PRODUCT_TYPES.OPTION:
			return createOptionItem(product, referenceData);

		case PRODUCT_TYPES.QUANTITY:
			return createQuantityItem(product);

		default:
			throw new Error('Unknown product type');
	}
}

function createSheetItem(product, { materials, colors, coatings }) {
	return {
		...product,
		id: crypto.randomUUID(),
		productId: product.id,
		data: {
			price: getDefaultSheetItemPrice(materials[0], product),
			materialId: materials[0].id,
			color: colors.find(c => c.id === materials[0].colorId).name,
			coating: coatings.find(c => c.id === materials[0].coatingId).name,
			thickness: materials[0].thickness,
			sheets: [
				{
					id: crypto.randomUUID(),
					length: 0,
					quantity: 1,
				}
			]
		}
	}
}

function createTrimItem(product, { materials, colors, coatings, trimPrices }) {
	return {
		...product,
		id: crypto.randomUUID(),
		productId: product.id,
		data: {
			quantity: 0,
			width: product?.width || 0,
			price: product.priceType === "fixed" ? product.prices[materials[0].trimPriceType] : 0,
			materialId: materials[0].id,
			color: colors.find(c => c.id === materials[0].colorId).name,
			coating: coatings.find(c => c.id === materials[0].coatingId).name,
			thickness: materials[0].thickness,
			trims: []
		}
	}
}

function createOptionItem(product) {
	return {
		...product,
		id: crypto.randomUUID(),
		productId: product.id,
		data: {
			optionId: null,
			optionName: "",
			price: 0,
			quantity: 1,
		}
	}
}

function createQuantityItem(product) {
	return {
		...product,
		id: crypto.randomUUID(),
		productId: product.id,
		data: {
			price: product.price,
			quantity: 1,
		}
	}
}