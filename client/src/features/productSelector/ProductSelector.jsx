import { useState } from 'react'
import { useGetProductsQuery } from '../../store/api/productsApi';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import ProductSelectorItem from './ProductSelectorItem';
import Loader from '../../shared/UI/Loader';
import Button from '../../shared/UI/Button';
import Input from '../../shared/UI/Input';


export default function ProductSelector() {
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

	return (
		<div className='h-full w-100 p-2 flex flex-col bg-surface border-r border-border-light'>
			<div>
				<Input
					type="text"
					placeholder="Пошук товару..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					className='w-full h-10 grow rounded-md'
				/>
			</div>
			<div className='flex flex-wrap items-center gap-1 my-2'>
				<Button variant={!category ? "primary" : "secondary"} className='text-[11px]' onClick={() => setCategory(null)}>Всі</Button>
				{categories.map(c => {
					return <Button key={c.id} variant={category === c.id ? "primary" : "secondary"} className='text-[11px]' onClick={() => setCategory(c.id)}>{c.name}</Button>
				})}
			</div>
			{errorCategories && <div className='text-[11px] text-error mb-2'>Не вдалось завантажити категорії</div>}

			{isLoadingProducts ? (
				<Loader />
			) : errorProducts ? (
				<div className='text-[11px] text-error'>Не вдалось завантажити товари</div>
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