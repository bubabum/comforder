import { AlertCircle } from "lucide-react";

const MessageError = ({ message = "" }) => {

	return (
		<div className="m-auto flex items-center gap-2 text-error">
			<AlertCircle className="size-5" />
			<div>{message}</div>
		</div>
	)
};

export default MessageError