import { useState } from "react";
import {
	useGetCustomersQuery,
	useDeleteCustomerMutation
} from "../../store/api/customersApi";
import { usePagination } from "../../shared/hooks/usePagination";
import { NavLink } from "react-router-dom";
import Loader from "../../shared/UI/Loader";
import Button from "../../shared/UI/Button";
import DataTable from "../../shared/dataTable/DataTable";
import Input from "../../shared/UI/Input";
import Pagination from "../../shared/UI/Pagination";

export default function CustomerList() {
	const {
		data: customers = [],
		isLoading,
		error,
	} = useGetCustomersQuery();
	const [deleteCustomer] = useDeleteCustomerMutation();
	const [search, setSearch] = useState('');

	const filteredCustomers = customers.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

	const {
		page,
		pageData,
		totalPages,
		setPage,
	} = usePagination({
		data: filteredCustomers,
		pageSize: 12,
		syncWithUrl: true,
	});

	if (isLoading) return <Loader />;
	if (error) return <div>Не вдалося завантажити клієнтів. Спробуйте оновити сторінку.</div>;

	const handleSearch = value => {
		setSearch(value);
		setPage(1);
	};

	const handleDelete = async (id) => {
		if (!confirm("Дійсно видалити клієнта?")) return
		try {
			await deleteCustomer(id).unwrap();
		} catch (err) {
			console.error('Не вдалось оновити клієнта', err);
		}
	}

	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-medium">
					Клієнти
				</h1>
			</div>

			<div className="flex justify-between gap-2">
				<Input
					value={search}
					onChange={e => handleSearch(e.target.value)}
					placeholder="Пошук клієнта..."
					className="h-10 w-100"
				/>
				<NavLink to={`/customers/new`}>
					<Button
						className="h-10"
						variant="success"
						icon="plus"
					>Додати</Button>
				</NavLink>
			</div>
			<div className="min-h-100 grow flex flex-col justify-between">
				<DataTable
					data={pageData}
					columns={[
						{ key: 'name', title: 'Назва' },
						{ key: 'phone', title: 'Телефон' },
						{ key: 'email', title: 'Email' },
						{
							key: 'actions',
							title: 'Дії',
							render: customer => (
								<div className="flex gap-2">
									<NavLink to={`/customers/${customer.id}`}>
										<Button
											variant="edit"
											icon="pen"
										/>
									</NavLink>
									<Button
										variant="delete"
										icon="trash"
										onClick={() => handleDelete(customer.id)}
									/>
								</div>
							)
						}
					]}
				/>
				<Pagination
					currentPage={page}
					totalPages={totalPages}
					onPageChange={setPage}
				/>
			</div>
		</div>
	)
}