import { getOrderTotal, getFinalDiscount, round } from "../utils/orderCalculations";

export const selectOrderSummary = state => {
	const orderTotal = getOrderTotal(state.items);
	const finalDiscount = getFinalDiscount(
		state.discount,
		orderTotal
	);
	return {
		orderTotal,
		hasDiscount: state.discount.amount > 0,
		finalDiscount,
		orderFinalTotal: round(orderTotal - finalDiscount),
	};
};