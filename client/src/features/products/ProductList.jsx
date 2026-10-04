import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useGetProductsQuery, useDeleteProductMutation } from '../../store/api/productsApi';
import { useGetCategoriesQuery } from "../../store/api/categoriesApi";
import { usePagination } from "../../shared/hooks/usePagination";
import { useDispatch } from "react-redux";
import { addToast } from "../../store/toastSlice";
import Loader from "../../shared/UI/Loader";
import MessageError from "../../shared/UI/MessageError";
import Pagination from "../../shared/UI/Pagination";
import DataTable from "../../shared/dataTable/DataTable";
import SearchInput from "../../shared/UI/SearchInput";
import { Dropdown } from "../../shared/UI/Dropdown";
import { DropdownMenu } from "../../shared/UI/Dropdown";
import { EllipsisVertical } from "lucide-react";

export default function ProductList() {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [deleteProduct] = useDeleteProductMutation();
	const [searchParams] = useSearchParams();
	const categoryId = searchParams.get('categoryId');
	const category = categoryId ? Number(categoryId) : null;

	const {
		data: products = [],
		isLoading: isLoadingProducts,
		error: errorProducts,
	} = useGetProductsQuery();
	const {
		data: categories = [],
		error: errorCategories,
	} = useGetCategoriesQuery();

	const [search, setSearch] = useState('');


	// const [category, setCategory] = useState(null);

	const filteredProducts = products.filter(product => {
		const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
		const matchesCategory = !category || product.categoryId === category;
		return matchesSearch && matchesCategory;
	});

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

	if (isLoadingProducts) return <Loader />;
	if (errorProducts) return <MessageError message="Не вдалося завантажити список товарів." />;



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

	const handleDelete = async (id) => {
		if (!confirm("Дійсно видалити товар?")) return
		try {
			await deleteProduct(id).unwrap();
			dispatch(addToast({ message: "Видалено", type: 'success' }));
		} catch (err) {
			dispatch(addToast({ message: `Не вдалось видалити товар. ${err.data?.error ?? 'Сталася помилка'}`, type: 'error' }));
		}
	}

	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-medium">
					Товари
				</h1>
			</div>
			<div className="flex gap-2">
				<SearchInput
					value={search}
					setValue={setSearch}
					onChange={e => handleSearch(e.target.value)}
					placeholder="Пошук товару..."
					className="h-10 w-100"
				/>
				<Dropdown
					options={[{ label: "Всі", value: null }, ...categories.map(c => ({ label: c.name, value: c.id }))]}
					value={category}
					onChange={(val) => val ? navigate(`/products?categoryId=${val}`) : navigate(`/products`)}
					// onChange={(val) => setCategory(val)}
					placeholder="Оберіть категорію..."
					triggerClassName="h-10"
				/>
				<DropdownMenu
					triggerClassName="h-10 px-5"
					trigger={<span>Додати товар</span>}
					items={[
						{ label: "Звичайни товар", onClick: () => navigate('/products/new?type=quantity') },
						{ label: "Товар з опціями", onClick: () => navigate('/products/new?type=option') },
						{ label: "Листовий товар", onClick: () => navigate('/products/new?type=sheet') },
						{ label: "Планка", onClick: () => navigate('/products/new?type=trim') },
					]}
				/>
				<DropdownMenu
					triggerClassName="h-10 px-5"
					trigger={<span>Дії</span>}
					items={[
						{ label: "Експорт", onClick: () => exportProducts() },
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
								<div className="flex">
									<DropdownMenu
										hideArrow
										unstyledTrigger
										triggerClassName="size-6 rounded-lg cursor-pointer text-text-secondary hover:bg-hover transition-all "
										trigger={<EllipsisVertical className="" />}
										items={[
											{ label: "Редагувати", onClick: () => navigate(`/products/${product.id}`) },
											{ label: "Копіювати", onClick: () => navigate(`/products/new?duplicatedId=${product.id}`) },
											{ type: "divider" },
											{ label: "Видалити", onClick: () => handleDelete(product.id), danger: true },
										]}
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