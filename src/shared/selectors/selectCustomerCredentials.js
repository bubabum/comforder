export const selectCustomerCredentials = (id, customers) => {
	return customers.find(c => c.id === id) ?? {
		name: "",
		phone: "",
		email: "",
	};
}