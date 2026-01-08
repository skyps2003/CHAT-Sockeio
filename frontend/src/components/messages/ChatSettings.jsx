import { useRef, useEffect } from "react";
import useChatSettings from "../../zustand/useChatSettings";
import useDeleteChat from "../../hooks/useDeleteChat";
import useConversation from "../../zustand/useConversation";
import { BsTrash } from "react-icons/bs";

const ChatSettings = ({ onClose }) => {
    const { selectedConversation } = useConversation();
    const { settings, updateSetting } = useChatSettings();
    const { deleteChat, loading } = useDeleteChat();
    const modalRef = useRef();

    const currentSettings = settings[selectedConversation._id] || { background: "default", bubbleStyle: "modern" };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

    const backgrounds = [
        { id: "default", name: "Original", class: "bg-gray-900" },
        { id: "galaxy", name: "Galaxia", class: "bg-gradient-to-br from-indigo-900 via-purple-900 to-black" },
        { id: "sunset", name: "Atardecer", class: "bg-gradient-to-br from-orange-900 via-red-900 to-black" },
        { id: "forest", name: "Bosque", class: "bg-gradient-to-br from-green-900 to-black" },
        { id: "love", name: "Amor", class: "bg-gradient-to-br from-pink-900 to-black" },
    ];

    const styles = [
        { id: "modern", name: "Moderno" },
        { id: "comic", name: "Cómic" },
        { id: "cloud", name: "Nube" },
    ];

    return (
        <div className="absolute top-16 right-4 z-50 animate-in fade-in zoom-in-95 origin-top-right">
            <div ref={modalRef} className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 p-4 rounded-2xl shadow-2xl w-72 text-gray-200">
                <h3 className="font-bold mb-3 text-lg">Personalizar Chat</h3>

                {/* FONDOS */}
                <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-2 uppercase tracking-wider font-bold">Fondo</p>
                    <div className="grid grid-cols-3 gap-2">
                        {backgrounds.map((bg) => (
                            <button
                                key={bg.id}
                                onClick={() => updateSetting(selectedConversation._id, "background", bg.id)}
                                className={`h-12 rounded-lg border-2 transition ${bg.class} ${currentSettings.background === bg.id ? "border-green-500 scale-105 shadow-green-500/20 shadow-lg" : "border-transparent hover:scale-105"}`}
                            />
                        ))}
                    </div>
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
