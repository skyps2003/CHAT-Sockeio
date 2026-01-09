import { useState } from "react";
import toast from "react-hot-toast";
import { useAuthContext } from "../context/AuthContext.jsx";

const useSignup = () => {
	const [loading, setLoading] = useState(false);
	const { authUser, setAuthUser } = useAuthContext();
	const BACKEND_URL = import.meta.env.MODE === "development"
	? "http://localhost:5000"
	: "https://chat-sockeio-1.onrender.com"

	const signup = async ({
		fullName,
		username,
		password,
		confirmPassword,
		gender
	}) => {
		const success = validarCampos({
			fullName,
			username,
			password,
			confirmPassword,
			gender
		});

		if (!success) return;

		setLoading(true);

		try {
			const res = await fetch(`${BACKEND_URL}/api/auth/signup`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include", // ✅ AGREGA ESTA LÍNEA (¡Vital!)
				body: JSON.stringify({
					fullName,
					username,
					password,
					confirmPassword,
					gender
				}),
			});

			const data = await res.json();

			if (data.error) {
				throw new Error(data.error);
			}

			localStorage.setItem("chat-user", JSON.stringify(data));

			toast.success("Usuario registrado exitosamente");
			setAuthUser(data);
		} catch (error) {
			toast.error(error.message || "Error al registrar usuario");
		} finally {
			setLoading(false);
		}
	};

	return { loading, signup };
};

export default useSignup;

/* ================= VALIDACIONES ================= */
function validarCampos({
	fullName,
	username,
	password,
	confirmPassword,
	gender
}) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Completa todos los campos");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Las contraseñas no coinciden");
		return false;
	}

	if (password.length < 6) {
		toast.error("La contraseña debe tener al menos 6 caracteres");
		return false;
	}

	return true;
}
