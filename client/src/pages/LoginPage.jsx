import { useState } from "react";
import { useLoginMutation } from "../store/api/authApi";
import { useNavigate } from "react-router-dom";
import Input from "../shared/UI/Input";
import Button from "../shared/UI/Button";
import MessageError from "../shared/UI/MessageError";

export default function LoginPage() {
	const [password, setPassword] = useState('');
	const [login, { isLoading, error }] = useLoginMutation();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			await login(password).unwrap();
			navigate('/', { replace: true });
		} catch (err) {
		}
	};

	return (
		<form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 m-auto mt-60">
			<div className='flex gap-3 items-center mb-5'>
				<img className='w-10' src="/logo.svg" alt="" />
				<div className="font-semibold	text-2xl">
					comforder
				</div>
			</div>
			<Input
				className="h-10"
				type="password"
				value={password}
				onChange={(e) => setPassword(e.target.value)}
				placeholder="Пароль"
			/>
			<Button className="h-10" type="submit" variant="primary" disabled={isLoading}>Увійти</Button>
			{error && <MessageError message={error.data?.error ?? 'Сталася помилка'} />}
		</form>
	);
}