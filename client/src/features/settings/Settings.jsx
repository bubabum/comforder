import { useSettings } from "../../shared/hooks/useSettings"
import { useNavigate } from "react-router-dom";
import ToogleCheckbox from "../../shared/UI/ToogleCheckbox";
import NumberInput from "../../shared/UI/NumberInput";
import Button from "../../shared/UI/Button";

export default function Settings() {
	const navigate = useNavigate();

	const {
		inheritLastTrimMaterial,
		setInheritLastTrimMaterial,
		printFormFontSize,
		setPrintFormFontSize,
	} = useSettings();

	return (
		<div className="w-full flex flex-col gap-2 p-5 bg-background">
			<div className="flex align-bottom gap-5 mb-5 shrink-0">
				<Button className="size-10" variant="secondary" icon='arrowLeft' onClick={() => navigate(-1)}></Button>
				<div>
					<h2 className="text-md font-medium text-text-primary">Налаштування</h2>
					<div className="text-xs text-text-secondary">Параметри застосунку</div>
				</div>
			</div>
			<div className="flex flex-col gap-5">
				<div className="flex gap-5">
					<ToogleCheckbox state={inheritLastTrimMaterial} onChange={() => setInheritLastTrimMaterial(!inheritLastTrimMaterial)}></ToogleCheckbox>
					<div className="ml-6 text-sm">Використовувати попередній матеріал при додаванні планки</div>
				</div>
				<div className="flex gap-5">
					<NumberInput
						className='w-15'
						min={1}
						step={1}
						value={printFormFontSize}
						onChange={(val) => setPrintFormFontSize(val)}
					/>
					<div className="text-sm">Розмір шрифту таблиці друкованих форм</div>
				</div>
			</div>
		</div>
	)
}