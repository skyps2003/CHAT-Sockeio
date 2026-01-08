import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import { useAuthContext } from "./context/AuthContext";
import { CallContextProvider } from "./context/CallContext"; // ✅ IMPORTAR
import VideoCallUI from "./components/calls/VideoCallUI";   // ✅ IMPORTAR

function App() {
	const { authUser } = useAuthContext();
	return (
		// El CallProvider debe estar DENTRO del SocketProvider (que está en index.js probablemente)
		// Si tu SocketProvider envuelve a App en main.jsx, esto funcionará.
		<CallContextProvider>
			{/* UI Global de Llamadas */}
			<VideoCallUI />

			<div className='p-4 h-screen flex items-center justify-center'>
				<Routes>
					<Route path='/' element={authUser ? <Home /> : <Navigate to={"/login"} />} />
					<Route path='/login' element={authUser ? <Navigate to='/' /> : <Login />} />
					<Route path='/signup' element={authUser ? <Navigate to='/' /> : <SignUp />} />
				</Routes>
				<Toaster />
			</div>
		</CallContextProvider>
	);
}

export default App;