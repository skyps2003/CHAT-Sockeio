import { useEffect, useRef } from "react";
import useGetMessages from "../../hooks/useGetMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import Message from "./Message";
import useListenMessages from "../../hooks/useListenMessages";

const Messages = () => {
	const { messages, loading } = useGetMessages();
	useListenMessages();
	const lastMessageRef = useRef();

	useEffect(() => {
		setTimeout(() => {
			lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
		}, 100);
	}, [messages]);

	return (
		// Agregamos scrollbar-thin para que sea elegante
		<div className='px-2 md:px-6 flex-1 overflow-auto py-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent h-full'>
			{!loading &&
				messages &&
				messages.length > 0 &&
				messages.map((message) => (
					<div key={message._id} ref={lastMessageRef}>
						<Message message={message} />
					</div>
				))}

			{loading && [...Array(3)].map((_, idx) => <MessageSkeleton key={idx} />)}

			{!loading && (!messages || messages.length === 0) && (
				<div className="flex flex-col items-center justify-center h-full opacity-50">
					<p className='text-gray-400'>No hay mensajes aún.</p>
					<p className='text-gray-600 text-sm'>Sé el primero en saludar 👋</p>
				</div>
			)}
		</div>
	);
};

export default Messages;