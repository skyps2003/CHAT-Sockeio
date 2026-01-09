import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useSendMessage = () => {
	const [loading, setLoading] = useState(false);
	const { messages, setMessages, selectedConversation, replyingTo, setReplyingTo } = useConversation();
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
	const sendMessage = async (message, file) => {
		setLoading(true);
		try {
			const formData = new FormData();
			formData.append("message", message);
			if (file) {
				formData.append("file", file);
			}
			// ✅ SI ESTAMOS RESPONDIENDO, AGREGAMOS EL ID
			if (replyingTo) {
				formData.append("replyToId", replyingTo._id);
			}

			const res = await fetch(`${BACKEND_URL}/api/messages/send/${selectedConversation._id}`, {
				method: "POST",
				body: formData,
			});

			const data = await res.json();
			if (data.error) throw new Error(data.error);

			setMessages([...messages, data]);

			// ✅ LIMPIAR EL ESTADO DE RESPUESTA AL TERMINAR
			setReplyingTo(null);

		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { sendMessage, loading };
};
export default useSendMessage;