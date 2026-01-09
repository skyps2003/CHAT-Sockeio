import { useState } from "react";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConversation";

const useDeleteChat = () => {
    const [loading, setLoading] = useState(false);
    const { selectedConversation, setMessages } = useConversation();
    const BACKEND_URL = import.meta.env.MODE === "development"
	? "http://localhost:5000"
	: "https://chat-sockeio-1.onrender.com"
    const deleteChat = async () => {
        if (!window.confirm("¿Seguro que quieres vaciar este chat? Se borrará para ti.")) return;

        setLoading(true);
        try {
            const res = await fetch(`${BACKEND_URL}/api/messages/delete_chat/${selectedConversation._id}`, {
                credentials: "include", // ✅ AGREGA ESTA LÍNEA (¡Vital!)
                method: "DELETE",
            });
            const data = await res.json();
            if (data.error) throw new Error(data.error);

            toast.success(data.message);
            setMessages([]); // Limpiar UI
        } catch (error) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return { deleteChat, loading };
};

export default useDeleteChat;
