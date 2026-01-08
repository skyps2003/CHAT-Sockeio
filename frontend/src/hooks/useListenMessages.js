import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../assets/sounds/notification.mp3";

const useListenMessages = () => {
	const { socket } = useSocketContext();
	const { messages, setMessages, selectedConversation, incrementUnread } = useConversation();

	useEffect(() => {
		if (!socket) return;

		// 1. ESCUCHAR NUEVOS MENSAJES
		const handleNewMessage = (newMessage) => {
			const sound = new Audio(notificationSound);
			sound.play();
			newMessage.shouldShake = true;

			// Si el chat está abierto y es el remitente, lo agregamos
			if (selectedConversation?._id === newMessage.senderId) {
				setMessages([...messages, newMessage]);
			} else {
				// 🔔 SI NO ESTÁ ABIERTO, INCREMENTAR CONTADOR NO LEÍDOS
				incrementUnread(newMessage.senderId);
			}
		};

		// 2. ESCUCHAR ACTUALIZACIÓN DE REACCIONES
		const handleReactionUpdate = ({ messageId, reactions }) => {
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg._id === messageId ? { ...msg, reactions } : msg
				)
			);
		};

		// 3. ESCUCHAR CONFIRMACIÓN DE VISTO
		const handleMessagesSeen = ({ conversationId }) => {
			if (selectedConversation?._id === conversationId) {
				setMessages((prevMessages) =>
					prevMessages.map((msg) => {
						if (msg.status !== "seen") {
							return { ...msg, status: "seen" };
						}
						return msg;
					})
				);
			}
		};

		// ✅ 4. NUEVO: ESCUCHAR EDICIÓN / ELIMINACIÓN
		const handleMessageUpdated = (updatedMessage) => {
			setMessages((prevMessages) =>
				prevMessages.map((msg) =>
					msg._id === updatedMessage._id ? updatedMessage : msg
				)
			);
		};

		// --- SUSCRIPCIONES ---
		socket.on("newMessage", handleNewMessage);
		socket.on("reactionUpdate", handleReactionUpdate);
		socket.on("messagesSeen", handleMessagesSeen);
		socket.on("messageUpdated", handleMessageUpdated); // ✅ Agregado

		// --- LIMPIEZA ---
		return () => {
			socket.off("newMessage", handleNewMessage);
			socket.off("reactionUpdate", handleReactionUpdate);
			socket.off("messagesSeen", handleMessagesSeen);
			socket.off("messageUpdated", handleMessageUpdated); // ✅ Agregado
		};
	}, [socket, setMessages, messages, selectedConversation]);
};

export default useListenMessages;