import { Link } from "react-router-dom";
import { AtSign, Lock } from "lucide-react";
import { useState } from "react";
import useLogin from "../../hooks/useLogin";

const Login = () => {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");

	const { loading, login } = useLogin();

	const handleSubmit = async (e) => {
		e.preventDefault();
		await login(username, password);
	};

	return (
		<div className="w-full max-w-md">
			<div className="p-8 rounded-2xl bg-[#020617]/80 backdrop-blur-xl border border-green-500/20 shadow-2xl transition-all duration-300 hover:shadow-green-500/30">

				<h1 className="text-3xl font-bold text-center text-white">
					Bienvenido a <span className="text-green-400">CHATIX</span>
				</h1>
				<p className="text-center text-gray-400 text-sm mt-2">
					Conecta. Chatea. Al instante.
				</p>

				<form onSubmit={handleSubmit} className="mt-6 space-y-5">

					{/* Usuario */}
					<div>
						<label className="block text-sm text-gray-300 mb-1">
							Usuario
						</label>
						<div className="relative">
							<AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
							<input
								type="text"
								placeholder="Tu nombre de usuario"
								className="w-full pl-10 input input-bordered h-11 rounded-xl bg-white/5 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</div>
					</div>

					{/* Contraseña */}
					<div>
						<label className="block text-sm text-gray-300 mb-1">
							Contraseña
						</label>
						<div className="relative">
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 w-5 h-5" />
							<input
								type="password"
								placeholder="••••••••"
								className="w-full pl-10 input input-bordered h-11 rounded-xl bg-white/5 border-green-500/30 text-white placeholder-gray-400 focus:border-green-400 focus:outline-none"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</div>
					</div>

					{/* Botón */}
					<button
						type="submit"
						disabled={loading}
						className="btn w-full h-11 rounded-xl bg-green-500 hover:bg-green-400 text-black font-bold tracking-wide transition-transform duration-200 hover:scale-[1.02]"
					>
						{loading ? (
							<span className="loading loading-spinner"></span>
						) : (
							"Iniciar sesión"
						)}
					</button>

					<p className="text-center text-sm text-gray-400">
						¿No tienes una cuenta?{" "}
						<Link
							to="/signup"
							className="text-green-400 hover:text-green-300 hover:underline"
						>
							Regístrate
						</Link>
					</p>

				</form>
			</div>
		</div>
	);
};

export default Login;
