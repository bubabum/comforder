export default function ProductTable({ items }) {
	return (
		<table className='w-full border-2 border-zinc-800 border-collapse'>
			<thead className='text-center font-bold border border-zinc-400 bg-zinc-200'>
				<tr>
					<td className='w-6  border border-zinc-800'>№</td>
					<td className='border border-zinc-800'>Товари</td>
					<td className='w-15 border border-zinc-800'>Кіл-сть</td>
					<td className='w-10 border border-zinc-800'>Од.</td>
					<td className='w-20 border border-zinc-800'>Ціна без<br />ПДВ</td>
					<td className='w-20 border border-zinc-800'>Сума без<br />ПДВ</td>
				</tr>
			</thead>
			<tbody className='border border-zinc-400'>
				{items.map((item, index) => {
					return (
						<tr key={item.id}>
							<td className='px-1 text-center border border-zinc-800'>{index + 1}</td>
							<td className='px-1 border border-zinc-800 whitespace-pre-line'>{item.name}</td>
							<td className='px-1 text-right border border-zinc-800'>{item.quantity}</td>
							<td className='px-1 border border-zinc-800'>{item.units}</td>
							<td className='px-1 text-right border border-zinc-800'>{item.price}</td>
							<td className='px-1 text-right border border-zinc-800'>{item.total}</td>
						</tr>
					)
				})}
			</tbody>
		</table>
	);
}