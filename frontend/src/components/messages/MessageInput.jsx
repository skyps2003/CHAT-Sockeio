import { useState, useRef, useEffect } from "react";
import { BsSend, BsPaperclip, BsX, BsMic, BsStopCircle, BsPencil, BsReply } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useEditMessage from "../../hooks/useEditMessage"; // ✅ Hook Editar
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast";

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);

	// ✅ Estados para grabación
	const [isRecording, setIsRecording] = useState(false);
	const [recordingDuration, setRecordingDuration] = useState(0);

	const fileInputRef = useRef(null);
	const typingTimeoutRef = useRef(null);
	const inputRef = useRef(null); // Para enfocar el input

	// ✅ Refs para audio
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const timerIntervalRef = useRef(null);

	const { loading, sendMessage } = useSendMessage();
	const { editMessage, loading: editLoading } = useEditMessage(); // ✅ Hook
	const { socket } = useSocketContext();

	// ✅ Estados globales para Reply / Edit
	const {
		selectedConversation,
		replyingTo, setReplyingTo,
		editingMessage, setEditingMessage
	} = useConversation();

	// 1. Cuando le damos a "Editar", rellenamos el input con el texto actual
	useEffect(() => {
		if (editingMessage) {
			setMessage(editingMessage.message);
			inputRef.current?.focus();
		}
	}, [editingMessage]);

	// 2. Si estamos respondiendo, enfocar input
	useEffect(() => {
		if (replyingTo) {
			inputRef.current?.focus();
		}
	}, [replyingTo]);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) setSelectedFile(file);
	};

	// --- LÓGICA TYPING ---
	const handleInputChange = (e) => {
		setMessage(e.target.value);
		if (!socket) return;
		socket.emit("typing", selectedConversation._id);
		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		typingTimeoutRef.current = setTimeout(() => {
			socket.emit("stopTyping", selectedConversation._id);
		}, 2000);
	};

	// --- LÓGICA GRABACIÓN DE VOZ ---
	const startRecording = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaRecorderRef.current = new MediaRecorder(stream);
			audioChunksRef.current = [];

			mediaRecorderRef.current.ondataavailable = (event) => {
				if (event.data.size > 0) audioChunksRef.current.push(event.data);
			};

			mediaRecorderRef.current.onstop = () => {
				const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
				const audioFile = new File([audioBlob], "voice_note.webm", { type: "audio/webm" });
				setSelectedFile(audioFile); // Lo seteamos como archivo seleccionado
				stream.getTracks().forEach(track => track.stop()); // Apagar mic
			};

			mediaRecorderRef.current.start();
			setIsRecording(true);
			setRecordingDuration(0);
			timerIntervalRef.current = setInterval(() => {
				setRecordingDuration(prev => prev + 1);
			}, 1000);

		} catch (error) {
			console.error("Error microfono:", error);
			toast.error("No se pudo acceder al micrófono");
		}
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current && isRecording) {
			mediaRecorderRef.current.stop();
			setIsRecording(false);
			clearInterval(timerIntervalRef.current);
		}
	};

	const cancelRecording = () => {
		stopRecording();
		setSelectedFile(null);
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};

	// ✅ CANCELAR ESTADO (Cerrar banner de editar/responder)
	const cancelAction = () => {
		setReplyingTo(null);
		setEditingMessage(null);
		setMessage("");
		setSelectedFile(null);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim() && !selectedFile) return;

		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		socket?.emit("stopTyping", selectedConversation._id);

		// A) MODO EDICIÓN
		if (editingMessage) {
			await editMessage(editingMessage._id, message);
			setEditingMessage(null);
		}
		// B) MODO ENVÍO (Nuevo o Respuesta)
		else {
			await sendMessage(message, selectedFile);
		}

		setMessage("");
		setSelectedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const isLoading = loading || editLoading;

	return (
		<form onSubmit={handleSubmit} className="p-4 border-t border-green-500/20 flex flex-col gap-2">

			{/* ✅ PANEL DE AVISO: RESPONDER O EDITAR */}
			{replyingTo && (
				<div className="flex items-center justify-between p-2 rounded-lg bg-gray-800/50 border-l-4 border-green-500 animate-slide-up">
					<div className="flex flex-col text-sm ml-2">
						<span className="flex items-center gap-2 text-green-400 font-bold">
							<BsReply /> Respondiendo a {replyingTo.senderId === selectedConversation._id ? selectedConversation.fullName : "ti mismo"}
						</span>
						<span className="text-gray-400 line-clamp-1 italic">{replyingTo.message || "Archivo adjunto"}</span>
					</div>
					<button type="button" onClick={cancelAction} className="text-gray-400 hover:text-white p-1">
						<BsX size={20} />
					</button>
				</div>
			)}

			{editingMessage && (
				<div className="flex items-center justify-between p-2 rounded-lg bg-blue-900/30 border-l-4 border-blue-500 animate-slide-up">
					<div className="flex flex-col text-sm ml-2">
						<span className="flex items-center gap-2 text-blue-400 font-bold">
							<BsPencil /> Editando mensaje
						</span>
						<span className="text-gray-400 line-clamp-1 italic">{editingMessage.message}</span>
					</div>
					<button type="button" onClick={cancelAction} className="text-gray-400 hover:text-white p-1">
						<BsX size={20} />
					</button>
				</div>
			)}


			{/* Previsualización de archivo */}
			{selectedFile && !isRecording && (
				<div className="flex items-center gap-2 mb-1 bg-gray-800 p-2 rounded-lg w-fit animate-fade-in-up">
					<span className="text-xs text-green-400 truncate max-w-[200px]">
						{selectedFile.type.startsWith("audio") ? "🎤 Nota de voz lista" : selectedFile.name}
					</span>
					<button
						type="button"
						onClick={() => {
							setSelectedFile(null);
							if (fileInputRef.current) fileInputRef.current.value = "";
						}}
						className="text-red-400 hover:text-red-600"
					>
						<BsX size={16} />
					</button>
				</div>
			)}

			<div className="relative flex items-center gap-3">

				{/* MODO GRABACIÓN */}
				{isRecording ? (
					<div className="flex-1 flex items-center gap-4 bg-red-900/20 border border-red-500/30 rounded-xl px-4 h-11 animate-pulse">
						<span className="text-red-500 text-sm font-mono font-bold">🔴 {formatTime(recordingDuration)}</span>
						<div className="flex-1"></div>
						<button type="button" onClick={cancelRecording} className="text-xs text-gray-400 hover:text-white underline">
							Cancelar
						</button>
						<button type="button" onClick={stopRecording} className="text-red-500 hover:text-red-400 hover:scale-110 transition">
							<BsStopCircle size={24} />
						</button>
					</div>
				) : (
					/* MODO NORMAL */
					<>
						<input
							type="file"
							ref={fileInputRef}
							className="hidden"
							onChange={handleFileChange}
						/>

						<button
							type="button"
							className="text-green-500 hover:text-green-400 transition-colors"
							onClick={() => fileInputRef.current.click()}
						>
							<BsPaperclip size={20} />
						</button>

						<input
							type="text"
							ref={inputRef}
							className="
								flex-1 h-11 px-4
								rounded-xl
								bg-black/40
								border border-green-500/30
								text-white text-sm
								placeholder-gray-400
								focus:outline-none focus:border-green-400
							"
							placeholder={editingMessage ? "Edita tu mensaje..." : "Escribe un mensaje…"}
							value={message}
							onChange={handleInputChange}
							// Si está editando y presiona Escape, cancelamos
							onKeyDown={(e) => {
								if (e.key === "Escape") cancelAction();
							}}
						/>

						{/* Botón dinámico: ENVIAR vs MICRÓFONO */}
						{message.trim() || selectedFile ? (
							<button type="submit" disabled={isLoading} className="send-btn text-green-500">
								{isLoading ? <span className="loading loading-spinner loading-sm"></span> : <BsSend size={20} />}
							</button>
						) : (
							<button
								type="button"
								onClick={startRecording}
								className="text-gray-400 hover:text-green-400 transition hover:scale-110"
							>
								<BsMic size={22} />
							</button>
						)}
					</>
				)}
			</div>
		</form>
	);
};

export default MessageInput;