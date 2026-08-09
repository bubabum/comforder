import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectMaterials } from '../../../store/referenceData/referenceDataSelectors';

export function useMaterial(materialId) {
	const materials = useSelector(selectMaterials);

	const material = useMemo(
		() => materials.find(m => m.id === materialId),
		[materials, materialId]
	);

	const getMaterial = (colorId, coatingId, thickness) =>
		materials.find(m =>
			m.colorId === colorId &&
			m.coatingId === coatingId &&
			m.thickness === thickness
		);

	return {
		materials,
		material,
		getMaterial,
	};
}