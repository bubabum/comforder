import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateProduct } from "../../store/referenceData/referenceDataSlice"
import NumberInput from "../../shared/UI/NumberInput"
import Input from "../../shared/UI/Input";
import Button from "../../shared/UI/Button";

export default function OptionProduct({ product }) {
	const id = product.id;
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [form, setForm] = useState({ ...product });

	useEffect(() => {
		setForm({ ...product });
	}, [product]);

	const handleUpdate = () => {
		dispatch(updateProduct({ ...form }))
		navigate(-1);
	}

	const handleCreateProduct = () => {
		navigate(-1);
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
				<div>Назва</div>
				<Input className="h-10" value={form.name || ""} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
				{form.optionGroup.options.map((o, index) => (
					<div key={o.label} className="flex items-center gap-2">
						<div>{o.label}</div>
						<NumberInput
							className="h-10"
							value={o.price || ""}
							onChange={priceInput =>
								setForm(prev => ({
									...prev,
									optionGroup: {
										...prev.optionGroup,
										options: prev.optionGroup.options.map((option, i) =>
											i === index
												? { ...option, price: priceInput }
												: option
										),
									},
								}))
							}
						/>
					</div>
				))}
			</div>
			<div className="flex gap-2">
				<Button className="h-10" variant="secondary" onClick={() => setForm(product)}>Скасувати</Button>
				<Button className="h-10" variant="primary" onClick={handleUpdate}>Зберегти</Button>
			</div>
		</div>
	)
}