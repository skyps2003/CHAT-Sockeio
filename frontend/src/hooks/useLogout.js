import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const useLogout = () => {
	const [loading, setLoading] = useState(false);
	const { setAuthUser } = useAuthContext();
	const BACKEND_URL = import.meta.env.MODE === "development"
	? "http://localhost:5000"
	: "https://chat-sockeio-1.onrender.com"

	const logout = async () => {
		setLoading(true);
		try {
			const res = await fetch(`${BACKEND_URL}/api/auth/logout`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // ✅ AGREGA ESTA LÍNEA (¡Vital!)
			});
			const data = await res.json();
			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.removeItem("chat-user");
			setAuthUser(null);
		} catch (error) {
			toast.error(error.message);
		} finally {
			setLoading(false);
		}
	};

	return { loading, logout };
};
export default useLogout;