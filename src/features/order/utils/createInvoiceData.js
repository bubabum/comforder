import { formatDateToPrint } from "./formatDateToPrint";
import { selectOrderSummary } from "../selectors/selectOrderSummary";
import { createPrintOrderItem } from "./createPrintOrderItem";

export const createInvoiceData = order => {
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
		items: order.items.map(createPrintOrderItem),
		...selectOrderSummary(order),
	};
};