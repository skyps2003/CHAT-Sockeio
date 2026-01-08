import { useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useEditMessage = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, setEditingMessage } = useConversation();

    const editMessage = async (messageId, newMessageContent) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/messages/edit/${messageId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
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