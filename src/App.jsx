import { RouterProvider } from 'react-router-dom'
import { router } from './app/router'
import { Provider } from "react-redux";
import { store } from './store/store';
import { AppInit } from './app/AppInit';

function App() {

	return (
		<Provider store={store}>
			<AppInit />
			<RouterProvider router={router} />
		</Provider>
	)
}

export default App
