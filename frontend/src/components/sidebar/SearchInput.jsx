import { IoSearchSharp } from "react-icons/io5";
import useConversation from "../../zustand/useConversation";
import useGetConversations from "../../hooks/useGetConversations";
import toast from "react-hot-toast";

const SearchInput = ({ searchTerm, setSearchTerm }) => {
    // const [search, setSearch] = useState(""); // ❌ Estado local removido
    // const { setSelectedConversation } = useConversation();
    // const { conversations } = useGetConversations();

    // --- FUNCIÓN DE BÚSQUEDA MEJORADA (Ignora tildes y mayúsculas) ---
    /* 
       NOTA: El filtrado ahora lo maneja "Sidebar -> Conversations" en tiempo real.
       Este componente solo actualiza el estado "searchTerm" del padre.
    */

    const handleSubmit = (e) => {
        e.preventDefault();
        // Opcional: Si el usuario da Enter, podríamos seleccionar el primero de la lista filtrada
        // Pero por ahora solo evitamos el reload.
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
                        value={searchTerm} // ✅ Usamos el estado del padre
                        onChange={(e) => setSearchTerm(e.target.value)} // ✅ Actualizamos padre
                    />

                    {/* ICON BUTTON */}
                    <button
                        type="submit"
                        className="absolute left-1 p-2 rounded-full text-gray-400 group-focus-within:text-white group-focus-within:bg-white/10 transition-all duration-300"
                    >
                        <IoSearchSharp className="w-5 h-5" />
                    </button>

                    {/* CLEAR BUTTON (Solo si hay texto) */}
                    {searchTerm && (
                        <button
                            type="button"
                            onClick={() => setSearchTerm("")}
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