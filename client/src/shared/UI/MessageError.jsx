import { AlertCircle } from "lucide-react";

const MessageError = ({ message = "" }) => {

	return (
		<div className="m-auto flex gap-2 text-error">
			<AlertCircle className="size-5" />
			<div>{message} Спробуйте оновити сторінку.</div>
		</div>
	)
};

export default MessageError