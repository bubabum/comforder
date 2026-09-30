import Input from "../../shared/UI/Input";
import NumberInput from "../../shared/UI/NumberInput";
import Select from "../../shared/UI/Select";
import FormField from "../../shared/UI/FormField";

export default function ProductBaseFields({ form, setForm, categories, units }) {

	return (
		<>
			<FormField label="Назва" htmlFor="name">
				<Input
					id="name"
					placeholder="Назва товару"
					variant="formField"
					className="w-140"
					value={form.name || ""}
					onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
				/>
			</FormField>
			<div className="flex justify-between">
				<FormField label="Категорія товарів" htmlFor="categoryId">
					<Select
						id="categoryId"
						variant="formField"
						className="w-60"
						value={form.categoryId ?? ''}
						onChange={e => setForm(prev => ({ ...prev, categoryId: e.target.value }))}
					>
						{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
					</Select>
				</FormField>
				<FormField label="Од. вимірювання" htmlFor="unitId">
					<Select
						id="unitId"
						variant="formField"
						className="h-10 w-35 text-sm"
						value={form.unitId ?? ''}
						onChange={e => setForm(prev => ({ ...prev, unitId: e.target.value }))}
					>
						{units.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
					</Select>
				</FormField>
				<FormField label="Крок кількості" htmlFor="quantityStep">
					<NumberInput
						id="quantityStep"
						variant="formField"
						className="w-30"
						value={form.quantityStep ?? ""}
						onChange={quantityStep => setForm(prev => ({ ...prev, quantityStep }))}
					/>
				</FormField>
			</div>
		</>
	);
}