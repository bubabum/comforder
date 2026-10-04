export default function TableRow({ item, columns }) {
	return (
		<tr className="border-t border-border-light">
			{columns.map(c => (
				<td key={c.key} className="px-5 py-4 text-sm text-text-primary">
					{c.render
						? c.render(item)
						: item[c.key]
					}
				</td>
			))}
		</tr>
	)
}