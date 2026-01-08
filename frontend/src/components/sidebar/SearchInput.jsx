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
        <form onSubmit={handleSubmit} className="flex items-center gap-2 px-2 w-full">
            <div className="relative flex-1 group">
                {/* Ícono (Ahora cambia de color al hacer focus en el input) */}
                <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors cursor-pointer z-10">
                    <IoSearchSharp className="w-5 h-5" />
                </button>

                {/* Input Estilizado */}
                <input
                    type="text"
                    placeholder="Buscar chat..."
                    className="
                        w-full pl-10 pr-4 py-2 
                        rounded-full
                        bg-white/5 
                        border border-white/10
                        text-gray-200 
                        placeholder-gray-500
                        
                        focus:outline-none 
                        focus:border-green-600/50 
                        focus:bg-black/40
                        focus:text-white
                        
                        transition-all duration-300 ease-in-out
                        shadow-sm
                    "
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
        </form>
    );
};

export default SearchInput;