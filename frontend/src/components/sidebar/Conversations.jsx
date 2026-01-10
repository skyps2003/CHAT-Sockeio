import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = ({ searchTerm }) => {
	const { loading, conversations } = useGetConversations();

	// ✅ FILTRADO EN TIEMPO REAL
	// Si hay searchTerm, filtramos. Si no, mostramos todas.
	const filteredConversations = conversations.filter((c) => {
		if (!searchTerm) return true;
		return c.fullName.toLowerCase().includes(searchTerm.toLowerCase());
	});

	return (
		<div className="flex flex-col overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-transparent">

			{filteredConversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === filteredConversations.length - 1} // Usamos filteredConversations.length
				/>
			))}

			{loading && (
				<div className="flex justify-center py-4">
					<span className="loading loading-spinner text-green-400"></span>
				</div>
			)}

			{!loading && filteredConversations.length === 0 && (
				<div className="text-center text-gray-500 text-xs mt-4">
					No se encontraron usuarios
				</div>
			)}
		</div>
	);
};

export default Conversations;
