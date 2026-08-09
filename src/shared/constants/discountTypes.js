import { CircleDollarSign, CirclePercent, TableProperties } from 'lucide-react'

export const DISCOUNT_TYPES = {
	FIXED: "fixed",
	PERCENTAGE: "percentage",
	SHEET_ITEM_PRICE: "sheetItemPrice",
};

export const DISCOUNT_OPTIONS = [
	{
		id: DISCOUNT_TYPES.FIXED,
		name: "За сумою",
		label: "грн",
		icon: CircleDollarSign,
	},
	{
		id: DISCOUNT_TYPES.PERCENTAGE,
		name: "У відсотках",
		label: "%",
		icon: CirclePercent,
	},
	{
		id: DISCOUNT_TYPES.SHEET_ITEM_PRICE,
		name: "На листовий матеріал",
		label: "грн",
		icon: TableProperties,
	},
];