import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = () => {
    const [search, setSearch] = useState("");
    const { setSelectedConversation } = useConversation();
    const { conversations } = useGetConversations();

    // --- FUNCIÓN DE BÚSQUEDA MEJORADA (Ignora tildes y mayúsculas) ---
    const normalizeText = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD") // Descompone caracteres (ej: á -> a + ´)
            .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos (tildes)
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!search) return;

        if (search.length < 3) {
            return toast.error("Escribe al menos 3 caracteres", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }

        const term = normalizeText(search);

        // Busca coincidencia flexible
        const conversation = conversations.find((c) =>
            normalizeText(c.fullName).includes(term)
        );

        if (conversation) {
            setSelectedConversation(conversation);
            setSearch(""); // Limpiar input tras encontrar
        } else {
            toast.error("Usuario no encontrado 🤷‍♂️", {
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative w-full px-4 mb-4">
            <div className="relative group">
                {/* 🌈 GLOW EFFECT (Fondo animado detrás) */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full opacity-0 group-focus-within:opacity-75 blur transition duration-500"></div>

                <div className="relative flex items-center bg-[#0f172a] rounded-full overflow-hidden border border-white/10 group-focus-within:border-transparent transition-all duration-300">

                    {/* INPUT */}
                    <input
                        type="text"
                        placeholder="Buscar conver..."
                        className="
                            w-full py-3 pl-12 pr-4
                            bg-transparent
                            text-white text-sm font-medium
                            placeholder-gray-500
                            focus:outline-none
                        "
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* ICON BUTTON */}
                    <button
                        type="submit"
                        className="absolute left-1 p-2 rounded-full text-gray-400 group-focus-within:text-white group-focus-within:bg-white/10 transition-all duration-300"
                    >
                        <IoSearchSharp className="w-5 h-5" />
                    </button>

                    {/* CLEAR BUTTON (Solo si hay texto) */}
                    {search && (
                        <button
                            type="button"
                            onClick={() => setSearch("")}
                            className="absolute right-3 text-gray-500 hover:text-white transition animate-in zoom-in"
                        >
                            ✕
                        </button>
                    )}
                </div>
            </div>
        </form>
    );
};

export default SearchInput;