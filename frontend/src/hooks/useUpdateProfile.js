import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();
    const BACKEND_URL = import.meta.env.MODE === "development"
        ? "http://localhost:5000"
        : "https://chat-sockeio-1.onrender.com"

    const updateProfile = async ({ fullName, username, password, profilePic }) => {
        setLoading(true);
        try {
            let res;

            // ✅ LÓGICA: Si profilePic es un ARCHIVO (File Object), usamos FormData
            // Si es un string (URL de avatar predefinido) o undefined, usamos JSON
            if (profilePic && typeof profilePic !== "string") {
                const formData = new FormData();
                formData.append("fullName", fullName);
                formData.append("username", username);
                if (password) formData.append("password", password);
                formData.append("profilePic", profilePic); // Aquí va el archivo

                res = await fetch(`${BACKEND_URL}/api/users/update`, {
                    method: "PUT",
                    credentials: "include",
                    body: formData, // FormData no lleva header Content-Type manual (el navegador lo pone)
                });
            } else {
                // Modo Clásico (JSON) para avatars predefinidos
                const payload = { fullName, username, password };
                if (profilePic) payload.profilePic = profilePic;

                res = await fetch(`${BACKEND_URL}/api/users/update`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify(payload),
                });
            }

            const data = await res.json();
            if (data.error) {
                throw new Error(data.error);
            }

            // Actualizar contexto y localstorage
            setAuthUser(data);
            localStorage.setItem("chat-user", JSON.stringify(data));
            toast.success("Perfil actualizado");
            return true;
        } catch (error) {
            toast.error(error.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { loading, updateProfile };
};

export default useUpdateProfile;
