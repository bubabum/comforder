import { createInvoiceData } from "../utils/createInvoiceData";
import ProductTable from "./ProductTable";
import CustomerSection from './CustomerSection';

export default function Ivoice({ title, order }) {
	const {
		items,
		date,
		customerName,
		customerPhone,
		customerEmail,
		partialPayment,
		isPartiallyPaid,
		hasDiscount,
		finalDiscount,
		orderFinalTotal
	} = createInvoiceData(order);
	return (
		<div className='flex flex-col px-10 pt-12 pb-10 text-[10px]'>
			<h1 className='flex text-base/1 text-right font-bold border-b-2 border-zinc-800 pb-3 mb-3'>{title} від {date}</h1>
			<CustomerSection name={customerName} phone={customerPhone} email={customerEmail} />
			<ProductTable items={items} />
			<div className='flex flex-col items-end text-right text-sm font-bold mt-5 mr-1'>
				<table>
					<tbody>
						{hasDiscount &&
							<tr>
								<td>Знижка:</td>
								<td>{finalDiscount.toFixed(2)}</td>
							</tr>}
						<tr>
							<td className='w-20 pb-5'>Всього:</td>
							<td className='w-20 pb-5'>{orderFinalTotal.toFixed(2)} </td>
						</tr>
						{isPartiallyPaid &&
							<tr>
								<td>Передплата:</td>
								<td>{partialPayment.toFixed(2)}</td>
							</tr>}
						{isPartiallyPaid &&
							<tr>
								<td>Борг:</td>
								<td>{(orderFinalTotal - partialPayment).toFixed(2)}</td>
							</tr>}
					</tbody>
				</table>
			</div>
		</div>
	)
}