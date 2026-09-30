import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUpdateProductMutation, useCreateProductMutation } from "../../store/api/productsApi";
import { useGetProductOptionsByProductIdQuery } from "../../store/api/productOptionsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useDispatch } from "react-redux";
import { addToast } from "../../store/toastSlice";
import ProductBaseFields from "./ProductBaseFields";
import Loader from "../../shared/UI/Loader";
import MessageError from "../../shared/UI/MessageError";
import Input from "../../shared/UI/Input";
import NumberInput from "../../shared/UI/NumberInput"
import Button from "../../shared/UI/Button";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { useGetUnitsQuery } from "../../store/api/unitsApi";
import { PRODUCT_TYPES } from "../../shared/constants/productTypes";
import { Package, SlidersHorizontal } from "lucide-react";

export default function OptionProduct({ product }) {
	const dispatch = useDispatch();
	const id = product?.id ?? "new";
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
		data: fetchedOptions,
		isLoading: isLoadingOptions,
		error: errorOptions,
	} = useGetProductOptionsByProductIdQuery(isNew ? skipToken : id)

	const isLoading = isLoadingCategories || isLoadingUnits || isLoadingOptions;
	const error = errorCategories || errorUnits || errorOptions;

	const [createProduct] = useCreateProductMutation();
	const [updateProduct] = useUpdateProductMutation();

	const navigate = useNavigate();

	const defaultForm = {
		categoryId: null,
		name: "",
		quantityStep: 1,
		type: PRODUCT_TYPES.OPTION,
		unitId: null,
	}

	const [form, setForm] = useState(defaultForm);
	const [options, setOptions] = useState([]);

	useEffect(() => {
		if (!isNew) return
		setForm(prev => ({
			...prev,
			categoryId: categories[0]?.id ?? null,
			unitId: units[0]?.id ?? null,
		}))
	}, [isNew, categories, units])

	useEffect(() => {
		if (!isNew && product) {
			setForm({ ...product });
		}

	}, [isNew, product]);

	useEffect(() => {
		if (!isNew && fetchedOptions) {
			setOptions([...fetchedOptions])
		}
	}, [isNew, fetchedOptions]);

	if (!isNew && isLoading) return <Loader />;
	if (!isNew && error) return <MessageError message={`Не вдалося завантажити товар. ${error.data?.error}`} />;

	const addOption = () => {
		setOptions([...options, { id: crypto.randomUUID(), name: '', price: 0 }]);
	};

	const updateOption = (id, field, value) => {
		setOptions(options.map(o => o.id === id ? { ...o, [field]: value } : o));
	};

	const removeOption = (id) => {
		setOptions(options.filter(o => o.id !== id));
	};

	const handleUpdateProduct = async () => {
		const payload = { ...form, options: options.map(({ id, ...rest }) => rest) };
		try {
			await updateProduct({ id, ...payload }).unwrap();
			dispatch(addToast({ message: "Збережено", type: 'success' }));
			navigate(-1);
		} catch (err) {
			dispatch(addToast({ message: "Не вдалось оновити товар. " + err.data?.error || 'Сталася помилка', type: 'error' }));
		}
	};

	const handleCreateProduct = async () => {
		const payload = { ...form, options: options.map(({ id, ...rest }) => rest) };
		try {
			await createProduct(payload).unwrap();
			dispatch(addToast({ message: "Збережено", type: 'success' }));
			navigate(-1);
		} catch (err) {
			dispatch(addToast({ message: "Не вдалось створити товар. " + err.data?.error || 'Сталася помилка', type: 'error' }));

		}
	}

	const getDefaultForm = () => ({
		...defaultForm,
		categoryId: categories[0]?.id ?? null,
		unitId: units[0]?.id ?? null,
	})

	const cancelForm = () => {
		if (isNew) {
			setForm(getDefaultForm());
			setOptions([]);
		} else {
			setForm({ ...product });
			if (fetchedOptions) setOptions([...fetchedOptions]);
		}
	}

	return (
		<div className="w-full h-full flex flex-col p-5 bg-background overflow-hidden">
			<div className="flex align-bottom gap-5 mb-5 shrink-0">
				<Button className="size-10" variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<div>
					<h2 className="text-md font-medium text-text-primary">Основна інформація</h2>
					<div className="text-xs text-text-secondary">Параметри товару та опції</div>
				</div>
			</div>
			<div className="w-fit flex flex-1-1 min-h-0 gap-5">
				<div className="w-fit h-fit shrink-0 flex flex-col p-5 gap-5 bg-surface border border-border-light rounded-lg">
					<div className="flex items-center gap-1 font-medium text-text-primary"><Package className="size-5" />Товар</div>
					<ProductBaseFields form={form} setForm={setForm} categories={categories} units={units} />
					<div className="flex gap-5 mt-5 justify-end">
						<Button className="h-10 w-30" variant="secondary" onClick={cancelForm}>Скасувати</Button>
						<Button className="h-10 w-30" variant="primary" onClick={isNew ? handleCreateProduct : handleUpdateProduct}>Зберегти</Button>
					</div>
				</div>
				<div className="w-100 flex flex-col p-5 gap-5 bg-surface border border-border-light rounded-lg min-h-0 flex-1">
					<div className="flex flex-col gap-5 min-h-0 flex-1">
						<div className="flex justify-between shrink-0">
							<div className="flex items-center gap-1 font-medium text-text-primary"><SlidersHorizontal className="size-5" />Опції</div>
							<Button className="h-10 w-40 text-primary bg-white border-primary border-dashed hover:text-white" icon="plus" onClick={addOption}>Додати</Button>
						</div>
						<div className="flex flex-col gap-1 min-h-0 flex-1 overflow-y-auto scrollbar-gutter-stable">
							{options.map(o => (
								<div key={o.id} className="flex gap-1 shrink-0">
									<Input
										placeholder="Назва опції"
										className="h-10 w-60"
										value={o.name || ""}
										onChange={e => updateOption(o.id, "name", e.target.value)}
									/>
									<NumberInput
										placeholder="Ціна"
										className="h-10 w-20"
										value={o.price ?? ""}
										onChange={price => updateOption(o.id, "price", price)}
									/>
									<Button className="size-10" variant="delete" icon='trash' onClick={() => removeOption(o.id)}></Button>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}