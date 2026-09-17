import { useMemo } from 'react';
import { useGetMaterialsQuery } from '../../../store/api/materialsApi';

export function useMaterial(materialId) {
	const {
		data: materials = [],
		isLoading: isLoadingMaterials,
		error: errorMaterials,
	} = useGetMaterialsQuery();

	const resolvedMaterialId = materialId ?? materials[0]?.id ?? null;

	const material = useMemo(
		() => materials.find(m => m.id === resolvedMaterialId),
		[materials, resolvedMaterialId]
	);

	const getMaterial = (colorId, coatingId, thickness) =>
		materials.find(m =>
			m.colorId === colorId &&
			m.coatingId === coatingId &&
			m.thickness === thickness
		);

	return {
		isLoadingMaterials,
		errorMaterials,
		materials,
		material,
		getMaterial,
	};
}