export const sortByCategory = (items, categories) => {
	const sorted = [...items].sort((a, b) => {
		const orderA = a.width ? 1 : 999;
		const orderB = b.width ? 1 : 999;
		return orderA - orderB;
	})
	return sorted.sort((a, b) => {
		const orderA = categories.find(c => c.id === a.categoryId).id ?? 999;
		const orderB = categories.find(c => c.id === b.categoryId).id ?? 999;
		return orderA - orderB;
	})
}