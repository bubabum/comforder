import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateProductMutation, useCreateProductMutation } from "../../store/api/productsApi";
import { useDispatch } from "react-redux";
import { addToast } from "../../store/toastSlice";
import ProductBaseFields from "./ProductBaseFields";
import Loader from "../../shared/UI/Loader";
import MessageError from "../../shared/UI/MessageError";
import FormHeader from "../../shared/UI/FormHeader";
import FormField from "../../shared/UI/FormField";
import NumberInput from "../../shared/UI/NumberInput"
import Button from "../../shared/UI/Button";
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { useGetUnitsQuery } from "../../store/api/unitsApi";
import { PRODUCT_TYPES } from "../../shared/constants/productTypes";
import { Package } from "lucide-react";

export default function QuantityProduct({ product, isDuplicate }) {
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

	const isLoading = isLoadingCategories || isLoadingUnits;
	const error = errorCategories || errorUnits;

	const [createProduct] = useCreateProductMutation();
	const [updateProduct] = useUpdateProductMutation();

	const navigate = useNavigate();

	const defaultForm = {
		categoryId: null,
		name: "",
		price: 0,
		quantityStep: 1,
		type: PRODUCT_TYPES.QUANTITY,
		unitId: null,
	}

	const [form, setForm] = useState(defaultForm);

	useEffect(() => {
		if (!isNew || product) return
		setForm(prev => ({
			...prev,
			categoryId: categories[0]?.id ?? null,
			unitId: units[0]?.id ?? null,
		}))
	}, [isNew, product, categories, units])

	useEffect(() => {
		if (product) {
			setForm({ ...product });
		}
	}, [product]);

	if (!isNew && isLoading) return <Loader />;
	if (!isNew && error) return <MessageError message={`Не вдалося завантажити товар. ${error.data?.error}`} />;

	const handleUpdateProduct = async () => {
		try {
			await updateProduct({ id, ...form }).unwrap();
			dispatch(addToast({ message: "Збережено", type: 'success' }));
			navigate(-1);
		} catch (err) {
			dispatch(addToast({ message: `Не вдалось оновити товар. ${err.data?.error ?? 'Сталася помилка'}`, type: 'error' }));
		}
	};

	const handleCreateProduct = async () => {
		try {
			await createProduct(form).unwrap();
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
		} else {
			setForm({ ...product });
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
			<div className="flex flex-col p-5 gap-5 bg-surface border border-border-light rounded-lg w-fit">
				<FormHeader title='Основні дані' subtitle="Звичайний товар" Icon={Package} />
				<ProductBaseFields form={form} setForm={setForm} categories={categories} units={units} />
				<FormField label="Ціна" htmlFor="price">
					<NumberInput
						id="price"
						variant="formField"
						className="w-50"
						value={form.price ?? ""}
						onChange={price => setForm(prev => ({ ...prev, price }))}
					/>
				</FormField>
				<div className="flex gap-5 mt-5 justify-end">
					<Button className="h-10 w-30" variant="secondary" onClick={cancelForm}>Скасувати</Button>
					<Button className="h-10 w-30" variant="primary" onClick={isNew ? handleCreateProduct : handleUpdateProduct}>Зберегти</Button>
				</div>
			</div>
		</div>
	)
}