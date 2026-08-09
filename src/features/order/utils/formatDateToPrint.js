export const formatDateToPrint = date => {
	return new Date(date).toLocaleDateString("uk-UA", {
		day: "numeric",
		month: "long",
		year: "numeric",
	})
}