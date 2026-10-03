import Input from "./Input";
import { X } from "lucide-react";

export default function SearchInput({ value, setValue, onChange, placeholder, className = '', children }) {
	return (
		<div className='relative'>
			<Input
				value={value}
				onChange={onChange}
				placeholder={placeholder}
				className={className}
			/>
			{value !== "" &&
				<button
					className="absolute cursor-pointer text-text-secondary hover:text-text-primary transition-all top-1/2 -translate-y-1/2 right-2"
					onClick={() => setValue('')}
				>
					<X />
				</button>}
		</div >
	);
}