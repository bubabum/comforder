import { twMerge } from "tailwind-merge";

export default function ToogleCheckbox({ state, onChange, disabled }) {

	return (
		<label className={`relative inline-flex items-center ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
			<input
				type="checkbox"
				className="peer sr-only"
				checked={state}
				onChange={onChange}
				disabled={disabled}
			/>
			<div className={`h-5 w-9 rounded-full ${disabled ? 'bg-zinc-100' : 'bg-zinc-300'} transition-colors duration-200 peer-checked:bg-primary peer-checked:hover:bg-primary-hover)]`}></div>
			<div className="absolute left-0.5 top-1/2 h-4 w-4 rounded-full bg-white -translate-y-1/2 transition-transform duration-200 peer-checked:translate-x-4"></div>
		</label>
	);
}