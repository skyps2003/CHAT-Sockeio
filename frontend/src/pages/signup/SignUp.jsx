import { Link } from "react-router-dom";
import { useState } from "react";
import { User, AtSign, Lock } from "lucide-react";
import GenderCheckbox from "./GenderCheckbox";
import useSignup from "../../hooks/useSignup";

const SignUp = () => {
	const [inputs, setInputs] = useState({
		fullName: "",
		username: "",
		password: "",
		confirmPassword: "",
		gender: "",
	});

	const { loading, signup } = useSignup();

	// Esta función recibe el string "masculino" o "femenino" desde el hijo
	const handleCheckboxChange = (gender) => {
		setInputs({ ...inputs, gender });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await signup(inputs);
	};

	return (
		<div className="flex flex-col items-center justify-center min-w-96 mx-auto">
			<div className="w-full p-6 rounded-2xl bg-[#020617]/80 backdrop-blur-xl border border-green-500/20 shadow-2xl">

				<h1 className="text-3xl font-bold text-center text-white mb-5">
					Crear cuenta <span className="text-green-400">CHATIX</span>
				</h1>

				<form onSubmit={handleSubmit} className="space-y-4">

					{/* Inputs de texto (Nombre, Usuario, Passwords) ... */}
					{/* (Mantén tus inputs tal cual los tenías arriba, estaban bien) */}

					<div>
						<label className="block text-sm text-gray-300 mb-1">Nombre completo</label>
						<div className="relative group">
							<User className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Jose Luis"
								className="w-full pl-10 input input-bordered h-11 rounded-xl bg-white/5 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all"
								value={inputs.fullName}
								onChange={(e) => setInputs({ ...inputs, fullName: e.target.value })}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm text-gray-300 mb-1">Usuario</label>
						<div className="relative">
							<AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
							<input
								type="text"
								placeholder="jose123"
								className="w-full pl-10 input input-bordered h-11 rounded-xl bg-white/5 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all"
								value={inputs.username}
								onChange={(e) => setInputs({ ...inputs, username: e.target.value })}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm text-gray-300 mb-1">Contraseña</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
							<input
								type="password"
								placeholder="••••••••"
								className="w-full pl-10 input input-bordered h-11 rounded-xl bg-white/5 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all"
								value={inputs.password}
								onChange={(e) => setInputs({ ...inputs, password: e.target.value })}
							/>
						</div>
					</div>

					<div>
						<label className="block text-sm text-gray-300 mb-1">Confirmar contraseña</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
							<input
								type="password"
								placeholder="••••••••"
								className="w-full pl-10 input input-bordered h-11 rounded-xl bg-white/5 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none transition-all"
								value={inputs.confirmPassword}
								onChange={(e) => setInputs({ ...inputs, confirmPassword: e.target.value })}
							/>
						</div>
					</div>

					{/* SELECTOR DE GÉNERO MEJORADO */}
					<div>
						<label className="block text-sm text-gray-300 mb-2 text-center">Selecciona tu género</label>
						<GenderCheckbox
							selectedGender={inputs.gender}
							onCheckboxChange={handleCheckboxChange}
						/>
					</div>


					<Link to="/login" className="block text-sm text-center text-gray-400 hover:text-green-400 hover:underline transition-colors">
						¿Ya tienes una cuenta? Inicia sesión
					</Link>

					<button
						type="submit"
						disabled={loading}
						className="w-full btn h-12 rounded-xl bg-green-500 hover:bg-green-400 text-black font-extrabold border-none shadow-[0_0_20px_rgba(34,197,94,0.4)] hover:shadow-[0_0_30px_rgba(34,197,94,0.6)] transition-all"
					>
						{loading ? <span className="loading loading-spinner"></span> : "REGISTRARSE"}
					</button>

				</form>
			</div>
		</div>
	);
};

export default SignUp;