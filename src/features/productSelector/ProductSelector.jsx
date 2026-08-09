import { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import ProductSelectorItem from './ProductSelectorItem';
import Button from '../../shared/UI/Button';
import Input from '../../shared/UI/Input';


export default function ProductSelector() {
	const { products, categories } = useSelector(state => state.referenceData);
	const [search, setSearch] = useState("");
	const [category, setCategory] = useState(null);

	const filteredProducts = products.filter(product => {
		const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
		const matchesCategory = !category || product.categoryId === category;
		return matchesSearch && matchesCategory;
	});

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
			{/* <button onClick={exportProducts}>
				Експорт
			</button> */}
			<div className='flex flex-wrap gap-1 my-2'>
				<Button variant={!category ? "primary" : "secondary"} onClick={() => setCategory(null)}>Всі</Button>
				{categories.map(c => {
					return <Button key={c.id} variant={category === c.id ? "primary" : "secondary"} onClick={() => setCategory(c.id)}>{c.name}</Button>
				})}
			</div>
			<ul className='divide-y divide-zinc-100 pr-2 overflow-y-auto scrollbar-gutter-stable'>
				{filteredProducts.map((product, index) => {
					return <ProductSelectorItem key={product.id} product={product} index={index + 1} />
				})}
			</ul>
		</div >
	)
}