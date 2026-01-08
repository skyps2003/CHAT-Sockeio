import { useRef, useEffect } from "react";
import useChatSettings from "../../zustand/useChatSettings";
import useDeleteChat from "../../hooks/useDeleteChat";
import useConversation from "../../zustand/useConversation";
import { BsTrash, BsX } from "react-icons/bs";

const ChatSettings = ({ onClose }) => {
    const { selectedConversation } = useConversation();
    const { settings, updateSetting } = useChatSettings();
    const { deleteChat, loading } = useDeleteChat();
    const modalRef = useRef();

    const currentSettings = settings[selectedConversation._id] || { bubbleStyle: "modern" };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const styles = [
        { id: "modern", name: "Moderno" },
        { id: "comic", name: "Cómic" },
        { id: "cloud", name: "Nube" },
    ];

    return (
        <div className="absolute top-16 right-4 z-50 animate-in fade-in zoom-in-95 origin-top-right">
            <div ref={modalRef} className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 p-4 rounded-2xl shadow-2xl w-72 text-gray-200 relative">

                {/* HEAD & CLOSE */}
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Personalizar</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition">
                        <BsX size={24} />
                    </button>
                </div>

                {/* ESTILOS */}
                <div className="mb-6">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Estilo de Mensaje</p>
                    <div className="flex flex-col gap-2">
                        {styles.map((st) => (
                            <button
                                key={st.id}
                                onClick={() => updateSetting(selectedConversation._id, "bubbleStyle", st.id)}
                                className={`px-3 py-2 rounded-lg text-sm border text-left transition ${currentSettings.bubbleStyle === st.id ? "bg-green-500/20 border-green-500 text-green-400" : "bg-gray-800 border-gray-700 hover:bg-gray-700"}`}
                            >
                                {st.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="h-px bg-gray-700 my-4" />

                {/* VACIAR CHAT */}
                <button
                    onClick={deleteChat}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2 rounded-lg transition text-sm font-semibold disabled:opacity-50"
                >
                    <BsTrash /> {loading ? "Vaciando..." : "Vaciar Chat"}
                </button>
            </div>
        </div>
    );
};

export default ChatSettings;
