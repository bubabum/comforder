export default function FormHeader({ title, subtitle, Icon }) {
	return (
		<div className="flex items-center gap-3 font-medium text-text-primary">
			<div className="text-primary bg-primary-light p-2 rounded-lg">
				<Icon className="size-5" />
			</div>
			<div>
				{title}
				{subtitle &&
					<div className="text-xs text-text-secondary">{subtitle}</div>
				}
			</div>
		</div>
	)
}

