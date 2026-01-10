import { useCallContext } from "../../context/CallContext";
import { BsCameraVideo, BsCameraVideoOff, BsMic, BsMicMute, BsTelephoneX } from "react-icons/bs";
import { MdCallEnd, MdCall } from "react-icons/md";

const CallInterface = () => {
    const {
        call, callAccepted, myVideo, userVideo, stream,
        answerCall, leaveCall, callEnded,
        isVideoEnabled, toggleVideo,
        isAudioEnabled, toggleAudio
    } = useCallContext();

    // 1. Mostrar Modal de Llamada Entrante
    if (call.isReceivingCall && !callAccepted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-gray-900/90 border border-green-500/30 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 w-80 animate-bounce-in">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-green-400 to-blue-500 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-green-500/50">
                            {call.name?.charAt(0)}
                        </div>
                        <span className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full animate-pulse">
                            <MdCall size={20} />
                        </span>
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">{call.name}</h3>
                        <p className="text-green-400 text-sm animate-pulse">Llamada entrante...</p>
                    </div>
                    <div className="flex gap-4 w-full justify-center">
                        <button
                            onClick={answerCall}
                            className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-500/40 transition transform hover:scale-110"
                        >
                            <MdCall size={28} />
                        </button>
                        <button
                            onClick={leaveCall}
                            className="bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg shadow-red-500/40 transition transform hover:scale-110"
                        >
                            <BsTelephoneX size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Mostrar Interfaz de Llamada Activa
    if (callAccepted && !callEnded) {
        return (
            <div className="fixed inset-0 z-50 bg-black flex flex-col">
                {/* Video Remoto (Pantalla Completa) */}
                <div className="relative flex-1 bg-gray-900 flex items-center justify-center overflow-hidden">

                    {/* VIDEO REMOTO o AVATAR */}
                    {(isVideoEnabled && (call.callType === "video" || !call.callType)) ? (
                        <video
                            playsInline
                            ref={userVideo}
                            autoPlay
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center gap-6 animate-pulse">
                            <div className="w-40 h-40 rounded-full border-4 border-green-500 shadow-2xl shadow-green-500/50 p-1">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${call.name}&background=random&color=fff&size=256`}
                                    alt="avatar"
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                            <p className="text-gray-400 text-lg tracking-widest uppercase">Llamada de voz</p>
                        </div>
                    )}

                    {/* Mi Video (PiP) - Solo si yo tengo video habilitado */}
                    {isVideoEnabled && (
                        <div className="absolute top-4 right-4 w-32 h-48 md:w-48 md:h-72 bg-black rounded-xl overflow-hidden shadow-2xl border border-white/20">
                            <video
                                playsInline
                                muted
                                ref={myVideo}
                                autoPlay
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                        </div>
                    )}

                    {/* Nombre del Usuario (Overlay) */}
                    <div className="absolute top-8 left-8 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                        <span className="text-white font-semibold flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                            {call.name || "Usuario"}
                        </span>
                    </div>
                </div>

                {/* Controles (Barra Inferior) */}
                <div className="h-24 bg-gray-900/80 backdrop-blur-xl flex items-center justify-center gap-6 pb-6">
                    <button
                        onClick={toggleAudio}
                        className={`p-4 rounded-full text-white transition ${isAudioEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                        {isAudioEnabled ? <BsMic size={24} /> : <BsMicMute size={24} />}
                    </button>

                    <button
                        onClick={leaveCall}
                        className="bg-red-600 hover:bg-red-700 text-white p-5 rounded-full shadow-lg shadow-red-600/40 transform hover:scale-105 transition"
                    >
                        <MdCallEnd size={32} />
                    </button>

                    <button
                        onClick={toggleVideo}
                        className={`p-4 rounded-full text-white transition ${isVideoEnabled ? "bg-gray-700 hover:bg-gray-600" : "bg-red-500 hover:bg-red-600"}`}
                    >
                        {isVideoEnabled ? <BsCameraVideo size={24} /> : <BsCameraVideoOff size={24} />}
                    </button>
                </div>
            </div>
        );
    }

    // 3. Estado de "Llamando..." (Opcional, si queremos mostrar feedback visual antes de que contesten)
    if (stream && !callAccepted && !callEnded) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md">
                <div className="flex flex-col items-center gap-8">
                    <div className="w-32 h-32 rounded-full border-4 border-green-500 p-1 animate-pulse">
                        <img src="https://avatar.iran.liara.run/public" alt="calling" className="w-full h-full rounded-full object-cover opacity-80" />
                    </div>
                    <h2 className="text-2xl text-white font-light tracking-wider">Llamando...</h2>

                    <button
                        onClick={leaveCall}
                        className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-xl transition"
                    >
                        <MdCallEnd size={32} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default CallInterface;
