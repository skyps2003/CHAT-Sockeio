import useGetConversations from "../../hooks/useGetConversations";
import { getRandomEmoji } from "../../utils/emojis";
import Conversation from "./Conversation";

const Conversations = () => {
	const { loading, conversations } = useGetConversations();

	return (
		<div className="flex flex-col overflow-y-auto px-2 py-2 space-y-1 scrollbar-thin scrollbar-thumb-green-500/30 scrollbar-track-transparent">

			{conversations.map((conversation, idx) => (
				<Conversation
					key={conversation._id}
					conversation={conversation}
					emoji={getRandomEmoji()}
					lastIdx={idx === conversations.length - 1}
				/>
			))}

			{loading && (
				<div className="flex justify-center py-4">
					<span className="loading loading-spinner text-green-400"></span>
				</div>
			)}
		</div>
	);
};

export default Conversations;
