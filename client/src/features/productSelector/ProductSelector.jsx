import { useState, useEffect } from 'react'
import { useGetProductsQuery } from '../../store/api/productsApi';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import { useDispatch } from "react-redux";
import { addToast } from "../../store/toastSlice";
import ProductSelectorItem from './ProductSelectorItem';
import Loader from '../../shared/UI/Loader';
import Button from '../../shared/UI/Button';
import SearchInput from '../../shared/UI/SearchInput';
import { CircleAlert } from 'lucide-react';


export default function ProductSelector() {
	const dispatch = useDispatch();
	const {
		data: products = [],
		isLoading: isLoadingProducts,
		error: errorProducts,
	} = useGetProductsQuery();
	const {
		data: categories = [],
		error: errorCategories,
	} = useGetCategoriesQuery();

	const [search, setSearch] = useState("");
	const [category, setCategory] = useState(null);

	const filteredProducts = products.filter(product => {
		const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
		const matchesCategory = !category || product.categoryId === category;
		return matchesSearch && matchesCategory;
	});

	useEffect(() => {
		if (errorProducts) {
			dispatch(
				addToast({
					message:
						"Не вдалось завантажити список товарів. " +
						(errorProducts.data?.error || "Сталася помилка"),
					type: "error",
				})
			);
		}
	}, [errorProducts, dispatch]);

	useEffect(() => {
		if (errorCategories) {
			dispatch(
				addToast({
					message:
						"Не вдалось завантажити категорії товарів. " +
						(errorCategories.data?.error || "Сталася помилка"),
					type: "error",
				})
			);
		}
	}, [errorCategories, dispatch]);

	return (
		<div className='h-full w-100 p-2 flex flex-col bg-surface border-r border-border-light'>
			<div>
				<SearchInput
					value={search}
					setValue={setSearch}
					onChange={(e) => setSearch(e.target.value)}
					placeholder="Пошук товару..."
					className="w-full h-10 grow rounded-md"
				/>
			</div>
			<div className='flex flex-wrap items-center gap-1 my-2'>
				<Button variant={!category ? "primary" : "secondary"} className='text-[11px]' onClick={() => setCategory(null)}>Всі</Button>
				{categories.map(c => {
					return <Button key={c.id} variant={category === c.id ? "primary" : "secondary"} className='text-[11px]' onClick={() => setCategory(c.id)}>{c.name}</Button>
				})}
			</div>
			{errorCategories && <div className='text-[11px] text-error mb-2'><CircleAlert className='size-5 inline mr-1' />Не вдалось завантажити категорії товарів.</div>}
			{isLoadingProducts ? (
				<Loader />
			) : errorProducts ? (
				<div className='text-[11px] text-error'><CircleAlert className='size-5 inline mr-1' />Не вдалось завантажити список товарів.</div>
			) : (
				<ul className='divide-y divide-zinc-100 pr-2 overflow-y-auto scrollbar-gutter-stable'>
					{filteredProducts.map((product, index) => {
						return <ProductSelectorItem key={product.id} product={product} index={index + 1} />
					})}
				</ul>
			)}
		</div >
	)
}