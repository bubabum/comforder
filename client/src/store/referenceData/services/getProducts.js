import products from "../../../data/products.json"

export const getProducts = async () => {
	return await [...products]
}