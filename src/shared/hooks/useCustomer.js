import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCustomers } from "../../store/referenceData/referenceDataSelectors";
import { selectCustomerCredentials } from "../selectors/selectCustomerCredentials";

export const useCustomer = customerId => {
	const customers = useSelector(selectCustomers);

	return useMemo(
		() => selectCustomerCredentials(customerId, customers),
		[customerId, customers]
	);
}