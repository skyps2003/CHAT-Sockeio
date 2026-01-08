import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

	messages: [],
	setMessages: (messages) => set((state) => ({
		messages: typeof messages === "function" ? messages(state.messages) : messages
	})),

	unreadMessages: {}, // { userId: count }
	setUnreadMessages: (unreadMessages) => set({ unreadMessages }),

	markAsRead: (conversationId) => set((state) => {
		const newUnread = { ...state.unreadMessages };
		delete newUnread[conversationId];
		return { unreadMessages: newUnread };
	}),

	incrementUnread: (conversationId) => set((state) => ({
		unreadMessages: {
			...state.unreadMessages,
			[conversationId]: (state.unreadMessages[conversationId] || 0) + 1
		}
	})),

	// ✅ ESTADOS PARA RESPONDER Y EDITAR
	replyingTo: null,
	setReplyingTo: (message) => set({ replyingTo: message }),

	editingMessage: null,
	setEditingMessage: (message) => set({ editingMessage: message }),
}));

export default useConversation;