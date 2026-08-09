export const resolveMaterial = (materials, { colorId, coatingId, thickness }) => {
	let material = materials.find(m =>
		m.colorId === colorId &&
		m.coatingId === coatingId &&
		m.thickness === thickness
	);
	if (material) return material;

	material = materials.find(m =>
		m.colorId === colorId &&
		m.coatingId === coatingId
	);
	if (material) return material;

	material = materials.find(m =>
		m.colorId === colorId
	);
	return material ?? null;
};