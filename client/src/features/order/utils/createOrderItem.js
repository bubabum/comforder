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

function createSheetItem(product) {
	return {
		...product,
		id: crypto.randomUUID(),
		productId: product.id,
		data: {
			price: 0,
			materialId: null,
			colorName: null,
			coatingName: null,
			thickness: null,
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

function createTrimItem(product) {
	return {
		...product,
		id: crypto.randomUUID(),
		productId: product.id,
		data: {
			quantity: 0,
			width: product?.width || 0,
			price: 0,
			materialId: null,
			colorName: null,
			coatingName: null,
			thickness: null,
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
			optionName: null,
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