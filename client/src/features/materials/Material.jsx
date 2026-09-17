import { useState, useEffect } from "react";
import { useGetColorsQuery } from "../../store/api/colorsApi";
import { useGetCoatingsQuery } from "../../store/api/coatingsApi";
import { useGetTrimPriceCategoriesQuery } from "../../store/api/trimPriceCategoriesApi";
import {
	useGetMaterialByIdQuery,
	useCreateMaterialMutation,
	useUpdateMaterialMutation,
} from "../../store/api/materialsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../../shared/UI/Loader";
import NumberInput from '../../shared/UI/NumberInput';
import Button from "../../shared/UI/Button";
import Select from "../../shared/UI/Select";


export default function Material() {
	const navigate = useNavigate();
	const [createMaterial] = useCreateMaterialMutation();
	const [updateMaterial] = useUpdateMaterialMutation();
	const { id } = useParams();
	const isNew = id === "new";

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
	const {
		data: trimPriceCategories = [],
		isLoading: isLoadingTrimPriceCategories,
		error: errorTrimPriceCategories
	} = useGetTrimPriceCategoriesQuery();
	const {
		data: material,
		isLoading: isLoadingMaterial,
		error: errorMaterial
	} = useGetMaterialByIdQuery(isNew ? skipToken : id);

	const defaultForm = {
		colorId: null,
		coatingId: null,
		extraPrice: 0,
		thickness: 0,
		price: 0,
		trimPriceCategoryId: null,
	}

	const [form, setForm] = useState(defaultForm);

	useEffect(() => {
		if (!isNew) return
		setForm(prev => ({
			...prev,
			colorId: colors[0]?.id ?? null,
			coatingId: coatings[0]?.id ?? null,
			trimPriceCategoryId: trimPriceCategories[0]?.id ?? null,
		}))
	}, [colors, coatings, trimPriceCategories])

	useEffect(() => {
		if (!isNew && material) {
			setForm({
				id: material.id,
				colorId: material.colorId,
				coatingId: material.coatingId,
				extraPrice: Number(material.extraPrice),
				thickness: Number(material.thickness),
				price: Number(material.price),
				trimPriceCategoryId: material.trimPriceCategoryId,
			});
		}
	}, [material, isNew]);

	const isLoading = isLoadingColors || isLoadingCoatings || isLoadingTrimPriceCategories || isLoadingMaterial;
	const error = errorColors || errorCoatings || errorTrimPriceCategories || errorMaterial;

	if (!isNew && isLoading) {
		return <Loader />;
	}

	if (!isNew && error) {
		return (
			<div>
				Не вдалося завантажити клієнта. Спробуйте оновити сторінку.
			</div>
		);
	}

	const handleUpdateMaterial = async () => {
		try {
			await updateMaterial({ id, ...form }).unwrap();
			navigate(-1);
		} catch (err) {
			console.error('Не вдалось оновити матеріал', err);
		}
	}

	const handleCreateMaterial = async () => {
		try {
			await createMaterial(form).unwrap();
			navigate(-1);
		} catch (err) {
			console.error('Не вдалось створити матеріал', err);
		}
	}

	const cancelForm = () => {
		if (isNew) {
			setForm(defaultForm);
		} else {
			setForm(material);
		}
	}

	return (
		<div className="w-full flex flex-col gap-2 p-5 bg-background">
			<div className="flex align-bottom gap-5">
				<Button variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<h2 className="mb-4 text-sm font-medium text-text-primary">
					Основна інформація
				</h2>
			</div>
			<div className="flex flex-col gap-5 p-5 bg-surface border border-border rounded-lg w-fit">
				<div className="flex gap-5 pb-5">
					<div className="flex flex-col gap-2">
						<div className="text-sm text-text-secondary">Колір</div>
						<Select
							type={'color'}
							className="h-10 w-50"
							value={form.colorId || ''}
							onChange={e => setForm(prev => ({ ...prev, colorId: e.target.value }))}
						>
							{colors.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
						</Select>
						<div className="text-sm text-text-secondary">Покриття</div>
						<Select
							type={'coating'}
							className="h-10 w-50"
							value={form.coatingId || ''}
							onChange={e => setForm(prev => ({ ...prev, coatingId: e.target.value }))}
						>
							{coatings.map(coating => <option key={coating.id} value={coating.id}>{coating.name}</option>)}
						</Select>
						<div className="text-sm text-text-secondary">Тип ціни планок</div>
						<Select
							className="h-10 w-50"
							value={form.trimPriceCategoryId || ''}
							onChange={e => setForm(prev => ({ ...prev, trimPriceCategoryId: e.target.value }))}
						>
							{trimPriceCategories.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
						</Select>
					</div>
					<div className="flex flex-col gap-2">
						<div className="text-sm text-text-secondary">Товщина</div>
						<NumberInput className="h-10 w-50" value={form.thickness || ""} step={0.05} onChange={thickness => setForm(prev => ({ ...prev, thickness }))} />
						<div className="text-sm text-text-secondary">Ціна</div>
						<NumberInput className="h-10 w-50" value={form.price || ""} onChange={price => setForm(prev => ({ ...prev, price }))} />
						<div className="text-sm text-text-secondary">Доплата за профіль</div>
						<NumberInput className="h-10 w-50" value={form.extraPrice || ""} onChange={extraPrice => setForm(prev => ({ ...prev, extraPrice }))} />
					</div>
				</div>
				<div className="flex gap-5">
					<Button className="h-10" variant="secondary" onClick={cancelForm}>Скасувати</Button>
					<Button className="h-10" variant="primary" onClick={isNew ? handleCreateMaterial : handleUpdateMaterial}>Зберегти</Button>
				</div>
			</div>
		</div >
	)
}