import { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import ChatSettings from "./ChatSettings"; // ✅ Ajustes
import { TiMessages } from "react-icons/ti";
import { BsCameraVideo, BsTelephone, BsThreeDotsVertical } from "react-icons/bs";
import { IoArrowBack } from "react-icons/io5";
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { useCallContext } from "../../context/CallContext";

const MessageContainer = () => {
	const { selectedConversation, setSelectedConversation, markAsRead } = useConversation();
	const { socket, onlineUsers } = useSocketContext();
	const { callUser } = useCallContext();
	const [isTyping, setIsTyping] = useState(false);
	const [showSettings, setShowSettings] = useState(false); // ✅ Estado para menú de ajustes

	const isOnline = onlineUsers?.includes(selectedConversation?._id);

	// Limpiar al desmontar
	useEffect(() => {
		return () => setSelectedConversation(null);
	}, [setSelectedConversation]);

	// ✅ CORRECCIÓN 1: Lógica para MARCAR COMO VISTO (Seen)
	useEffect(() => {
		if (selectedConversation?._id) {

			// 1. Limpiar notificaciones no leídas
			markAsRead(selectedConversation._id);

			if (socket) {
				// A) Al entrar al chat, avisar al backend que ya vimos los mensajes
				socket.emit("markMessagesAsSeen", {
					conversationId: selectedConversation._id,
				});

				// B) Si llega un mensaje nuevo MIENTRAS tengo el chat abierto, marcarlo visto al instante
				const handleMsgSeenInside = (newMessage) => {
					if (newMessage.senderId === selectedConversation._id) {
						socket.emit("markMessagesAsSeen", {
							conversationId: selectedConversation._id,
						});
					}
				};

				socket.on("newMessage", handleMsgSeenInside);

				return () => {
					socket.off("newMessage", handleMsgSeenInside);
				};
			}
		}
	}, [selectedConversation, socket]);

	// Lógica de "Escribiendo..."
	useEffect(() => {
		if (!socket) return;
		const handleTyping = (senderId) => {
			if (selectedConversation?._id === senderId) setIsTyping(true);
		};
		const handleStopTyping = (senderId) => {
			if (selectedConversation?._id === senderId) setIsTyping(false);
		};
		socket.on("typing", handleTyping);
		socket.on("stopTyping", handleStopTyping);
		return () => {
			socket.off("typing", handleTyping);
			socket.off("stopTyping", handleStopTyping);
		};
	}, [socket, selectedConversation]);

	return (
		<div className="flex flex-col flex-1 bg-doodle min-h-full max-h-full relative">
			{!selectedConversation ? (
				<NoChatSelected />
			) : (
				<>
					{/* HEADER */}
					<div className="h-[64px] flex items-center justify-between px-6 border-b border-green-500/20 bg-black/40 backdrop-blur-xl shrink-0 relative z-20">
						<div className="flex items-center gap-3">
							<button
								className='md:hidden text-gray-300 hover:text-white transition'
								onClick={() => setSelectedConversation(null)}
							>
								<IoArrowBack size={24} />
							</button>
							<div className="relative">
								<img
									src={selectedConversation.profilePic}
									alt="avatar"
									className="w-11 h-11 rounded-full object-cover border border-green-500/40"
								/>
								<span className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-black ${isOnline ? "bg-green-500" : "bg-gray-500"}`} />
							</div>
							<div className="flex flex-col">
								<span className="text-green-400 font-semibold text-lg truncate leading-tight">
									{selectedConversation.fullName}
								</span>
								{isTyping ? (
									<span className="text-xs text-green-400/80 animate-pulse italic">Escribiendo...</span>
								) : (
									<span className="text-xs text-gray-500">{isOnline ? "En línea" : "Fuera de línea"}</span>
								)}
							</div>
						</div>

						<div className="flex items-center gap-2">
							<button onClick={() => callUser(selectedConversation._id, "audio")} className="text-green-500/70 hover:text-green-400 transition hover:bg-green-500/10 p-2 rounded-full">
								<BsTelephone size={20} />
							</button>
							<button onClick={() => callUser(selectedConversation._id, "video")} className="text-green-500/70 hover:text-green-400 transition hover:bg-green-500/10 p-2 rounded-full">
								<BsCameraVideo size={22} />
							</button>

							{/* ✅ BOTÓN DE AJUSTES */}
							<div className="relative">
								<button
									onClick={() => setShowSettings(!showSettings)}
									className={`text-green-500/70 hover:text-green-400 transition p-2 rounded-full ${showSettings ? "bg-green-500/20 text-green-400" : "hover:bg-green-500/10"}`}
								>
									<BsThreeDotsVertical size={22} />
								</button>
								{/* ✅ MODAL DE AJUSTES */}
								{showSettings && <ChatSettings onClose={() => setShowSettings(false)} />}
							</div>
						</div>
					</div>

					<div className="flex-1 overflow-y-auto">
						<Messages />
					</div>
					<div className="shrink-0">
						<MessageInput />
					</div>
				</>
			)}
		</div>
	);
};

export default MessageContainer;

const NoChatSelected = () => {
	const { authUser } = useAuthContext();
	return (
		<div className="flex items-center justify-center flex-1">
			<div className="flex flex-col items-center gap-4 text-center">
				<TiMessages size={64} className="text-green-400 opacity-90" />
				<p className="text-xl font-semibold text-gray-200">¡Hola, {authUser.fullName}! 👋</p>
				<p className="text-sm text-gray-400 max-w-[260px]">Selecciona una conversación para comenzar a chatear</p>
			</div>
		</div>
	);
};