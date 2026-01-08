import { useCallContext } from "../../context/CallContext";
import { BsMic, BsMicMute, BsCameraVideo, BsCameraVideoOff, BsTelephoneX, BsTelephoneFill } from "react-icons/bs";

const VideoCallUI = () => {
    const {
        call, callAccepted, myVideo, userVideo, stream,
        answerCall, leaveCall, callEnded,
        isVideoEnabled, toggleVideo, isAudioEnabled, toggleAudio
    } = useCallContext();

    // 1. Mostrar Modal de Llamada Entrante
    if (call.isReceivingCall && !callAccepted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
                <div className="bg-[#0b1220] border border-green-500/30 p-8 rounded-2xl shadow-2xl flex flex-col items-center gap-6 max-w-sm w-full">
                    <div className="w-20 h-20 rounded-full bg-green-900/30 flex items-center justify-center animate-pulse ring-2 ring-green-500">
                        <BsTelephoneFill size={32} className="text-green-400" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-bold text-white">{call.name}</h3>
                        <p className="text-gray-400 text-sm">te está llamando...</p>
                    </div>
                    <div className="flex gap-4 w-full justify-center">
                        <button onClick={leaveCall} className="btn bg-red-500/20 hover:bg-red-500 text-red-500 hover:text-white border-none rounded-full p-4">
                            <BsTelephoneX size={24} />
                        </button>
                        <button onClick={answerCall} className="btn bg-green-500 hover:bg-green-400 text-white border-none rounded-full p-4 animate-bounce">
                            <BsTelephoneFill size={24} />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // 2. Mostrar Interfaz de Videollamada Activa
    if (callAccepted && !callEnded) {
        return (
            <div className="fixed inset-0 z-50 bg-[#020617] flex flex-col">
                {/* VIDEO REMOTO (Pantalla completa) */}
                <div className="flex-1 relative overflow-hidden flex items-center justify-center">
                    <video
                        playsInline
                        ref={userVideo}
                        autoPlay
                        className="w-full h-full object-contain bg-black"
                    />

                    {/* VIDEO LOCAL (Picture in Picture) */}
                    <div className="absolute top-4 right-4 w-32 md:w-48 aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-2xl border border-white/10">
                        <video
                            playsInline
                            muted
                            ref={myVideo}
                            autoPlay
                            className="w-full h-full object-cover transform -scale-x-100"
                        />
                    </div>
                </div>

                {/* CONTROLES */}
                <div className="h-24 bg-black/40 backdrop-blur-xl flex items-center justify-center gap-6 pb-4">
                    <button onClick={toggleAudio} className={`p-4 rounded-full transition ${!isAudioEnabled ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                        {!isAudioEnabled ? <BsMicMute size={24} /> : <BsMic size={24} />}
                    </button>

                    <button onClick={leaveCall} className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transform hover:scale-110 transition shadow-lg shadow-red-600/30">
                        <BsTelephoneX size={32} />
                    </button>

                    <button onClick={toggleVideo} className={`p-4 rounded-full transition ${!isVideoEnabled ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'}`}>
                        {!isVideoEnabled ? <BsCameraVideoOff size={24} /> : <BsCameraVideo size={24} />}
                    </button>
                </div>
            </div>
        );
    }

    return null; // Si no hay llamada, no renderizar nada
};

export default VideoCallUI;