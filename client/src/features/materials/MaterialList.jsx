import { useGetMaterialsQuery } from "../../store/api/materialsApi";
import { usePagination } from "../../shared/hooks/usePagination";
import { NavLink } from "react-router-dom";
import Loader from "../../shared/UI/Loader";
import Button from "../../shared/UI/Button";
import DataTable from "../../shared/dataTable/DataTable";
import Pagination from "../../shared/UI/Pagination";

export default function MaterialList() {
	const {
		data: materials = [],
		isLoading,
		error
	} = useGetMaterialsQuery();

	const table = materials
		.map(m => ({
			...m,
			color: m.colorName,
			coating: m.coatingName,
			thickness: m.thickness,
			price: m.price,
			extraPrice: m.extraPrice,
			trimPriceType: m.trimPriceTypeName,
		}))

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

	if (isLoading) return <Loader />;
	if (error) return <div>Не вдалося завантажити матеріали. Спробуйте оновити сторінку.</div>;

	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex items-center justify-between">
				<h1 className="text-xl font-medium">
					Матеріали
				</h1>
			</div>
			<div className="flex justify-end gap-2">
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
							render: material => (
								<div className="flex gap-2">
									<NavLink to={`/materials/${material.id}`}>
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