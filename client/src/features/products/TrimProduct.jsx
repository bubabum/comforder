import { useState, useEffect, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProductMutation, useCreateProductMutation } from "../../store/api/productsApi";
import { useGetTrimFixedPricesByProductIdQuery } from "../../store/api/trimFixedPricesApi";
import { useGetTrimPriceCategoriesQuery } from "../../store/api/trimPriceCategoriesApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import { addToast } from "../../store/toastSlice";
import ProductBaseFields from "./ProductBaseFields";
import Loader from "../../shared/UI/Loader";
import MessageError from "../../shared/UI/MessageError";
import Select from "../../shared/UI/Select";
import FormField from "../../shared/UI/FormField";
import NumberInput from "../../shared/UI/NumberInput"
import Button from "../../shared/UI/Button";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { useGetUnitsQuery } from "../../store/api/unitsApi";
import { PRODUCT_TYPES } from "../../shared/constants/productTypes";
import { TRIM_PRICE_TYPES } from "../../shared/constants/trimPriceTypes";
import { TRIM_PRICE_OPTIONS } from "../../shared/constants/trimPriceTypes";
import { Package, SlidersHorizontal } from "lucide-react";

export default function TrimProduct({ product, isDuplicate, sourceProductId }) {
	const dispatch = useDispatch();
	const { id } = useParams();
	const isNew = id === "new";

	const {
		data: categories = [],
		isLoading: isLoadingCategories,
		error: errorCategories,
	} = useGetCategoriesQuery();

	const {
		data: units = [],
		isLoading: isLoadingUnits,
		error: errorUnits,
	} = useGetUnitsQuery();

	const {
		data: fetchedFixedPrices = [],
		isLoading: isLoadingFixedPrices,
		error: errorFixedPrices,
	} = useGetTrimFixedPricesByProductIdQuery(isNew && !isDuplicate ? skipToken : sourceProductId ?? id);

	const {
		data: trimPriceCategories = [],
		isLoading: isLoadingTrimPriceCategories,
		error: errorTrimPriceCategories
	} = useGetTrimPriceCategoriesQuery();

	const isLoading = isLoadingCategories || isLoadingUnits || isLoadingFixedPrices || isLoadingTrimPriceCategories;
	const error = errorCategories || errorUnits || errorFixedPrices || errorTrimPriceCategories;

	const [createProduct] = useCreateProductMutation();
	const [updateProduct] = useUpdateProductMutation();

	const navigate = useNavigate();

	const defaultForm = {
		categoryId: null,
		name: "",
		quantityStep: 1,
		trimPriceType: TRIM_PRICE_TYPES.WIDTH_BASED,
		type: PRODUCT_TYPES.TRIM,
		unitId: null,
		width: null,
	}

	const [form, setForm] = useState(defaultForm);

	const newFixedPrices = useMemo(
		() => trimPriceCategories.map(c => ({ id: crypto.randomUUID(), productId: id, trimPriceCategoryId: c.id, price: 0 })),
		[trimPriceCategories, id]
	);

	const [fixedPrices, setFixedPrices] = useState([]);

	useEffect(() => {
		if (isNew && newFixedPrices.length > 0) {
			setFixedPrices(newFixedPrices);
		}
	}, [isNew, newFixedPrices]);

	useEffect(() => {
		if (!isNew || product) return
		setForm(prev => ({
			...prev,
			categoryId: categories[0]?.id ?? null,
			unitId: units[0]?.id ?? null,
		}))
	}, [isNew, categories, units])

	useEffect(() => {
		if (product) {
			setForm({ ...product });
		}

	}, [product]);

	useEffect(() => {
		if (fetchedFixedPrices) {
			setFixedPrices([...fetchedFixedPrices])
		}
	}, [fetchedFixedPrices]);

	if (!isNew && isLoading) return <Loader />;
	if (!isNew && error) return <MessageError message={`Не вдалося завантажити товар. ${error.data?.error}`} />;

	const updateFixedPrice = (fixedPricId, value) => {
		setFixedPrices(fixedPrices.map(p => p.id === fixedPricId ? { ...p, price: value } : p));
	};

	const handleUpdateProduct = async () => {
		const payload = { ...form, fixedPrices: fixedPrices.map(({ id, productId, ...rest }) => rest) };
		try {
			await updateProduct({ id, ...payload }).unwrap();
			dispatch(addToast({ message: "Збережено", type: 'success' }));
			navigate(-1);
		} catch (err) {
			dispatch(addToast({ message: `Не вдалось оновити товар. ${err.data?.error ?? 'Сталася помилка'}`, type: 'error' }));
		}
	};

	const handleCreateProduct = async () => {
		const payload = { ...form, fixedPrices: fixedPrices.map(({ id, productId, ...rest }) => rest) };
		try {
			await createProduct(payload).unwrap();
			dispatch(addToast({ message: "Збережено", type: 'success' }));
			navigate(-1);
		} catch (err) {
			dispatch(addToast({ message: `Не вдалось створити товар. ${err.data?.error ?? 'Сталася помилка'}`, type: 'error' }));
		}
	}

	const getDefaultForm = () => ({
		...defaultForm,
		categoryId: categories[0]?.id ?? null,
		unitId: units[0]?.id ?? null,
	})

	const cancelForm = () => {
		if (isNew && !isDuplicate) {
			setForm(getDefaultForm());
			setFixedPrices([...newFixedPrices])
		} else {
			setForm({ ...product });
			setFixedPrices([...fetchedFixedPrices])
		}
	}

	return (
		<div className="w-full flex flex-col p-5 bg-background">
			<div className="flex align-bottom gap-5 mb-5">
				<Button className="size-10" variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<div>
					<h2 className="text-md font-medium text-text-primary">Основна інформація</h2>
					<div className="text-xs text-text-secondary">{isNew ? "Створення товару" : "Параметри товару"}</div>
				</div>
			</div>
			<div className="flex gap-5">
				<div className="flex flex-col p-5 gap-5 bg-surface border border-border-light rounded-lg w-fit">
					<div className="flex items-center gap-1 font-medium text-text-primary"><Package className="size-5" />Товар</div>
					<ProductBaseFields form={form} setForm={setForm} categories={categories} units={units} />
					<div className="flex gap-7.5">
						<FormField label="Вид планки" htmlFor="trimPriceType">
							<Select
								id="trimPriceType"
								disabled={!isNew || isDuplicate}
								variant="formField"
								className="h-10 w-35"
								value={form.trimPriceType ?? ''}
								onChange={e => {
									const trimPriceType = e.target.value;
									setForm(prev => ({
										...prev,
										trimPriceType,
										width: trimPriceType === TRIM_PRICE_TYPES.WIDTH_BASED
											? null
											: (isNew && !isDuplicate ? 0 : (product?.width ?? 0)),
									}));
								}}
							>
								{TRIM_PRICE_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
							</Select>
						</FormField>
						<FormField label="Ширина заготовки, мм" htmlFor="width">
							<NumberInput
								id="width"
								variant="formField"
								disabled={form.trimPriceType === TRIM_PRICE_TYPES.WIDTH_BASED}
								className="h-10 w-40" value={form.width ?? ""}
								onChange={width => setForm(prev => ({ ...prev, width }))}
							/>
						</FormField>
					</div>
					<div className="flex gap-5 mt-5 justify-end">
						<Button className="h-10 w-30" variant="secondary" onClick={cancelForm}>Скасувати</Button>
						<Button className="h-10 w-30" variant="primary" onClick={isNew ? handleCreateProduct : handleUpdateProduct}>Зберегти</Button>
					</div>
				</div>
				{form.trimPriceType === TRIM_PRICE_TYPES.FIXED &&
					<div className="w-fit flex flex-col p-5 gap-5 bg-surface border border-border-light rounded-lg">
						<div className="flex flex-col gap-5 min-h-0 flex-1">
							<div>
								<div className="flex justify-between shrink-0">
									<div className="flex items-center gap-1 font-medium text-text-primary"><SlidersHorizontal className="size-5" />Ціни по категоріям</div>
								</div>
								<div className="text-xs text-text-secondary">Збережені ціни в залежності від категорії</div>
							</div>
							<div className="flex flex-col min-h-0 flex-1 overflow-y-auto divide-y divide-border-light">
								{fixedPrices.map(p => (
									<div key={p.id} className="flex shrink-0 py-5">
										<div className="flex flex-col justify-center">
											<div className="w-35 text-sm text-text-primary">{trimPriceCategories.find(c => c.id === p.trimPriceCategoryId)?.name ?? "-"}</div>
											<div className="text-xs text-text-secondary">пог.м</div>
										</div>
										<div className="relative flex items-center gap-2">
											<NumberInput variant="formField" className="w-30 pr-8" value={p.price ?? ""} onChange={price => updateFixedPrice(p.id, price)} />
											<div className="text-sm text-text-secondary absolute right-2">грн</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				}
			</div>
		</div>
	)
}