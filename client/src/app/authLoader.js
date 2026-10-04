import { redirect } from 'react-router-dom';

export async function authLoader() {
	const res = await fetch('/api/me', { credentials: 'include' });
	const data = await res.json();

	if (!data.authenticated) {
		throw redirect('/login');
	}
	return null;
}