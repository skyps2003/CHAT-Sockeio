import { useState, useRef } from "react";
import { BsSend, BsPaperclip, BsX, BsMic, BsStopCircle } from "react-icons/bs"; // ✅ Nuevos iconos
import useSendMessage from "../../hooks/useSendMessage";
import { useSocketContext } from "../../context/SocketContext";
import useConversation from "../../zustand/useConversation";
import toast from "react-hot-toast"; // ✅ Para errores de micro

const MessageInput = () => {
	const [message, setMessage] = useState("");
	const [selectedFile, setSelectedFile] = useState(null);
	// ✅ Estados para grabación
	const [isRecording, setIsRecording] = useState(false);
	const [recordingDuration, setRecordingDuration] = useState(0);

	const fileInputRef = useRef(null);
	const typingTimeoutRef = useRef(null);

	// ✅ Refs para audio
	const mediaRecorderRef = useRef(null);
	const audioChunksRef = useRef([]);
	const timerIntervalRef = useRef(null);

	const { loading, sendMessage } = useSendMessage();
	const { socket } = useSocketContext();
	const { selectedConversation } = useConversation();

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
		setSelectedFile(null); // Cancelar y no guardar
	};

	const formatTime = (seconds) => {
		const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
		const secs = (seconds % 60).toString().padStart(2, '0');
		return `${mins}:${secs}`;
	};
	// ---------------------------

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!message.trim() && !selectedFile) return;

		if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
		socket?.emit("stopTyping", selectedConversation._id);

		await sendMessage(message, selectedFile);

		setMessage("");
		setSelectedFile(null);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	return (
		<form onSubmit={handleSubmit} className="p-4 border-t border-green-500/20">

			{/* Previsualización de archivo o audio grabado */}
			{selectedFile && (
				<div className="flex items-center gap-2 mb-2 bg-gray-800 p-2 rounded-lg w-fit animate-fade-in-up">
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
							className="
								flex-1 h-11 px-4
								rounded-xl
								bg-black/40
								border border-green-500/30
								text-white text-sm
								placeholder-gray-400
								focus:outline-none focus:border-green-400
							"
							placeholder="Escribe un mensaje…"
							value={message}
							onChange={handleInputChange}
						/>

						{/* Botón dinámico: ENVIAR vs MICRÓFONO */}
						{message.trim() || selectedFile ? (
							<button type="submit" disabled={loading} className="send-btn text-green-500">
								{loading ? <span className="loading loading-spinner loading-sm"></span> : <BsSend size={20} />}
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