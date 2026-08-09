import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { addCustomer, updateCustomer } from "../../store/referenceData/referenceDataSlice"
import { useParams } from "react-router-dom";
import { useCustomer } from "../../shared/hooks/useCustomer";
import { useNavigate } from "react-router-dom";
import Input from "../../shared/UI/Input";
import Button from "../../shared/UI/Button";


export default function Customer() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams();

	const customer = useCustomer(id);

	const [form, setForm] = useState({
		name: "",
		phone: "",
		email: "",
		id: id,
	});

	useEffect(() => {
		if (customer) {
			setForm({ ...customer, id });
		}
	}, [customer, id]);

	const handleUpdate = () => {
		dispatch(updateCustomer({ ...form }))
		navigate(-1);
	}

	const handleCreateCustomer = () => {
		dispatch(addCustomer({ ...form, id: crypto.randomUUID() }))
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
				<div>Ім'я</div>
				<Input className="h-10" value={form.name || ""} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
				<div>Телефон</div>
				<Input className="h-10" value={form.phone || ""} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
				<div>Email</div>
				<Input className="h-10" value={form.email || ""} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
			</div>
			<div className="flex gap-2">
				<Button className="h-10" variant="secondary" onClick={() => setForm(customer)}>Скасувати</Button>
				<Button className="h-10" variant="primary" onClick={id ? handleUpdate : handleCreateCustomer}>Зберегти</Button>
			</div>
		</div >
	)
}