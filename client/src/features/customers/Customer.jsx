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
import MessageError from "../../shared/UI/MessageError";
import FormField from "../../shared/UI/FormField";
import Input from "../../shared/UI/Input";
import Button from "../../shared/UI/Button";
import { User } from "lucide-react";


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
		return <MessageError message="Не вдалося завантажити дані клієнта." />;
	}

	const handleUpdateCustomer = async () => {
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
		<div className="w-full flex flex-col p-5 bg-background">
			<div className="flex align-bottom gap-5 mb-5 shrink-0">
				<Button className="size-10" variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<div>
					<h2 className="text-md font-medium text-text-primary">{isNew ? "Новий клієнт" : "Клієнт"}</h2>
					<div className="text-xs text-text-secondary">Контактна інформація</div>
				</div>
			</div>
			<div className="flex flex-col p-5 gap-5 bg-surface border border-border-light rounded-lg w-fit">
				<div className="flex items-center gap-1 font-medium text-text-primary"><User className="size-5" />Клієнт</div>
				<div className="flex gap-10">
					<div className="flex flex-col gap-5">
						<FormField label="ПІБ/Назва організації" htmlFor="name">
							<Input
								id="name"
								variant="formField"
								className="w-100"
								value={form.name ?? ""}
								onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
							/>
						</FormField>
						<FormField label="Телефон" htmlFor="phone">
							<Input
								id="phone"
								variant="formField"
								className="w-100"
								value={form.phone ?? ""}
								onChange={e => setForm(prev => ({ ...prev, phone: e.target.value }))}
							/>
						</FormField>
						<FormField label="Email" htmlFor="email">
							<Input
								id="email"
								variant="formField"
								className="w-100"
								value={form.email ?? ""}
								onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
							/>
						</FormField>
					</div>
					<div>
						<div className="flex flex-col gap-5">
							<FormField label="Адреса" htmlFor="address">
								<Input
									id="address"
									variant="formField"
									className="w-100"
									value={form.address ?? ""}
									onChange={e => setForm(prev => ({ ...prev, address: e.target.value }))}
								/>
							</FormField>
							<FormField label="Нотатки" htmlFor="notes">
								<textarea
									id="notes"
									variant="formField"
									className="h-32 w-full p-2 text-xs rounded-md appearance-none font-medium outline-none bg-surface text-text-primary placeholder:text-text-muted border border-border hover:border-slate-300 focus:border-primary/60 focus:ring-2 focus:ring-primary/5 focus:outline-none transition-all disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed resize-none"
									value={form.notes ?? ""}
									onChange={e => setForm(prev => ({ ...prev, notes: e.target.value }))}
								/>
							</FormField>
						</div>
					</div>
				</div>
				<div className="flex gap-5 mt-5 justify-end">
					<Button className="h-10 w-30" variant="secondary" onClick={cancelForm}>Скасувати</Button>
					<Button className="h-10 w-30" variant="primary" onClick={isNew ? handleCreateCustomer : handleUpdateCustomer}>Зберегти</Button>
				</div>
			</div>
		</div >
	)
}