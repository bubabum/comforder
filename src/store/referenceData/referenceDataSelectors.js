export const selectProducts = (state) => state.referenceData.products;
export const selectProductById = (state, id) => state.referenceData.products.find(p => p.id === id);
export const selectCategories = (state) => state.referenceData.categories;
export const selectMaterials = (state) => state.referenceData.materials;
export const selectMaterialById = (state, id) => state.referenceData.materials.find(m => m.id === id);
export const selectCustomers = (state) => state.referenceData.customers;
export const selectTrimPrices = (state) => state.referenceData.trimPrices;
export const selectColors = (state) => state.referenceData.colors;
export const selectCoatings = (state) => state.referenceData.coatings;

export const selectReferenceStatus = (state) => state.referenceData.status;