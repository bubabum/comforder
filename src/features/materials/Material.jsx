import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectMaterials, selectColors, selectCoatings, selectMaterialById } from "../../store/referenceData/referenceDataSelectors";
import { addMaterial, updateMaterial } from "../../store/referenceData/referenceDataSlice"
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { TRIM_PRICE_TYPES } from "../../shared/constants/trimPriceTypes";
import { TRIM_PRICE_OPTIONS } from "../../shared/constants/trimPriceTypes";
import Input from "../../shared/UI/Input";
import NumberInput from '../../shared/UI/NumberInput';
import Button from "../../shared/UI/Button";
import Select from "../../shared/UI/Select";


export default function Material() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	const material = useSelector(state => selectMaterialById(state, id))
	const colors = useSelector(selectColors);
	const coatings = useSelector(selectCoatings);
	const defaultForm = {
		colorId: colors[0]?.id ?? "",
		coatingId: coatings[0]?.id ?? "",
		extraPrice: 0,
		thickness: 0,
		price: "0",
		trimPriceType: TRIM_PRICE_OPTIONS[0]?.id ?? "",
		id: id,
	}

	const [form, setForm] = useState(defaultForm);

	useEffect(() => {
		if (material) {
			setForm({ ...material, id });
		}
	}, [material, id]);

	const handleUpdate = () => {
		dispatch(updateMaterial({ ...form }))
		navigate(-1);
	}

	const handleCreateMaterial = () => {
		dispatch(addMaterial({ ...form, id: crypto.randomUUID() }))
		navigate(-1);
	}

	const cancelForm = () => {
		if (material) return setForm(material);
		setForm(defaultForm);
	}

	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex align-bottom gap-5">
				<Button variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<h2 className="mb-4 text-sm font-medium text-text-primary">
					Основна інформація
				</h2>
			</div>
			<div className="flex flex-col gap-3">
				<div>Колір</div>
				<Select
					type={'color'}
					className="h-10"
					value={form.colorId || ''}
					onChange={e => setForm(prev => ({ ...prev, colorId: e.target.value }))}
				>
					{colors.map(color => <option key={color.id} value={color.id}>{color.name}</option>)}
				</Select>
				<div>Покриття</div>
				<Select
					type={'coating'}
					className="h-10"
					value={form.coatingId || ''}
					onChange={e => setForm(prev => ({ ...prev, coatingId: e.target.value }))}
				>
					{coatings.map(coating => <option key={coating.id} value={coating.id}>{coating.name}</option>)}
				</Select>
				<div>Товщина</div>
				<NumberInput className="h-10" value={form.thickness || ""} step={0.05} onChange={thickness => setForm(prev => ({ ...prev, thickness }))} />
				<div>Ціна</div>
				<NumberInput className="h-10" value={form.price || ""} onChange={price => setForm(prev => ({ ...prev, price }))} />
				<div>Ціновий</div>
				<NumberInput className="h-10" value={form.extraPrice || ""} onChange={extraPrice => setForm(prev => ({ ...prev, extraPrice }))} />
				<div>Тип ціни планок</div>
				<Select
					className="w-40 h-10"
					value={form.trimPriceType || ''}
					onChange={e => setForm(prev => ({ ...prev, trimPriceType: e.target.value }))}
				>
					{TRIM_PRICE_OPTIONS.map(option => <option key={option.id} value={option.id}>{option.name}</option>)}
				</Select>
			</div>
			<div className="flex gap-2">
				<Button className="h-10" variant="secondary" onClick={cancelForm}>Скасувати</Button>
				<Button className="h-10" variant="primary" onClick={id ? handleUpdate : handleCreateMaterial}>Зберегти</Button>
			</div>
		</div >
	)
}