import { useMemo } from 'react';
import { useGetColorsQuery } from '../../../store/api/colorsApi';
import { useGetCoatingsQuery } from '../../../store/api/coatingsApi';
import { useMaterial } from './useMaterial';
import { resolveMaterial } from '../utils/resolveMaterial';

export function useMaterialSelectionUI({ materialId, applyMaterialChange }) {
	const {
		isLoadingMaterials,
		errorMaterials,
		materials,
		material,
		getMaterial
	} = useMaterial(materialId);

	const {
		data: colors = [],
		isLoading: isLoadingColors,
		error: errorColors
	} = useGetColorsQuery();

	const {
		data: coatings = [],
		isLoading: isLoadingCoatings,
		error: errorCoatings
	} = useGetCoatingsQuery();

	const isLoading =
		isLoadingMaterials ||
		isLoadingColors ||
		isLoadingCoatings;

	const error =
		errorMaterials ||
		errorColors ||
		errorCoatings;

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

	const handleColorChange = newColorId => {
		const newMaterial = resolveMaterial(materials, {
			colorId: Number(newColorId),
			coatingId,
			thickness,
		})
		if (!newMaterial) return
		applyMaterialChange(newMaterial);
	};

	const handleCoatingChange = newCoatingId => {
		const newMaterial = resolveMaterial(materials, {
			colorId,
			coatingId: Number(newCoatingId),
			thickness,
		});
		if (!newMaterial) return
		applyMaterialChange(newMaterial);
	};

	const handleThicknessChange = newThickness => {
		const newMaterial = resolveMaterial(materials, {
			colorId,
			coatingId,
			thickness: Number(newThickness),
		});
		if (!newMaterial) return
		applyMaterialChange(newMaterial);
	};

	const handleChange = (patch) => {
		const next = resolveMaterial(materials, { colorId, coatingId, thickness, ...patch });
		if (next) applyMaterialChange(next);
	};

	return {
		isLoading,
		error,
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
		handleChange,
	};
}