import useConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContext";

const Conversation = ({ conversation, emoji, lastIdx }) => {
	const { selectedConversation, setSelectedConversation, unreadMessages } = useConversation();
	const { onlineUsers } = useSocketContext();

	const isSelected = selectedConversation?._id === conversation._id;
	const isOnline = onlineUsers?.includes(conversation._id);
	// ✅ CONTADOR DE NO LEÍDOS
	// Priorizamos el valor del estado global (socket) si existe (incluso si es 0), fallback al backend
	const globalCount = unreadMessages[conversation._id];
	const unreadCount = globalCount !== undefined ? globalCount : (conversation.unreadCount || 0);

	return (
		<>
			<div
				onClick={() => setSelectedConversation(conversation)}
				className={`
					group flex items-center gap-3 p-3 rounded-xl cursor-pointer
					transition-all duration-200
					hover:bg-green-500/10 hover:shadow-md hover:shadow-green-500/10
					${isSelected ? "bg-green-500/20 ring-1 ring-green-500/40" : ""}
				`}
			>
				{/* Avatar */}
				<div className="relative">
					<div className="w-12 rounded-full ring-2 ring-green-500/30 group-hover:ring-green-400 transition">
						<img
							src={conversation.profilePic}
							alt="user avatar"
							className="rounded-full"
						/>
					</div>

					{/* Punto de estado */}
					<span
						className={`
							absolute bottom-0 right-0
							w-3 h-3 rounded-full border-2 border-gray-900
							${isOnline
								? "bg-green-400 shadow-md shadow-green-400/60"
								: "bg-gray-500"}
						`}
					/>
				</div>

				{/* Info */}
				<div className="flex flex-col flex-1 overflow-hidden">
					<div className="flex items-center justify-between">
						<p className="font-semibold text-gray-200 truncate group-hover:text-green-400 transition">
							{conversation.fullName}
						</p>

						{/* ✅ Emoji o Badge de No leídos */}
						{unreadCount > 0 ? (
							<span className="bg-green-500 text-black text-xs font-bold px-2 py-0.5 rounded-full shadow-lg animate-bounce">
								{unreadCount}
							</span>
						) : (
							<span className="text-lg opacity-70 group-hover:opacity-100 transition">
								{emoji}
							</span>
						)}
					</div>
				</div>
			</div>

			{!lastIdx && (
				<div className="mx-3 border-b border-green-500/10" />
			)}
		</>
	);
};

export default Conversation;
