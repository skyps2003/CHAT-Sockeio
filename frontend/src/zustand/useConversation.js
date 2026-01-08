import { create } from "zustand";

const useConversation = create((set) => ({
	selectedConversation: null,
	setSelectedConversation: (selectedConversation) => set({ selectedConversation }),

	messages: [],
	setMessages: (messages) => set((state) => ({
		messages: typeof messages === "function" ? messages(state.messages) : messages
	})),

	// ✅ ESTADOS PARA RESPONDER Y EDITAR
	replyingTo: null,
	setReplyingTo: (message) => set({ replyingTo: message }),

	editingMessage: null,
	setEditingMessage: (message) => set({ editingMessage: message }),
}));

export default useConversation;