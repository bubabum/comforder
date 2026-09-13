import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectProducts } from "../../store/referenceData/referenceDataSelectors";
import { setProducts } from "../../store/referenceData/referenceDataSlice";
import { usePagination } from "../../shared/hooks/usePagination";
import { NavLink } from "react-router-dom";
import Pagination from "../../shared/UI/Pagination";
import Button from "../../shared/UI/Button";
import DataTable from "../../shared/dataTable/DataTable";
import Input from "../../shared/UI/Input";

export default function ProductList() {
	const dispatch = useDispatch();
	const products = useSelector(selectProducts);
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
			</div>
			<div className="min-h-100 grow flex flex-col justify-between">
				<DataTable
					data={pageData}
					columns={[
						{ key: 'name', title: 'Назва' },
						// { key: 'coating', title: 'Покриття' },
						// { key: 'thickness', title: 'Товщина' },
						{ key: 'price', title: 'Ціна' },
						// { key: 'extraPrice', title: 'Додаткова націнка' },
						// { key: 'trimPriceType', title: 'Тип ціни планок ' },
						{
							key: 'actions',
							title: 'Дії',
							render: customer => (
								<div className="flex gap-2">
									<NavLink to={`/products/${customer.id}`}>
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