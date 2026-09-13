import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
	return (
		<div className="flex h-dvh bg-surface text-text-primary">
			<Sidebar />
			<main className="w-full h-dvh  flex overflow-hidden ">
				<Outlet />
			</main>
		</div>
	);
}