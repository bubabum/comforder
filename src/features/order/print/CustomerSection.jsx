export default function CustomerSection({ name, phone, email }) {
	return (
		<>
			<table>
				<tbody>
					{name &&
						<tr>
							<td className="w-15 align-bottom">покупець:</td>
							<td className="font-medium text-[14px]">{name}</td>
						</tr>
					}
					{phone &&
						<tr>
							<td className="w-15 align-bottom">тел:</td>
							<td className="font-medium text-[12px]">{phone}</td>
						</tr>
					}
					{email &&
						<tr>
							<td className="w-15 align-bottom">email:</td>
							<td className="font-medium text-[12px]">{email}</td>
						</tr>
					}
				</tbody>
			</table>
		</>
	);
}