import { DISCOUNT_TYPES } from "../../../shared/constants/discountTypes";
import { PRINT_TEMPLATE_TYPES } from "../../../shared/constants/printTemplateTypes";

export const createInitialOrder = () => ({
	items: [],
	customerId: "",
	customerName: "",
	customerPhone: "",
	customerEmail: "",
	date: new Date().toISOString(),
	isPartiallyPaid: false,
	partialPayment: 0,
	hasDiscount: false,
	discount: {
		type: DISCOUNT_TYPES.FIXED,
		amount: 0,
	},
	printTemplate: PRINT_TEMPLATE_TYPES.INVOICE,
});