import { twMerge } from "tailwind-merge";
const Loader = ({ variant = "medium", className = '' }) => {
	const baseStyles = "size-10 animate-spin rounded-full border-2 border-gray-300 border-t-primary";
	const variants = {
		small: "size-5",
		medium: "size-10"
	}
	return (
		<div className="m-auto flex items-center justify-center">
			<div className={twMerge(baseStyles, variants[variant], className)} />
		</div>
	)
};

export default Loader;