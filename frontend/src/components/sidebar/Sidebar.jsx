import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";

const Sidebar = () => {
    return (
        <div
            className="
            w-80 h-full flex flex-col
            p-4 
            bg-[#020617]/80 backdrop-blur-xl /* Negro Carbón con transparencia */
            border-r border-[#22C55E]/30    /* Borde Verde Neón sutil */
            "
        >
            {/* Search */}
            <div className="mb-4">
                <SearchInput />
            </div>

            {/* Título de sección opcional o separador */}
            <div className="px-2 mb-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Chats
            </div>

            {/* Lista de chats */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <Conversations />
            </div>

            {/* Logout (Ahora tiene su propio contenedor y diseño en el componente) */}
            <LogoutButton />
        </div>
    );
};

export default Sidebar;