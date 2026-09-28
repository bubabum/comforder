export default function FormField({ label, htmlFor, className = '', children }) {
	return (
		<div className={`flex flex-col gap-2 ${className}`}>
			{label && <label htmlFor={htmlFor} className="text-sm text-text-secondary">{label}</label>}
			<div className="relative">
				{children}
			</div>
		</div>
	);
}