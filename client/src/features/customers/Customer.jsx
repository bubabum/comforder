import { useState, useEffect } from "react";
import {
	useGetCustomerByIdQuery,
	useCreateCustomerMutation,
	useUpdateCustomerMutation,
} from "../../store/api/customersApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Loader from "../../shared/UI/Loader";
import Input from "../../shared/UI/Input";
import Button from "../../shared/UI/Button";


export default function Customer() {
	const navigate = useNavigate();
	const [createCustomer] = useCreateCustomerMutation();
	const [updateCustomer] = useUpdateCustomerMutation();
	const { id } = useParams();
	const isNew = id === "new";

	const {
		data: customer,
		isLoading,
		error,
	} = useGetCustomerByIdQuery(isNew ? skipToken : id)

	const defaultForm = {
		name: "",
		phone: "",
		email: "",
		address: "",
		notes: "",
	}
	const [form, setForm] = useState(defaultForm);

	useEffect(() => {
		if (!isNew && customer) {
			setForm(customer);
		}
	}, [customer, isNew]);

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

	const handleUpdate = async () => {
		try {
			await updateCustomer({ id, ...form }).unwrap();
			navigate(-1);
		} catch (err) {
			console.error('Не вдалось оновити клієнта', err);
		}
	};

	const handleCreateCustomer = async () => {
		try {
			await createCustomer(form).unwrap();
			navigate(-1);
		} catch (err) {
			console.error('Не вдалось створити клієнта', err);
		}
	};

	const cancelForm = () => {
		if (isNew) {
			setForm(defaultForm);
		} else {
			setForm(customer);
		}
	}

	return (
		<div className="w-full flex flex-col gap-5 p-5 bg-background">
			<div className="flex align-middle gap-5">
				<Button variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<h2 className="mb-4 text-sm font-medium text-text-primary">
					Основна інформація
				</h2>
			</div>
			<div className="flex flex-col p-5 gap-5 bg-surface border border-border rounded-lg w-fit">
				<div className="flex gap-5 pb-5">
					<div className="flex flex-col gap-2">
						<div className="text-sm text-text-secondary">Ім'я</div>
						<Input className="h-10 w-100" value={form.name || ""} onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))} />
						<div className="text-sm text-text-secondary">Телефон</div>
						<Input className="h-10 w-100" value={form.phone || ""} onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))} />
						<div className="text-sm text-text-secondary">Email</div>
						<Input className="h-10 w-100" value={form.email || ""} onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))} />
					</div>
					<div>
						<div className="flex flex-col gap-2">
							<div className="text-sm text-text-secondary">Адреса</div>
							<Input className="h-10 w-100" value={form.address || ""} onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))} />
							<div className="text-sm text-text-secondary">Нотатки</div>
							<textarea
								className="h-30 w-full p-2 text-xs rounded-md appearance-none font-medium outline-none bg-surface text-text-primary placeholder:text-text-muted border border-border hover:border-slate-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-none"
								value={form.notes || ""}
								onChange={e =>
									setForm(prev => ({
										...prev,
										notes: e.target.value,
									}))
								}
							/>
						</div>
					</div>
				</div>
				<div className="flex gap-5">
					<Button
						className="h-10"
						variant="secondary"
						onClick={cancelForm}>Скасувати</Button>
					<Button className="h-10" variant="primary" onClick={isNew ? handleCreateCustomer : handleUpdate}>Зберегти</Button>
				</div>
			</div>
		</div >
	)
}