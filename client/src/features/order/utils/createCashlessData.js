import { formatDateToPrint } from "./formatDateToPrint";
import { selectOrderSummary } from "../selectors/selectOrderSummary";
import { createPrintOrderItem } from "./createPrintOrderItem";
import { getOrderTotal } from "./orderCalculations";

const createGroupedItems = items => {
	const sheetItems = items.filter(
		item => item.categoryId === 1
	);
	const trimItems = items.filter(
		item => item.categoryId === 2
	);
	const otherItems = items.filter(
		item =>
			item.categoryId !== 1 &&
			item.categoryId !== 2
	);
	const result = {};
	if (sheetItems.length) {
		result.sheetItems = {
			items: sheetItems.map(createPrintOrderItem),
			total: getOrderTotal(sheetItems),
		};
	}
	if (trimItems.length) {
		result.trimItems = {
			items: trimItems.map(createPrintOrderItem),
			total: getOrderTotal(trimItems),
		};
	}
	if (otherItems.length) {
		result.other = {
			items: otherItems.map(createPrintOrderItem),
			total: getOrderTotal(otherItems),
		};
	}
	return result;
};

export const createCashlessData = order => {
	const {
		isPartiallyPaid,
		partialPayment,
		customerName,
		customerPhone,
		customerEmail,
	} = order;
	return {
		isPartiallyPaid,
		partialPayment,
		customerName,
		customerPhone,
		customerEmail,
		date: formatDateToPrint(order.date),
		groupedItems: createGroupedItems(order.items),
		...selectOrderSummary(order),
	}
};