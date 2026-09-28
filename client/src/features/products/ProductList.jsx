import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProductsQuery } from '../../store/api/productsApi';
import { useDispatch } from "react-redux";
import { setProducts } from "../../store/referenceData/referenceDataSlice";
import { usePagination } from "../../shared/hooks/usePagination";
import { NavLink } from "react-router-dom";
import Loader from "../../shared/UI/Loader";
import MessageError from "../../shared/UI/MessageError";
import Pagination from "../../shared/UI/Pagination";
import Button from "../../shared/UI/Button";
import DataTable from "../../shared/dataTable/DataTable";
import Input from "../../shared/UI/Input";
import { DropdownMenu } from "../../shared/UI/Dropdown";

export default function ProductList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const {
		data: products = [],
		isLoading,
		error,
	} = useGetProductsQuery();

	const fileInputRef = useRef(null);
	const [search, setSearch] = useState('');

	const filteredProducts = products
		.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))

	const {
		page,
		pageData,
		totalPages,
		setPage,
	} = usePagination({
		data: filteredProducts,
		pageSize: 12,
		syncWithUrl: true,
	});

	const handleSearch = value => {
		setSearch(value);
		setPage(1);
	};

	const exportProducts = async () => {
		const handle = await window.showSaveFilePicker({
			suggestedName: "products.json",
			types: [{
				description: 'JSON file',
				accept: { 'application/json': ['.json'] }
			}]
		});
		const writable = await handle.createWritable();
		await writable.write(JSON.stringify(products, null, 2));
		await writable.close();
	}

	const importProducts = async () => {
		const file = fileInputRef.current.files[0];
		if (!file) return;

		const reader = new FileReader();

		reader.onload = (e) => {
			try {
				const json = JSON.parse(e.target.result);
				dispatch(setProducts(json));
				fileInputRef.current.value = '';
			} catch (err) {
				console.error('Invalid JSON file', err);
			}
		};

		reader.readAsText(file);
	}

	if (isLoading) return <Loader />;
	if (error) return <MessageError message="Не вдалося завантажити список товарів." />;

	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-medium">
					Товари
				</h1>
			</div>
			<div className="flex flex-col gap-2">
			</div>
			<div className="flex gap-2">
				<Input
					value={search}
					onChange={e => handleSearch(e.target.value)}
					placeholder="Пошук товару..."
					className="h-10 w-100"
				/>
				<Button className="h-10" variant="secondary" icon="download" onClick={exportProducts}>Експорт</Button>
				<Button className="h-10" variant="secondary" icon="upload" onClick={importProducts}>Імпорт</Button>
				<Input className="h-10 w-80" ref={fileInputRef} type="file"></Input>
				<DropdownMenu
					triggerClassName="h-10"
					trigger={<span>Створити</span>}
					items={[
						{ label: "Звичайни товар", onClick: () => navigate('/products/new?type=quantity') },
						{ label: "Товар з опціями", onClick: () => navigate('/products/new?type=option') },
						{ label: "Листовий товар", onClick: () => navigate('/products/new?type=sheet') },
						{ label: "Планка", onClick: () => navigate('/products/new?type=trim') },
					]}
				/>
			</div>
			<div className="min-h-100 grow flex flex-col justify-between">
				<DataTable
					data={pageData}
					columns={[
						{ key: 'name', title: 'Назва' },
						{ key: 'categoryName', title: 'Категорія' },
						{ key: 'unitName', title: 'Одиниці вимірювання' },
						{ key: 'price', title: 'Ціна' },
						{
							key: 'actions',
							title: 'Дії',
							render: product => (
								<div className="flex gap-2">
									<NavLink to={`/products/${product.id}`}>
										<Button
											variant="edit"
											icon="pen"
										/>
									</NavLink>
									{/* <Button
										variant="delete"
										icon="trash"
										onClick={() => handleDelete(customer.id)}
									/> */}
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