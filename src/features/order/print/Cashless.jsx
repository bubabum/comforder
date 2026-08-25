import { useSelector } from "react-redux";
import { selectCategories } from '../../../store/referenceData/referenceDataSelectors';
import { getOrderTotal } from '../utils/orderCalculations';
import { createCashlessData } from '../utils/createCashlessData';
import ProductTable from './ProductTable';
import CustomerSection from './CustomerSection';

export default function Cashless({ title, order }) {
	const categories = useSelector(selectCategories)
	const {
		date,
		customerName,
		customerPhone,
		customerEmail,
		groupedItems,
		orderTotal,
		hasDiscount,
		finalDiscount,
		orderFinalTotal
	} = createCashlessData(order);

	return (
		<div className='flex flex-col pl-18 pr-8 pt-12 pb-10 text-[12px] font-[Arial]'>
			<h1 className='flex text-base/1 text-right font-bold border-b-2 border-zinc-800 pb-3 mb-3'>{title} від {date} №</h1>
			<CustomerSection name={customerName} phone={customerPhone} email={customerEmail} />
			<div className='mb-5'></div>
			{Object.entries(groupedItems).map(([groupName, groupItems]) => {
				return (
					<div key={groupName}>
						<div className="font-bold mb-2">Номер замовлення:</div>
						<ProductTable items={groupItems.items} />
						<div className='flex flex-col items-end text-right text-xs font-bold mt-1 mr-1'>
							<table>
								<tbody>
									<tr>
										<td className='w-20 pb-5'>Всього:</td>
										<td className='w-20 pb-5'>{groupItems.total.toFixed(2)} </td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				)
			})}
			<div className='flex flex-col items-end text-right text-sm font-bold mr-1'>
				<table>
					<tbody>
						{hasDiscount &&
							<tr>
								<td>Всього:</td>
								<td>{orderTotal.toFixed(2)}</td>
							</tr>}
						{hasDiscount &&
							<tr>
								<td>Знижка:</td>
								<td>{finalDiscount.toFixed(2)}</td>
							</tr>}
						<tr>
							<td className='w-40 pb-5'>Всього по рахунку:</td>
							<td className='w-20 pb-5 text-base'>{orderFinalTotal.toFixed(2)} </td>
						</tr>
					</tbody>
				</table>
			</div>
			{groupedItems.trimItems &&
				<div className='w-full'>
					<div className='text-sm font-bold'>Малюнки планок:</div>
					<div className='pt-2 grid grid-flow-row grid-cols-6 gap-2'>
						{groupedItems.trimItems.items.map((item, index) => {
							return (
								<div key={index} className='flex'>
									<div className='w-full aspect-square px-1 border border-zinc-800 whitespace-pre-line'>{index + 1}</div>
								</div>
							)
						})}
					</div>
				</div>
			}
		</div>
	)
}	