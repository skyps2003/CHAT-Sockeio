import { useState } from "react";
import { useAuthContext } from "../../context/AuthContext";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import { BsX, BsPerson, BsKey, BsSave, BsCamera } from "react-icons/bs";

const ProfileSettings = ({ onClose }) => {
    const { authUser } = useAuthContext();
    const { updateProfile, loading } = useUpdateProfile();

    const [inputs, setInputs] = useState({
        fullName: authUser.fullName,
        username: authUser.username,
        password: "",
        confirmPassword: "",
        profilePic: authUser.profilePic,
    });

    // ✅ LÓGICA: Detectar si hubo cambios reales respecto a la data original
    const hasChanges =
        inputs.fullName !== authUser.fullName ||
        inputs.username !== authUser.username ||
        inputs.profilePic !== authUser.profilePic ||
        inputs.password.length > 0; // Si escribió algo en password, cuenta como cambio

    // ✅ LÓGICA: Validar contraseña solo si se escribió algo
    const passwordValid = !inputs.password || (inputs.password === inputs.confirmPassword);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación extra de seguridad
        if (!passwordValid) return;

        const payload = {
            fullName: inputs.fullName,
            username: inputs.username,
            profilePic: inputs.profilePic,
        };

        // 🔐 Solo enviar password si el usuario la escribió
        if (inputs.password) {
            payload.password = inputs.password;
        }

        const success = await updateProfile(payload);
        if (success) onClose();
    };

    const avatars = [
        "https://api.dicebear.com/9.x/micah/svg?seed=Felix",
        "https://api.dicebear.com/9.x/micah/svg?seed=Aneka",
        "https://api.dicebear.com/9.x/micah/svg?seed=Zoe",
        "https://api.dicebear.com/9.x/micah/svg?seed=Leo",
        "https://api.dicebear.com/9.x/micah/svg?seed=Willow",
        "https://api.dicebear.com/9.x/micah/svg?seed=Caleb",
        "https://api.dicebear.com/9.x/micah/svg?seed=Jasmine",
        "https://api.dicebear.com/9.x/micah/svg?seed=Oliver",
        "https://api.dicebear.com/9.x/micah/svg?seed=Nala",
        "https://api.dicebear.com/9.x/micah/svg?seed=Milo",
        "https://api.dicebear.com/9.x/micah/svg?seed=Daisy",
        "https://api.dicebear.com/9.x/micah/svg?seed=George",
    ];

    return (
        <div
            className="fixed inset-0 z-50 bg-black/60"
            onClick={(e) => e.target === e.currentTarget && onClose()}
        >
            {/* SIDEBAR */}
            <div className="
                absolute right-0 top-0
                w-80 h-full
                bg-[#020617]/95
                backdrop-blur-xl
                border-l border-[#22c55e]/30
                shadow-[0_0_40px_rgba(34,197,94,0.2)]
                animate-slideInRight
                flex flex-col
            ">
                {/* HEADER */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#22c55e]/20">
                    <h2 className="text-sm font-bold text-white flex items-center gap-2">
                        <BsPerson className="text-[#22c55e]" />
                        Perfil
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition"
                    >
                        <BsX size={20} />
                    </button>
                </div>

                {/* CONTENT */}
                <form
                    onSubmit={handleSubmit}
                    className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6"
                >
                    {/* AVATAR */}
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full border-4 border-[#22c55e] shadow-[0_0_25px_rgba(34,197,94,0.4)] overflow-hidden">
                                <img
                                    src={inputs.profilePic}
                                    alt="Avatar"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                <BsCamera className="text-white" />
                            </div>
                        </div>
                        <p className="text-white font-semibold">{authUser.fullName}</p>
                        <span className="text-xs text-[#22c55e]">@{authUser.username}</span>
                    </div>

                    {/* AVATARS */}
                    <div>
                        <p className="text-xs uppercase text-gray-400 font-bold mb-2">
                            Cambiar avatar
                        </p>
                        <div className="grid grid-cols-4 gap-2">
                            {avatars.map((url, i) => (
                                <button
                                    key={i}
                                    type="button"
                                    onClick={() => setInputs({ ...inputs, profilePic: url })}
                                    className={`w-12 h-12 rounded-full border-2 transition ${inputs.profilePic === url
                                        ? "border-[#22c55e] scale-110"
                                        : "border-transparent opacity-50 hover:opacity-100"
                                        }`}
                                >
                                    <img src={url} className="rounded-full object-cover" alt="avatar option" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* INFO */}
                    <div className="space-y-3">
                        <input
                            className="w-full h-11 px-3 rounded-xl bg-[#1e293b] border border-gray-700 text-white focus:border-[#22c55e] outline-none placeholder-gray-500"
                            value={inputs.fullName}
                            onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
                            placeholder="Nombre completo"
                        />
                        <input
                            className="w-full h-11 px-3 rounded-xl bg-[#1e293b] border border-gray-700 text-white focus:border-[#22c55e] outline-none placeholder-gray-500"
                            value={inputs.username}
                            onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
                            placeholder="Usuario"
                        />
                    </div>

                    {/* SECURITY (OPCIONAL) */}
                    <div className="p-3 rounded-xl bg-black/40 border border-gray-800 space-y-3">
                        <p className="text-xs font-bold text-gray-400 flex items-center gap-2">
                            <BsKey className="text-[#22c55e]" /> Seguridad (Opcional)
                        </p>
                        <input
                            type="password"
                            className="w-full h-10 px-3 rounded-lg bg-[#020617] border border-gray-700 text-white focus:border-[#22c55e] outline-none placeholder-gray-600"
                            placeholder="Nueva contraseña (opcional)"
                            value={inputs.password}
                            onChange={(e) =>
                                setInputs({ ...inputs, password: e.target.value })
                            }
                        />

                        {/* Solo mostramos confirmar si escribió algo en password */}
                        {inputs.password && (
                            <div className="animate-in fade-in slide-in-from-top-1">
                                <input
                                    type="password"
                                    className={`w-full h-10 px-3 rounded-lg bg-[#020617] border text-white outline-none placeholder-gray-600 ${inputs.password !== inputs.confirmPassword
                                            ? "border-red-500 focus:border-red-500"
                                            : "border-gray-700 focus:border-[#22c55e]"
                                        }`}
                                    placeholder="Confirmar contraseña"
                                    value={inputs.confirmPassword}
                                    onChange={(e) =>
                                        setInputs({
                                            ...inputs,
                                            confirmPassword: e.target.value,
                                        })
                                    }
                                />
                                {inputs.password !== inputs.confirmPassword && (
                                    <p className="text-[10px] text-red-400 mt-1 ml-1">Las contraseñas no coinciden</p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* ACTIONS */}
                    <div className="flex gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            // ⛔️ DESHABILITADO SI: Cargando O (No hay cambios Y la contraseña es válida)
                            disabled={loading || !hasChanges || !passwordValid}
                            className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#22c55e] to-[#16a34a] text-[#020617] font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(34,197,94,0.4)] transition duration-300"
                        >
                            {loading ? "Guardando..." : <><BsSave /> Guardar</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileSettings;