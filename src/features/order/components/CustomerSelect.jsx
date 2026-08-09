import { useEffect } from 'react'
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectCustomers } from '../../../store/referenceData/referenceDataSelectors';
import { setCustomer } from '../orderSlice';
import { selectCustomerCredentials } from '../../../shared/selectors/selectCustomerCredentials';
import Select from 'react-select'

export default function CustomerSelect() {
	const dispatch = useDispatch();
	const order = useSelector(state => state.order);
	const customers = useSelector(selectCustomers)
	const { customerId } = order;

	const options = customers.map(c => {
		return { value: c.id, label: c.name }
	});

	const handleChangeCustomer = (id = null) => {
		const { name, phone, email } = selectCustomerCredentials(id, customers);
		dispatch(setCustomer({ id, name, phone, email }))
	}

	return (
		<Select
			unstyled
			isClearable
			styles={{
				control: base => ({
					...base,
					height: 24,
					minHeight: 24,
				})
			}}
			placeholder={"Вибір контрагента"}
			noOptionsMessage={() => "Збігів не знайдено"}
			classNames={{
				control: ({ isFocused, isDisabled }) =>
					`
										w-60 h-6 min-h-4 text-xs rounded-md bg-surface border outline-none transition-all
										${isDisabled ? 'bg-slate-50 cursor-not-allowed text-slate-400' : ''}
										${isFocused
						? 'border-primary/60 ring-2 ring-primary/5'
						: 'border-border hover:border-slate-300'
					}
			 `,

				valueContainer: () => 'px-2 py-0 flex items-center',
				input: () => 'm-0 p-0 text-text-primary font-medium',
				singleValue: () => 'text-text-primary font-medium',
				placeholder: () => 'text-text-muted',
				noOptionsMessage: () => "text-xs",
				indicatorSeparator: () => 'hidden',
				dropdownIndicator: () => 'text-text-muted hover:text-text-primary',
				clearIndicator: () => 'text-text-muted hover:text-text-primary',
				menu: () => 'mt-1 rounded-md border border-border bg-surface shadow-lg overflow-hidden',
				menuList: () => 'p-0',
				option: ({ isFocused, isSelected }) =>
					`
				px-2 py-1 cursor-pointer transition-colors
				${isSelected
						? 'bg-primary text-white'
						: isFocused
							? 'bg-slate-100'
							: 'bg-transparent'
					}
			 `,
			}}
			options={options}
			value={options.find(o => o.value === customerId)}
			onChange={(option) => handleChangeCustomer(option?.value)}
		/>
	)
}