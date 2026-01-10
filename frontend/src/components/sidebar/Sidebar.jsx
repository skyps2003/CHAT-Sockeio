import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileSettings from "./ProfileSettings"; // ✅ Importar
import { BsGear } from "react-icons/bs";
import { useAuthContext } from "../../context/AuthContext"; // ✅ Contexto

const Sidebar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const [searchTerm, setSearchTerm] = useState(""); // ✅ Estado para búsqueda en tiempo real
    const { authUser } = useAuthContext();

    return (
        <div
            className="
            w-full md:w-80 h-full flex flex-col
            p-2 md:p-4 
            bg-[#020617]/80 backdrop-blur-xl
            border-r border-[#22C55E]/30
            "
        >
            {/* Search */}
            <div className="mb-4">
                <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            </div>

            {/* Título y Avatar */}
            <div className="px-2 mb-2 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Chats</span>

                <button
                    onClick={() => setShowProfile(true)}
                    className="flex items-center gap-2 hover:bg-white/5 p-1.5 rounded-lg transition group"
                    title="Configurar Perfil"
                >
                    <span className="text-[10px] font-semibold text-gray-300 group-hover:text-white transition max-w-[80px] truncate">
                        {authUser?.fullName}
                    </span>
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-transparent group-hover:border-green-500 transition">
                        <img src={authUser?.profilePic} alt="me" className="w-full h-full object-cover" />
                    </div>
                </button>
            </div>

            {/* Lista de chats filtrada */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <Conversations searchTerm={searchTerm} />
            </div>

            {/* Logout */}
            <LogoutButton />

            {/* Modal Perfil */}
            {showProfile && <ProfileSettings onClose={() => setShowProfile(false)} />}
        </div>
    );
};

export default Sidebar;