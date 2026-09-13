import Button from "../UI/Button"
import { NavLink } from 'react-router-dom';

export default function TableRow({ item, columns }) {
	return (
		<tr className="border-t border-border-light transition-colors hover:bg-card-hover">
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