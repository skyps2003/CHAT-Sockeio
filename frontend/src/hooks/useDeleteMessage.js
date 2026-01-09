import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useDeleteMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages } = useConversation();
    const BACKEND_URL = import.meta.env.MODE === "development"
	? "http://localhost:5000"
	: "https://chat-sockeio-1.onrender.com"

    const deleteMessage = async (messageId, type) => { // type: "me" | "everyone"
        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/delete/${messageId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type }),
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            if (type === "me") {
                // Si es "para mí", lo sacamos del array
                setMessages(messages.filter((msg) => msg._id !== messageId));
            } else {
                // Si es "para todos", el backend devuelve el mensaje actualizado (soft delete)
                // Esperamos el evento de socket, pero actualizamos local por si acaso
                setMessages(messages.map((msg) => msg._id === messageId ? { ...msg, ...data } : msg));
            }

            toast.success("Mensaje eliminado");
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteMessage, loading };
};

export default useDeleteMessage;