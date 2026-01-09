import { useAuthContext } from "../../context/AuthContext";
import useConversation from "../../zustand/useConversation";
import useDeleteMessage from "../../hooks/useDeleteMessage";
import { useSocketContext } from "../../context/SocketContext";
import useChatSettings from "../../zustand/useChatSettings"; // ✅ Settings
import { extractTime } from "../../utils/extractTime";
import { BsDownload, BsCheck2, BsCheck2All, BsEmojiSmile, BsThreeDotsVertical, BsReply, BsPencil, BsTrash } from "react-icons/bs";
import { useState, useRef } from "react";

const Message = ({ message }) => {
    const { authUser } = useAuthContext();
    const { selectedConversation, setReplyingTo, setEditingMessage } = useConversation();
    const { socket } = useSocketContext();
    const { deleteMessage } = useDeleteMessage();

    // ✅ Obtener estilos
    const { getSettings } = useChatSettings();
    const { bubbleStyle = "modern" } = getSettings(selectedConversation?._id);

    const [showMenu, setShowMenu] = useState(false);
    const [showReactionMenu, setShowReactionMenu] = useState(false);
    const closeMenuTimerRef = useRef(null);

    if (!message) return null;

    const fromMe = message.senderId === authUser?._id;
    const formattedTime = extractTime(message.createdAt);
    const chatClassName = fromMe ? "chat-end" : "chat-start";

    const isDeleted = message.deletedEveryone;
    const msgContent = isDeleted ? "🚫 Este mensaje fue eliminado" : message.message;

    const profilePic = fromMe ? authUser?.profilePic : selectedConversation?.profilePic;
    const BACKEND_URL = "https://chat-sockeio-1.onrender.com";
    const fileUrl = message.fileUrl ? `${BACKEND_URL}${message.fileUrl}` : null;

    // ✅ LÓGICA DE ESTILOS DE BURBUJA
    const getBubbleClasses = () => {
        const base = "px-3 py-2 flex flex-col gap-1 relative shadow-md transition-all";

        switch (bubbleStyle) {
            case "comic":
                return fromMe
                    ? `${base} bg-yellow-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black rounded-lg`
                    : `${base} bg-white text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black rounded-lg`;

            case "cloud":
                return fromMe
                    ? `${base} bg-gradient-to-r from-blue-400 to-blue-200 text-blue-900 rounded-[20px] rounded-br-[4px] border border-blue-100`
                    : `${base} bg-white text-gray-700 rounded-[20px] rounded-bl-[4px] border border-gray-100`;

            case "modern":
            default:
                return fromMe
                    ? `${base} bg-green-500 text-white rounded-2xl rounded-br-md`
                    : `${base} bg-gray-800 text-gray-100 rounded-2xl rounded-bl-md`;
        }
    };

    const bubbleStyles = getBubbleClasses();


    // --- HANDLERS ---
    const handleReaction = (emoji) => {
        socket.emit("addReaction", { messageId: message._id, reaction: emoji, receiverId: fromMe ? selectedConversation._id : message.senderId });
        setShowReactionMenu(false);
    };

    const handleDelete = (type) => {
        deleteMessage(message._id, type);
        setShowMenu(false);
    };

    const handleMouseEnter = () => { if (closeMenuTimerRef.current) clearTimeout(closeMenuTimerRef.current); };
    const handleMouseLeave = () => { closeMenuTimerRef.current = setTimeout(() => { setShowMenu(false); setShowReactionMenu(false); }, 120); };

    return (
        <div className={`flex items-end gap-2 mb-4 ${fromMe ? "justify-end" : "justify-start"} group relative`}
            onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>

            {!fromMe && <div className="w-9 h-9 rounded-full overflow-hidden"><img src={profilePic} alt="avatar" /></div>}

            <div className="relative max-w-[75%]">

                {/* ✅ MENÚ FLOTANTE (Responder/Editar/Borrar) */}
                {showMenu && !isDeleted && (
                    <div className={`absolute -top-24 ${fromMe ? "right-0" : "left-0"} z-50 bg-[#0b1220] border border-green-500/30 rounded-xl shadow-2xl p-1 flex flex-col gap-1 w-32 animate-in zoom-in-95`}>
                        <button onClick={() => { setReplyingTo(message); setShowMenu(false) }} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-xs text-gray-200 transition">
                            <BsReply size={14} className="text-green-400" /> Responder
                        </button>
                        {fromMe && !message.fileUrl && (
                            <button onClick={() => { setEditingMessage(message); setShowMenu(false) }} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-xs text-gray-200 transition">
                                <BsPencil size={12} className="text-blue-400" /> Editar
                            </button>
                        )}
                        <button onClick={() => handleDelete("me")} className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg text-xs text-gray-200 transition">
                            <BsTrash size={12} className="text-gray-400" /> Para mí
                        </button>
                        {fromMe && (
                            <button onClick={() => handleDelete("everyone")} className="flex items-center gap-2 px-3 py-2 hover:bg-red-500/10 rounded-lg text-xs text-red-400 transition">
                                <BsTrash size={12} /> Para todos
                            </button>
                        )}
                    </div>
                )}

                {/* MENÚ EMOJIS (Igual) */}
                {showReactionMenu && !isDeleted && (
                    <div className={`absolute -top-9 ${fromMe ? "right-2" : "left-2"} bg-gray-900 rounded-full px-3 py-1 flex gap-2 shadow-lg z-50`}>
                        {["👍", "❤️", "😂", "😮", "😢"].map((e) => (<button key={e} onClick={() => handleReaction(e)} className="hover:scale-125 transition text-lg">{e}</button>))}
                    </div>
                )}

                <div className={bubbleStyles}>

                    {/* ✅ VISUALIZACIÓN DE RESPUESTA (Reply Bubble) */}
                    {message.replyTo && !isDeleted && (
                        <div className={`mb-1 p-2 rounded text-xs flex flex-col gap-0.5 opacity-90 ${bubbleStyle === 'comic' ? 'bg-black/10 border-l-2 border-black' : 'bg-black/20 border-l-4 border-white/30'
                            }`}>
                            <span className="font-bold opacity-80">{message.replyTo.senderId === authUser._id ? "Tú" : selectedConversation.fullName}</span>
                            <span className="line-clamp-1">{message.replyTo.message || "Archivo adjunto"}</span>
                        </div>
                    )}

                    {/* ✅ BOTÓN 3 PUNTOS */}
                    {!isDeleted && (
                        <button onClick={() => setShowMenu(!showMenu)} className={`absolute top-2 ${fromMe ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition`}>
                            <BsThreeDotsVertical size={16} />
                        </button>
                    )}

                    {/* ARCHIVOS (Si no está borrado) */}
                    {!isDeleted && message.fileUrl && (
                        <>
                            {message.fileType === "image" && <img src={fileUrl} alt="img" className="max-w-[240px] rounded-xl object-cover mb-1" />}
                            {message.fileType === "video" && <video src={fileUrl} controls className="max-w-[240px] rounded-xl mb-1" />}
                            {message.fileType === "audio" && <div className="bg-black/20 rounded-full px-3 py-1 w-[220px] mb-1"><audio controls className="w-full h-7"><source src={fileUrl} /></audio></div>}
                            {!["image", "video", "audio"].includes(message.fileType) && <a href={fileUrl} download className="flex items-center gap-2 underline text-xs mb-1"><BsDownload /> Descargar archivo</a>}
                        </>
                    )}

                    {/* Link Preview (Si existe y no está borrado) */}
                    {!isDeleted && message.linkMetadata && (
                        <a href={message.linkMetadata.url} target="_blank" className="block mt-1 mb-1 rounded border border-white/10 bg-black/20 overflow-hidden">
                            {message.linkMetadata.image && <img src={message.linkMetadata.image} className="w-full h-24 object-cover opacity-80" />}
                            <div className="p-2"><span className="text-[10px] font-bold opacity-90 block truncate">{message.linkMetadata.title}</span></div>
                        </a>
                    )}

                    {/* TEXTO */}
                    <span className={`break-words leading-snug ${isDeleted ? "italic opacity-60" : ""}`}>{msgContent}</span>

                    {/* BOTÓN EMOJI */}
                    {!isDeleted && (
                        <button onClick={() => setShowReactionMenu(!showReactionMenu)} className={`absolute top-8 ${fromMe ? "-left-8" : "-right-8"} opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-yellow-400`}>
                            <BsEmojiSmile size={18} />
                        </button>
                    )}

                    {/* REACCIONES */}
                    {!isDeleted && message.reactions?.length > 0 && (
                        <div className={`absolute -bottom-2 ${fromMe ? "left-0 translate-x-[-50%]" : "right-0 translate-x-[50%]"} bg-gray-900 border border-gray-700 rounded-full px-1.5 py-0.5 text-[10px] flex gap-0.5 shadow-md z-10`}>
                            {message.reactions.slice(0, 3).map((r, i) => <span key={i}>{r.emoji}</span>)}
                            {message.reactions.length > 3 && <span>+</span>}
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-1 text-[10px] text-gray-400 mt-0.5 justify-end px-1">
                    {formattedTime}
                    {/* ✅ Indicador Editado */}
                    {!isDeleted && message.isEdited && <span className="italic ml-1 opacity-70">editado</span>}
                    {fromMe && !isDeleted && <span className={message.status === "seen" ? "text-blue-400" : ""}>{message.status === "seen" ? <BsCheck2All size={14} /> : <BsCheck2 size={14} />}</span>}
                </div>
            </div>

            {fromMe && <div className="w-9 h-9 rounded-full overflow-hidden"><img src={profilePic} alt="avatar" /></div>}
        </div>
    );
};

export default Message;
