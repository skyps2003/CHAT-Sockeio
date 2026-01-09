import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useEditMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, setEditingMessage } = useConversation();
    const BACKEND_URL = import.meta.env.MODE === "development"
	? "http://localhost:5000"
	: "https://chat-sockeio-1.onrender.com"

    const editMessage = async (messageId, newMessageContent) => {
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/edit/${messageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include", // ✅ AGREGA ESTA LÍNEA (¡Vital!)
                body: JSON.stringify({ message: newMessageContent }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            // Actualizamos el mensaje en local inmediatamente
            setMessages(messages.map((msg) => (msg._id === messageId ? data : msg)));
            setEditingMessage(null); // Cerramos modo edición
            toast.success("Mensaje editado");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { editMessage, loading };
};

export default useEditMessage;