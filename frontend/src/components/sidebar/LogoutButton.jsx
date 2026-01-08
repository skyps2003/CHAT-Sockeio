import { BiLogOut } from "react-icons/bi";
import useLogout from "../../hooks/useLogout";

const LogoutButton = () => {
    const { loading, logout } = useLogout();

    return (
        <div className="mt-auto pt-4 border-t border-gray-700/30">
            {/* Botón con efecto Neon Hover */}
            <button
                onClick={logout}
                disabled={loading}
                className="
                    group relative flex items-center gap-3 w-full p-3 
                    rounded-xl cursor-pointer overflow-hidden
                    bg-transparent text-white
                    border border-gray-700/50
                    hover:border-[#22C55E] hover:bg-[#22C55E]
                    hover:text-white
                    hover:shadow-[0_0_20px_rgba(34,197,94,0.4)]
                    transition-all duration-300 ease-out
                "
            >
                <div className="relative z-10 flex items-center gap-3 font-semibold">
                    {loading ? (
                        <span className="loading loading-spinner loading-sm text-[#22C55E] group-hover:text-[#020617]"></span>
                    ) : (
                        // El icono rota ligeramente al hacer hover
                        <BiLogOut size={22} className="transition-transform duration-300 group-hover:-translate-x-1" />
                    )}

                    <span className="tracking-wide">Cerrar Sesión</span>
                </div>
            </button>
        </div>
    );
};

export default LogoutButton;