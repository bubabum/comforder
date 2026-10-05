import { createBrowserRouter } from 'react-router-dom'

import AppLayout from './AppLayout'
import LoginPage from '../pages/LoginPage'
import OrderPage from '../pages/OrderPage'
import CustomerListPage from '../pages/CustomerListPage'
import CustomerPage from '../pages/CustomerPage'
import ProductListPage from '../pages/ProductListPage'
import ProductPage from '../pages/ProductPage'
import MaterialListPage from '../pages/MaterialListPage'
import MaterialPage from '../pages/MaterialPage'
import SettingsPage from '../pages/SettingsPage'
import { authLoader } from './authLoader'
import Loader from '../shared/UI/Loader'

export const router = createBrowserRouter([
	{
		path: '/login',
		element: <LoginPage />,
	},
	{
		element: <AppLayout />,
		loader: authLoader,
		hydrateFallbackElement: <Loader />,
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
				path: '/products',
				element: <ProductListPage />,
			},
			{
				path: '/products/:id',
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
				path: '/settings',
				element: <SettingsPage />,
			},
		],
	},
])