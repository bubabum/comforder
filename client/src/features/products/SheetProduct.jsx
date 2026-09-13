import { useNavigate } from "react-router-dom";
import Button from "../../shared/UI/Button";

export default function SheetProduct({ product }) {
	const navigate = useNavigate();
	return (
		<div className="w-full flex flex-col gap-2 p-5">
			<div className="flex align-bottom gap-5">
				<Button variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<h2 className="mb-4 text-sm font-medium text-text-primary">
					{product.name}
				</h2>
			</div>
			<div className="flex flex-col gap-3">
				{Object.entries(product).map(([key, value]) => {
					return <div key={key}><span className="font-medium text-text-secondary">{key}: </span>{value}</div>
				})}
			</div>
		</div>
	)
}