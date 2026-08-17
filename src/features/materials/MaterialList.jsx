import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectMaterials, selectColors, selectCoatings } from "../../store/referenceData/referenceDataSelectors";
import { updateMaterialsPrice } from "../../store/referenceData/referenceDataSlice";
import { usePagination } from "../../shared/hooks/usePagination";
import { NavLink } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { TRIM_PRICE_TYPES, TRIM_PRICE_OPTIONS } from "../../shared/constants/trimPriceTypes";
import Button from "../../shared/UI/Button";
import DataTable from "../../shared/dataTable/DataTable";
import NumberInput from "../../shared/UI/NumberInput";
import Pagination from "../../shared/UI/Pagination";

export default function MaterialList() {
	const dispatch = useDispatch();
	const materials = useSelector(selectMaterials);
	const colors = useSelector(selectColors);
	const coatings = useSelector(selectCoatings);
	const table = materials
		.map(m => ({
			...m,
			color: colors.find(c => c.id === m.colorId).name,
			coating: coatings.find(c => c.id === m.coatingId).name,
			trimPriceType: TRIM_PRICE_OPTIONS.find(o => o.id === m.trimPriceType).name,
		}))
		.sort((a, b) => a.color.localeCompare(b.color, 'uk'));

	const [addend, setAddend] = useState(0);

	const {
		page,
		pageData,
		totalPages,
		setPage,
	} = usePagination({
		data: table,
		pageSize: 12,
		syncWithUrl: true,
	});

	// const handleSearch = e => {
	// 	setSearch(e.target.value);
	// 	setPage(1);
	// };

	// const handleDelete = (id) => {
	// 	if (!confirm("Дійсно видалити клієнта?")) return
	// 	dispatch({
	// 		type: 'DELETE_CUSTOMER',
	// 		payload: { id },
	// 	})
	// }

	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-medium">
					Матеріали
				</h1>
			</div>
			<div className="flex gap-2">
				<NumberInput className="h-10" value={addend || ""} min={-50} max={50} step={1} onChange={addend => setAddend(addend)} />
				<Button className="h-10" variant="primary" onClick={() => dispatch(updateMaterialsPrice({ addend }))}>Змінити ціну</Button>
				{/* <Input
					value={search}
					onChange={e => handleSearch(e)}
					placeholder="Пошук клієнта..."
					className="h-10 w-100"
				/> */}
				<NavLink to={`/materials/new`}>
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
						{ key: 'color', title: 'Колір' },
						{ key: 'coating', title: 'Покриття' },
						{ key: 'thickness', title: 'Товщина' },
						{ key: 'price', title: 'Ціна' },
						{ key: 'extraPrice', title: 'Додаткова націнка' },
						{ key: 'trimPriceType', title: 'Тип ціни планок ' },
						{
							key: 'actions',
							title: 'Дії',
							render: customer => (
								<div className="flex gap-2">
									<NavLink to={`/materials/${customer.id}`}>
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