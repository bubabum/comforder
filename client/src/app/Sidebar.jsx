import { NavLink, useNavigate } from 'react-router-dom';
import { useLogoutMutation } from '../store/api/authApi';
import { useLocalStorage } from '../shared/hooks/useLocalStorage';
import Button from '../shared/UI/Button';
import { LOCAL_STORAGE_KEYS } from '../shared/constants/localStorageKeys';
import {
	Menu,
	Home,
	FileText,
	Users,
	Package,
	Layers,
	BarChart3,
	Settings,
	LogOut,
} from 'lucide-react';

const menuItems = [
	{
		to: '/',
		label: 'Замовлення',
		icon: Home,
	},
	// {
	// 	to: '/orders',
	// 	label: 'Invoices',
	// 	icon: FileText,
	// },
	{
		to: '/customers',
		label: 'Клієнти',
		icon: Users,
	},
	{
		to: '/products',
		label: 'Товари',
		icon: Package,
	},
	{
		to: '/materials',
		label: 'Матеріали',
		icon: Layers,
	},
	// {
	// 	to: '/analytics',
	// 	label: 'Analytics',
	// 	icon: BarChart3,
	// },
	// {
	// 	to: '/settings',
	// 	label: 'Settings',
	// 	icon: Settings,
	// },
];

export default function Sidebar() {
	const [collapsed, setCollapsed] = useLocalStorage(
		LOCAL_STORAGE_KEYS.SIDEBAR_COLLAPSED,
		false
	);
	const [logout] = useLogoutMutation();
	const navigate = useNavigate();

	const handleLogout = async () => {
		await logout().unwrap();
		navigate('/login');
	};

	return (
		<aside
			className={`
				flex flex-col border-r border-border bg-white
				transition-all duration-300
				${collapsed ? 'w-[72px]' : 'w-60'}
			`}
		>
			{/* Header */}
			<div className="flex h-16 items-center justify-between px-4">
				{!collapsed && (
					<div className='flex gap-3'>
						<img className='w-5' src="/logo.svg" alt="" />
						<div className="font-semibold	text-md">
							comforder
						</div>
					</div>
				)}

				<button
					onClick={() => setCollapsed(!collapsed)}
					className="rounded-lg p-2 hover:bg-zinc-100"
				>
					<Menu size={20} />
				</button>
			</div>

			{/* Navigation */}
			<nav className="flex-1 px-3 py-4">
				<ul className="space-y-1">
					{menuItems.map(item => {
						const Icon = item.icon;

						return (
							<li key={item.to}>
								<NavLink
									to={item.to}
									className={({ isActive }) =>
										`
										flex h-11 items-center gap-3 rounded-xl px-3
										transition-colors
										${isActive
											? 'bg-primary-light text-primary'
											: 'text-text-secondary hover:bg-zinc-100'
										}
									`
									}
								>
									<Icon size={20} />

									{!collapsed && (
										<span className="text-sm font-medium">
											{item.label}
										</span>
									)}
								</NavLink>
							</li>
						);
					})}
				</ul>
			</nav>

			{/* Footer */}
			<div className="border-t border-border p-3">
				<Button
					className='w-full flex h-11 justify-start items-center gap-3 rounded-xl px-3 bg-transparent text-text-secondary hover:bg-zinc-100 transition-colors'
					onClick={handleLogout}
				>
					<LogOut className='size-5' />
					{!collapsed && (
						<div className="text-text-secondary text-sm font-medium">
							Вийти
						</div>
					)}
				</Button>
			</div>
		</aside>
	);
}