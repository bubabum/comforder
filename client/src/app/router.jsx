import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import OrderPage from '../pages/OrderPage'
import CustomerListPage from '../pages/CustomerListPage'
import CustomerPage from '../pages/CustomerPage'
import ProductListPage from '../pages/ProductListPage'
import ProductPage from '../pages/ProductPage'
import MaterialListPage from '../pages/MaterialListPage'
import MaterialPage from '../pages/MaterialPage'

export const router = createBrowserRouter([
	{
		element: <AppLayout />,
		children: [
			{
				path: '/',
				element: <OrderPage />,
			},
			{
				path: '/customers',
				element: <CustomerListPage />,
			},
			{
				path: '/customers/:id',
				element: <CustomerPage />,
			},
			{
				path: '/customers/new',
				element: <CustomerPage />,
			},
			{
				path: '/products',
				element: <ProductListPage />,
			},
			{
				path: '/products/:id',
				element: <ProductPage />,
			},
			{
				path: '/products/new',
				element: <ProductPage />,
			},
			{
				path: '/materials',
				element: <MaterialListPage />,
			},
			{
				path: '/materials/:id',
				element: <MaterialPage />,
			},
			{
				path: '/materials/new',
				element: <MaterialPage />,
			},
		],
	},
])