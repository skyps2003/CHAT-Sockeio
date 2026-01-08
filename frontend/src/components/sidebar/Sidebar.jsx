import { useState } from "react";
import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import ProfileSettings from "./ProfileSettings"; // ✅ Importar
import { BsGear } from "react-icons/bs";
import { useAuthContext } from "../../context/AuthContext"; // ✅ Contexto

const Sidebar = () => {
    const [showProfile, setShowProfile] = useState(false);
    const { authUser } = useAuthContext(); // ✅ Hook

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
            <div className="px-2 mb-2 flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                <span>Chats</span>

                {/* ✅ Avatar del usuario actual como botón de ajustes */}
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

            {/* Lista de chats */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                <Conversations />
            </div>

            {/* Logout */}
            <LogoutButton />

            {/* ✅ MODAL DE PERFIL */}
            {showProfile && <ProfileSettings onClose={() => setShowProfile(false)} />}
        </div>
    );
};

export default Sidebar;