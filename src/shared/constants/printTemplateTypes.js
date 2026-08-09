import Ivoice from "../../features/order/print/Invoice";
import Cashless from "../../features/order/print/Cashless";

export const PRINT_TEMPLATE_TYPES = {
	INVOICE: "invoice",
	OFFER: "offer",
	CASHLESS: "cachless",
};

export const PRINT_TEMPLATE_OPTIONS = [
	{
		id: PRINT_TEMPLATE_TYPES.INVOICE,
		title: "Товарний чек",
		template: Ivoice,
	},
	{
		id: PRINT_TEMPLATE_TYPES.OFFER,
		title: "Комерційна пропозиція",
		template: Ivoice,
	},
	{
		id: PRINT_TEMPLATE_TYPES.CASHLESS,
		title: "Рахунок",
		template: Cashless,
	},
];