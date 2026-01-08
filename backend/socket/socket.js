import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js"; // Importante para Vistos y Reacciones

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: ["http://localhost:3000"], // Ajusta esto si tu puerto frontend cambia
		methods: ["GET", "POST"],
	},
});

export const getReceiverSocketId = (receiverId) => {
	return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
	console.log("Un usuario conectado", socket.id);

	const userId = socket.handshake.query.userId;
	if (userId != "undefined") userSocketMap[userId] = socket.id;

	// Emitir usuarios en línea a todos
	io.emit("getOnlineUsers", Object.keys(userSocketMap));

	// ======================================================
	// 1. EVENTOS DE CHAT (Typing, Vistos, Reacciones)
	// ======================================================

	// ESCRIBIENDO...
	socket.on("typing", (receiverId) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("typing", userId);
		}
	});

	socket.on("stopTyping", (receiverId) => {
		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("stopTyping", userId);
		}
	});

	// MARCAR COMO VISTO (SEEN)
	socket.on("markMessagesAsSeen", async ({ conversationId }) => {
		try {
			// Actualizamos en BD todos los mensajes que me enviaron a mí en esa conversa
			await Message.updateMany(
				{ senderId: conversationId, receiverId: userId, status: "sent" },
				{ $set: { status: "seen" } }
			);

			// Avisamos al OTRO usuario (el que envió los mensajes) que ya los vi
			const receiverSocketId = getReceiverSocketId(conversationId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("messagesSeen", { conversationId });
			}
		} catch (error) {
			console.log(error);
		}
	});

	// REACCIONES (EMOJIS)
	socket.on("addReaction", async ({ messageId, reaction, receiverId }) => {
		try {
			const message = await Message.findById(messageId);
			if (!message) return;

			// Verificar si el usuario ya reaccionó (para actualizar o agregar)
			const existingReactionIndex = message.reactions.findIndex(
				(r) => r.userId.toString() === userId
			);

			if (existingReactionIndex !== -1) {
				message.reactions[existingReactionIndex].emoji = reaction;
			} else {
				message.reactions.push({ userId, emoji: reaction });
			}

			await message.save();

			// Emitir actualización al receptor y al emisor (para que se vea instantáneo)
			const receiverSocketId = getReceiverSocketId(receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("reactionUpdate", { messageId, reactions: message.reactions });
			}
			// También emitir a mí mismo (aunque el front podría optimizarlo, esto asegura sincronía)
			socket.emit("reactionUpdate", { messageId, reactions: message.reactions });

		} catch (error) {
			console.log(error);
		}
	});

	// ======================================================
	// 2. EVENTOS DE VIDEOLLAMADA (WebRTC Signaling)
	// ======================================================

	// Iniciar llamada: A llama a B
	socket.on("callUser", ({ userToCall, signalData, from, name }) => {
		const receiverSocketId = getReceiverSocketId(userToCall);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("callUser", {
				signal: signalData, // PeerID del que llama
				from,
				name
			});
		}
	});

	// Responder llamada: B acepta y envía su PeerID a A
	socket.on("answerCall", (data) => {
		const receiverSocketId = getReceiverSocketId(data.to);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("callAccepted", data.signal);
		}
	});

	// Finalizar llamada
	socket.on("endCall", ({ id }) => {
		const receiverSocketId = getReceiverSocketId(id);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("endCall");
		}
	});

	// ======================================================
	// DESCONEXIÓN
	// ======================================================
	socket.on("disconnect", () => {
		console.log("Un usuario desconectado", socket.id);
		delete userSocketMap[userId];
		io.emit("getOnlineUsers", Object.keys(userSocketMap));
	});
});

export { app, io, server };