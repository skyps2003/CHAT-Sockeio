import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext";

const useUpdateProfile = () => {
    const [loading, setLoading] = useState(false);
    const { setAuthUser } = useAuthContext();

    const updateProfile = async ({ fullName, username, password, profilePic }) => {
        setLoading(true);
        try {
            const res = await fetch("/api/users/update", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, username, password, profilePic }),
            });

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
