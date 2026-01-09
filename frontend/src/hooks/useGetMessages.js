import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";
import toast from "react-hot-toast";

const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { messages, setMessages, selectedConversation } = useConversation();
    
    const BACKEND_URL = import.meta.env.MODE === "development"
    ? "http://localhost:5000"
    : "https://chat-sockeio-1.onrender.com";

    useEffect(() => {
        const getMessages = async () => {
            setLoading(true);
            try {
                // ✅ Agregamos credentials: "include"
                const res = await fetch(`${BACKEND_URL}/api/messages/${selectedConversation._id}`, {
                    credentials: "include" 
                });
                const data = await res.json();
                if (data.error) throw new Error(data.error);
                setMessages(data);
            } catch (error) {
                toast.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        if (selectedConversation?._id) getMessages();
    }, [selectedConversation?._id, setMessages]);

    return { messages, loading };
};
export default useGetMessages;