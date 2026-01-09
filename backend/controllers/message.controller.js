import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"; // ✅ Importar User
import { getReceiverSocketId, io } from "../socket/socket.js";
import ogs from "open-graph-scraper";
import { getGeminiResponse } from "../utils/gemini.js"; // ✅ Importar servicio Gemini

export const sendMessage = async (req, res) => {
	try {
		// ✅ MODIFICADO: Recibimos replyToId del body
		const { message, replyToId } = req.body;
		const { id: receiverId } = req.params;
		const senderId = req.user._id;

		let fileUrl = "";
		let fileType = "";

		if (req.file) {
			fileUrl = `/uploads/${req.file.filename}`;
			const mimeType = req.file.mimetype;

			if (mimeType.startsWith("image/")) fileType = "image";
			else if (mimeType.startsWith("video/")) fileType = "video";
			else if (mimeType.startsWith("audio/")) fileType = "audio";
			else fileType = "file";
		}

		let linkMetadata = null;
		const urlRegex = /(https?:\/\/[^\s]+)/g;
		const urls = message ? message.match(urlRegex) : null;

		if (urls && urls.length > 0) {
			try {
				const { result } = await ogs({ url: urls[0] });
				if (result.success) {
					linkMetadata = {
						title: result.ogTitle || result.twitterTitle,
						description: result.ogDescription || result.twitterDescription,
						image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url,
						url: urls[0]
					};
				}
			} catch (err) {
				console.log("Error link metadata:", err.message);
			}
		}

		let conversation = await Conversation.findOne({
			participants: { $all: [senderId, receiverId] },
		});

		if (!conversation) {
			conversation = await Conversation.create({
				participants: [senderId, receiverId],
			});
		}

		const newMessage = new Message({
			senderId,
			receiverId,
			message: message || "",
			fileUrl,
			fileType,
			linkMetadata,
			// ✅ NUEVO: Guardamos la referencia si existe
			replyTo: replyToId ? replyToId : null
		});

		if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

		await Promise.all([conversation.save(), newMessage.save()]);

		// ✅ NUEVO: Si es respuesta, poblamos la info del mensaje original antes de enviarlo por socket
		if (replyToId) {
			await newMessage.populate("replyTo", "senderId message fileType fileUrl");
		}

		const receiverSocketId = getReceiverSocketId(receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("newMessage", newMessage);
		}

		res.status(201).json(newMessage);

		// ✅ INTELIGENCIA ARTIFICIAL: Si el mensaje es para Gemini, responder
		handleGeminiResponse(senderId, receiverId, message, conversation);

	} catch (error) {
		console.log("Error en sendMessage controller:", error);
		res.status(500).json({ error: "Error al enviar el mensaje" });
	}
};

// ==========================================
// ✅ AUXILIAR: M anejador de Respuestas Gemini
// ==========================================
const handleGeminiResponse = async (senderId, receiverId, userMessage, conversation) => {
	try {
		const receiverUser = await User.findById(receiverId);
		if (receiverUser?.username !== "gemini_ai") return;

		// 1. Simular "Escribiendo..."
		const receiverSocketId = getReceiverSocketId(senderId);
		if (receiverSocketId) io.to(receiverSocketId).emit("typing", receiverId);

		// 2. Obtener historial (limitado a últimos 10 mensajes para contexto)
		const lastMessages = await Message.find({
			_id: { $in: conversation.messages }
		}).sort({ createdAt: 1 }).limit(10).populate("senderId", "username");

		const history = lastMessages.map(msg => ({
			role: msg.senderId.username === "gemini_ai" ? "model" : "user",
			message: msg.message,
			senderUsername: msg.senderId.username
		}));

		// 3. Llamar a Gemini
		const aiText = await getGeminiResponse(userMessage, history);

		// 4. Crear mensaje de respuesta
		const aiMessage = new Message({
			senderId: receiverId, // Gemini es el remitente
			receiverId: senderId, // Usuario es el receptor
			message: aiText
		});

		if (aiMessage) {
			conversation.messages.push(aiMessage._id);
			await Promise.all([conversation.save(), aiMessage.save()]);
		}

		// 5. Emitir respuesta y detener "Escribiendo..."
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("stopTyping", receiverId);
			io.to(receiverSocketId).emit("newMessage", aiMessage);
		}

	} catch (error) {
		console.error("Error manejando respuesta Gemini:", error);
	}
};

export const getMessages = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const senderId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [senderId, userToChatId] },
		}).populate({
			path: "messages",
			// ✅ NUEVO: Poblamos también el mensaje respondido dentro de cada mensaje
			populate: { path: "replyTo", select: "message senderId fileType fileUrl" }
		});

		if (!conversation) return res.status(200).json([]);

		// ✅ NUEVO: Filtramos los mensajes que el usuario eliminó "Para mí"
		const messages = conversation.messages.filter(
			(msg) => !msg.deletedFor.includes(senderId)
		);

		res.status(200).json(messages);
	} catch (error) {
		console.log("Error en el controlador getMessages: ", error.message);
		res.status(500).json({ error: "Error Interno del Servidor" });
	}
};

// ==========================================
// ✅ NUEVAS FUNCIONES: EDITAR Y ELIMINAR
// ==========================================

export const editMessage = async (req, res) => {
	try {
		const { message } = req.body;
		const { id: messageId } = req.params;
		const userId = req.user._id;

		const msg = await Message.findById(messageId);
		if (!msg) return res.status(404).json({ error: "Mensaje no encontrado" });

		if (msg.senderId.toString() !== userId.toString()) {
			return res.status(401).json({ error: "No autorizado para editar este mensaje" });
		}

		// Actualizamos
		msg.message = message;
		msg.isEdited = true;
		await msg.save();

		// Emitir evento Socket para actualizar en tiempo real
		const receiverSocketId = getReceiverSocketId(msg.receiverId);
		if (receiverSocketId) {
			io.to(receiverSocketId).emit("messageUpdated", msg);
		}

		res.status(200).json(msg);
	} catch (error) {
		console.log("Error en editMessage:", error);
		res.status(500).json({ error: "Error al editar mensaje" });
	}
};

export const deleteMessage = async (req, res) => {
	try {
		const { id: messageId } = req.params;
		const { type } = req.body; // "me" o "everyone"
		const userId = req.user._id;

		const msg = await Message.findById(messageId);
		if (!msg) return res.status(404).json({ error: "Mensaje no encontrado" });

		if (type === "everyone") {
			// Solo el dueño puede borrar para todos
			if (msg.senderId.toString() !== userId.toString()) {
				return res.status(401).json({ error: "No puedes eliminar mensajes de otros para todos" });
			}

			// Soft Delete: Borramos contenido y marcamos
			msg.deletedEveryone = true;
			msg.message = "🚫 Este mensaje fue eliminado";
			msg.fileUrl = "";
			msg.fileType = "";
			msg.linkMetadata = undefined; // Limpiamos metadata
			await msg.save();

			// Avisar por socket
			const receiverSocketId = getReceiverSocketId(msg.receiverId);
			if (receiverSocketId) {
				io.to(receiverSocketId).emit("messageUpdated", msg);
			}

		} else if (type === "me") {
			// Agregar al usuario al array de "invisible para..."
			if (!msg.deletedFor.includes(userId)) {
				msg.deletedFor.push(userId);
				await msg.save();
			}
		}

		res.status(200).json({ message: "Eliminado exitosamente", msgId: messageId, type });
	} catch (error) {
		console.log("Error en deleteMessage:", error);
		res.status(500).json({ error: "Error al eliminar mensaje" });
	}
};

export const deleteChat = async (req, res) => {
	try {
		const { id: userToChatId } = req.params;
		const userId = req.user._id;

		const conversation = await Conversation.findOne({
			participants: { $all: [userId, userToChatId] },
		});

		if (!conversation) return res.status(200).json({ message: "Chat vaciado" });

		// Marcar todos los mensajes de esta conversación como borrados para este usuario
		await Message.updateMany(
			{ _id: { $in: conversation.messages } },
			{ $addToSet: { deletedFor: userId } }
		);

		res.status(200).json({ message: "Chat vaciado exitosamente" });
	} catch (error) {
		console.log("Error en deleteChat:", error);
		res.status(500).json({ error: "Error al vaciar el chat" });
	}
};