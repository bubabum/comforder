import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
	selectColors,
	selectCoatings
} from '../../../store/referenceData/referenceDataSelectors';

import { useMaterial } from './useMaterial';

export function useMaterialSelectionUI({ materialId, resolveMaterial, applyMaterialChange }) {
	const { materials, material, getMaterial } = useMaterial(materialId);

	const colors = useSelector(selectColors);
	const coatings = useSelector(selectCoatings);

	const colorId = material?.colorId;
	const coatingId = material?.coatingId;
	const thickness = material?.thickness;

	const colorOptions = useMemo(() => {
		const ids = new Set(materials.map(m => m.colorId));
		return colors.filter(c => ids.has(c.id));
	}, [materials, colors]);

	const coatingOptions = useMemo(() => {
		const ids = new Set(
			materials
				.filter(m => m.colorId === colorId)
				.map(m => m.coatingId)
		);

		return coatings.filter(c => ids.has(c.id));
	}, [materials, coatings, colorId]);

	const thicknessOptions = useMemo(() =>
		materials
			.filter(m => m.colorId === colorId && m.coatingId === coatingId)
			.map(m => m.thickness),
		[materials, colorId, coatingId]
	);

	const enrichMaterial = material => {
		return {
			...material,
			color: colors.find(c => c.id === material.colorId).name,
			coating: coatings.find(c => c.id === material.coatingId).name,
		}
	}

	const handleColorChange = newColorId => {
		const newMaterial = resolveMaterial(materials, {
			colorId: newColorId,
			coatingId,
			thickness,
		})
		if (!newMaterial) return
		applyMaterialChange(enrichMaterial(newMaterial));
	};

	const handleCoatingChange = newCoatingId => {
		const newMaterial = resolveMaterial(materials, {
			colorId,
			coatingId: newCoatingId,
			thickness,
		});
		if (!newMaterial) return
		applyMaterialChange(enrichMaterial(newMaterial));
	};

	const handleThicknessChange = newThickness => {
		const newMaterial = resolveMaterial(materials, {
			colorId,
			coatingId,
			thickness: Number(newThickness),
		});
		if (!newMaterial) return
		applyMaterialChange(enrichMaterial(newMaterial));
	};

	return {
		material,

		colorId,
		coatingId,
		thickness,

		colorOptions,
		coatingOptions,
		thicknessOptions,

		getMaterial,

		handleColorChange,
		handleCoatingChange,
		handleThicknessChange,
	};
}