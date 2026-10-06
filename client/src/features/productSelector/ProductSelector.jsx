import { useState, useEffect, useMemo } from 'react'
import { useGetProductsQuery } from '../../store/api/productsApi';
import { useGetCategoriesQuery } from '../../store/api/categoriesApi';
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useSettings } from '../../shared/hooks/useSettings';
import { addItem } from '../order/orderSlice';
import { addToast } from "../../store/toastSlice";
import { createOrderItem } from '../order/utils/createOrderItem';
import Loader from '../../shared/UI/Loader';
import Button from '../../shared/UI/Button';
import SearchInput from '../../shared/UI/SearchInput';
import { CircleAlert } from 'lucide-react';
import { PRODUCT_TYPES } from '../../shared/constants/productTypes';

export default function ProductSelector() {

	const { inheritLastTrimMaterial } = useSettings();

	const dispatch = useDispatch();
	const order = useSelector(state => state.order);

	const lastTrimMaterialId = useMemo(
		() => order.items.filter(i => i.type === PRODUCT_TYPES.TRIM).at(-1)?.data.materialId,
		[order.items]
	);

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

	const handleAddItem = (product) => {
		dispatch(addItem(createOrderItem(product, inheritLastTrimMaterial ? lastTrimMaterialId : null)))
	}

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
					{filteredProducts.map(product => (
						<li key={product.id} className="flex gap-2 justify-between items-center py-1 text-sm">
							<div className="text-xs">{product.name}</div>
							<Button variant="add" icon='plus' onClick={() => handleAddItem(product)} ></Button>
						</li>
					))}
				</ul>
			)}
		</div >
	)
}