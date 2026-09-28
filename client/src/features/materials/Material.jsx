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
import MessageError from "../../shared/UI/MessageError";
import FormField from "../../shared/UI/FormField";
import NumberInput from '../../shared/UI/NumberInput';
import Button from "../../shared/UI/Button";
import Select from "../../shared/UI/Select";
import { Layers } from "lucide-react";

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
		return <MessageError message="Не вдалося завантажити матеріал." />;
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

	const ralColors = {
		"1015": "#E6D2B5",
		"3005": "#5E2129",
		"5005": "#154889",
		"5011": "#1E2A44",
		"6005": "#114232",
		"6020": "#37422F",
		"7016": "#383E42",
		"8004": "#8F4E35",
		"8017": "#442F29",
		"8019": "#403A3A",
		"9003": "#F4F4F2",
		"9005": "#0A0A0D",
		"9006": "#A1A1A0",
		"Золотий дуб": "#8B5A2B",
		"Темний дуб": "#4A2F20",
		"Цинк": "#7D7F7D",
	};

	const ralColor = ralColors[colors.find(c => c.id === Number(form.colorId))?.name];

	return (
		<div className="w-full flex flex-col gap-2 p-5 bg-background">
			<div className="flex align-bottom gap-5 mb-5 shrink-0">
				<Button className="size-10" variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<div>
					<h2 className="text-md font-medium text-text-primary">{isNew ? "Новий матеріал" : "Матеріал"}</h2>
					<div className="text-xs text-text-secondary">Параметри</div>
				</div>
			</div>
			<div className="flex flex-col gap-5 p-5 bg-surface border border-border-light rounded-lg w-fit">
				<div className="flex items-center gap-1 font-medium text-text-primary"><Layers className="size-5" />Матеріал</div>
				<div className="flex gap-10">
					<div className="flex flex-col gap-5">
						<div className="flex gap-5 items-end">
							<FormField label="Колір" htmlFor="colorId">
								<Select
									id="colorId"
									variant="formField"
									className="w-40"
									value={form.colorId ?? ''}
									onChange={e => setForm(prev => ({ ...prev, colorId: e.target.value }))}
								>
									{colors.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
								</Select>
							</FormField>
							{console.log()}
							<div className="h-10 w-15 rounded-md" style={{ backgroundColor: ralColor }}></div>
						</div>
						<FormField label="Покриття" htmlFor="coatingId">
							<Select
								id="coatingId"
								variant="formField"
								className="w-50"
								value={form.coatingId ?? ''}
								onChange={e => setForm(prev => ({ ...prev, coatingId: e.target.value }))}
							>
								{coatings.map(coating => <option key={coating.id} value={coating.id}>{coating.name}</option>)}
							</Select>
						</FormField>
						<FormField label="Цінова категорія планок" htmlFor="trimPriceCategoryId">
							<Select
								id="trimPriceCategoryId"
								variant="formField"
								className="w-60"
								value={form.trimPriceCategoryId ?? ''}
								onChange={e => setForm(prev => ({ ...prev, trimPriceCategoryId: e.target.value }))}
							>
								{trimPriceCategories.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
							</Select>
						</FormField>
					</div>
					<div className="flex flex-col gap-5">
						<FormField label="Товщина, мм" htmlFor="thickness">
							<NumberInput
								id="thickness"
								variant="formField"
								className="w-40"
								value={form.thickness ?? ""}
								step={0.05}
								onChange={thickness => setForm(prev => ({ ...prev, thickness }))}
							/>
						</FormField>
						<FormField label="Ціна" htmlFor="price">
							<NumberInput
								id="price"
								variant="formField"
								className="w-40"
								value={form.price ?? ""}
								step={0.05}
								onChange={price => setForm(prev => ({ ...prev, price }))}
							/>
						</FormField>
						<FormField label="Доплата за профіль" htmlFor="extraPrice">
							<NumberInput
								id="extraPrice"
								variant="formField"
								className="w-40"
								value={form.extraPrice ?? ""}
								step={0.05}
								onChange={extraPrice => setForm(prev => ({ ...prev, extraPrice }))}
							/>
						</FormField>
					</div>
				</div>
				<div className="flex gap-5 mt-5 justify-end">
					<Button className="h-10 w-30" variant="secondary" onClick={cancelForm}>Скасувати</Button>
					<Button className="h-10 w-30" variant="primary" onClick={isNew ? handleCreateMaterial : handleUpdateMaterial}>Зберегти</Button>
				</div>
			</div>
		</div >
	)
}