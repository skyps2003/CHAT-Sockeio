import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
	{
		senderId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		message: {
			type: String,
			default: "",
		},
		fileUrl: {
			type: String,
			default: "",
		},
		fileType: {
			type: String,
			default: "",
		},
		status: {
			type: String,
			enum: ["sent", "seen"],
			default: "sent",
		},
		reactions: [
			{
				userId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "User",
				},
				emoji: String,
			},
		],
		linkMetadata: {
			title: String,
			description: String,
			image: String,
			url: String
		},
		// ✅ NUEVO: Referencia al mensaje respondido
		replyTo: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Message",
			default: null
		},
		// ✅ NUEVO: Bandera de edición
		isEdited: {
			type: Boolean,
			default: false
		},
		// ✅ NUEVO: Eliminado para todos (Soft Delete)
		deletedEveryone: {
			type: Boolean,
			default: false
		},
		// ✅ NUEVO: Eliminado para mí (Array de usuarios que lo borraron localmente)
		deletedFor: [{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		}]
	},
	{ timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;