import TableRow from "./TableRow"
import Button from "../UI/Button"

export default function DataTable({ data, columns }) {
	return (
		<div className="overflow-hidden rounded-md border border-border-light overflow-y-auto">
			<table className="w-full table-fixed">
				<thead>
					<tr className="bg-background">
						{columns.map(c => (
							<th key={c.title} className="px-5 py-3 text-left text-xs font-medium tracking-wide text-slate-500" >{c.title}</th>
						))}
					</tr>
				</thead>
				<tbody>
					{data.map((item, index) => (
						<TableRow key={index} item={item} columns={columns} />
					))}
				</tbody>
			</table>
		</div>
	)
}