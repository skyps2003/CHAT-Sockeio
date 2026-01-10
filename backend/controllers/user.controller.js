import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

import Conversation from "../models/conversation.model.js"; // ✅ Importar modelo

export const getUsersForSidebar = async (req, res) => {
	try {
		const loggedInUserId = req.user._id;

		// 1. Obtener todos los usuarios (excepto yo)
		const allUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

		// 2. Obtener conversaciones del usuario logueado
		const conversations = await Conversation.find({
			participants: loggedInUserId
		}).populate("messages");

		// 3. Crear mapa de usuarios con info extra
		const usersWithMetadata = allUsers.map(user => {
			// Buscar conversación con este usuario
			const conversation = conversations.find(c =>
				c.participants.some(p => p.toString() === user._id.toString())
			);

			// Por defecto
			let lastMessageTime = 0; // 1970 (al final)
			let unreadCount = 0;

			if (conversation) {
				// Tiempo del último update (mensaje)
				lastMessageTime = new Date(conversation.updatedAt).getTime();

				// Contar no leídos: Mensajes donde yo soy el receiver y status != "seen"
				// OJO: Hay que asegurar que el mensaje no sea mío
				unreadCount = conversation.messages.reduce((acc, msg) => {
					// Si el mensaje NO es mío, y NO ha sido visto
					if (msg.senderId.toString() !== loggedInUserId.toString() && msg.status !== "seen") {
						return acc + 1;
					}
					return acc;
				}, 0);
			}

			return {
				...user.toObject(),
				lastMessageTime,
				unreadCount
			};
		});

		// 4. Ordenar: Primero los que tienen mensajes recientes, luego por nombre
		usersWithMetadata.sort((a, b) => {
			if (b.lastMessageTime !== a.lastMessageTime) {
				return b.lastMessageTime - a.lastMessageTime; // Descendente (más nuevo arriba)
			}
			return a.fullName.localeCompare(b.fullName); // Si empate, alfabético
		});

		res.status(200).json(usersWithMetadata);
	} catch (error) {
		console.error("Error en getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Error Interno del Servidor" });
	}
};

export const updateUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const { fullName, username, password, profilePic } = req.body;

		const user = await User.findById(userId);

		if (!user) {
			return res.status(404).json({ error: "Usuario no encontrado" });
		}

		if (fullName) user.fullName = fullName;

		// ✅ LÓGICA DE AVATAR:
		// 1. Si hay archivo subido, usamos esa ruta local.
		// 2. Si no hay archivo pero hay profilePic en body (preset), lo usamos.
		if (req.file) {
			user.profilePic = `/uploads/${req.file.filename}`;
		} else if (profilePic) {
			user.profilePic = profilePic;
		}

		if (username && username !== user.username) {
			const existingUser = await User.findOne({ username });
			if (existingUser) {
				return res.status(400).json({ error: "El nombre de usuario ya está en uso" });
			}
			user.username = username;
		}

		if (password) {
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(password, salt);
		}

		await user.save();

		res.status(200).json({
			_id: user._id,
			fullName: user.fullName,
			username: user.username,
			profilePic: user.profilePic,
		});

	} catch (error) {
		console.error("Error en updateUser: ", error.message);
		res.status(500).json({ error: "Error Interno del Servidor" });
	}
};