import { createContext, useState, useRef, useEffect, useContext } from "react";
import { useSocketContext } from "./SocketContext";
import { useAuthContext } from "./AuthContext";
import Peer from "peerjs";

const CallContext = createContext();

export const useCallContext = () => useContext(CallContext);

export const CallContextProvider = ({ children }) => {
    const { socket } = useSocketContext();
    const { authUser } = useAuthContext();

    const [stream, setStream] = useState(null);
    const [call, setCall] = useState({}); // Info de la llamada entrante
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [myPeerId, setMyPeerId] = useState("");
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const [isAudioEnabled, setIsAudioEnabled] = useState(true);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();
    const peerInstance = useRef();

    useEffect(() => {
        if (!authUser) return;

        // 1. Inicializar PeerJS (Usamos el servidor cloud gratuito de PeerJS)
        const peer = new Peer(authUser._id); // Usamos el ID de usuario como PeerID para facilitar
        peerInstance.current = peer;

        peer.on("open", (id) => {
            setMyPeerId(id);
        });

        // 2. Escuchar llamadas entrantes vía PeerJS (Data Stream)
        peer.on("call", (incomingCall) => {
            // Recibimos la llamada, pero esperamos a que el usuario conteste para responder con el stream
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) myVideo.current.srcObject = currentStream;

                // Guardamos la referencia de la llamada de Peer
                connectionRef.current = incomingCall;

                incomingCall.on("stream", (userVideoStream) => {
                    if (userVideo.current) userVideo.current.srcObject = userVideoStream;
                });
            });
        });

        // 3. Escuchar notificación del Socket (UI)
        socket?.on("callUser", ({ from, name: callerName, signal }) => {
            setCall({ isReceivingCall: true, from, name: callerName, signal });
        });

        socket?.on("endCall", () => {
            leaveCall();
        });

        return () => {
            socket?.off("callUser");
            socket?.off("endCall");
        };

    }, [socket, authUser]);

    const answerCall = () => {
        setCallAccepted(true);

        // Ya tenemos el stream del useEffect (o lo pedimos aquí si es necesario)
        if (!stream) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
                setStream(currentStream);
                if (myVideo.current) myVideo.current.srcObject = currentStream;

                // Responder a la llamada de PeerJS
                const incomingCall = connectionRef.current; // Ojo: esto viene del evento 'call' de peer
                if (connectionRef.current) {
                    connectionRef.current.answer(currentStream);
                } else {
                    // Fallback si la referencia se perdió (raro si usamos peerId estático)
                    // En flujo real complejo, aquí se usaría el 'signal' (peerId del llamante)
                    const call = peerInstance.current.call(call.signal, currentStream);
                    call.on("stream", (userVideoStream) => {
                        if (userVideo.current) userVideo.current.srcObject = userVideoStream;
                    });
                    connectionRef.current = call;
                }
            });
        } else {
            // Si ya tenemos stream
            if (connectionRef.current) connectionRef.current.answer(stream);
        }
    };

    const callUser = (id) => {
        // id = ID de base de datos del usuario a llamar
        navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((currentStream) => {
            setStream(currentStream);
            if (myVideo.current) myVideo.current.srcObject = currentStream;

            // Iniciar llamada PeerJS
            if (!peerInstance.current) {
                console.error("PeerJS no está inicializado");
                return;
            }

            const call = peerInstance.current.call(id, currentStream);

            if (call) {
                call.on("stream", (userVideoStream) => {
                    if (userVideo.current) userVideo.current.srcObject = userVideoStream;
                });
                connectionRef.current = call;
            } else {
                console.error("Error al iniciar llamada (call es null)");
            }

            // Avisar por Socket para mostrar la UI al otro usuario
            socket.emit("callUser", {
                userToCall: id,
                signalData: myPeerId, // Mi ID de Peer
                from: authUser._id,
                name: authUser.fullName,
            });
        });
    };

    const leaveCall = () => {
        setCallEnded(true);
        if (connectionRef.current) connectionRef.current.close();
        if (stream) stream.getTracks().forEach(track => track.stop());

        // Avisar al otro que corté
        if (callAccepted && !callEnded) {
            const otherUser = call.isReceivingCall ? call.from : call.userToCall;
            // Nota: En un caso real necesitamos guardar el ID del otro mejor
            // Simplificación: Recargar la página o limpiar estados
        }

        setStream(null);
        setCallAccepted(false);
        setCall({});
        // window.location.reload(); // Forma brusca de limpiar todo (opcional)
    };

    const toggleVideo = () => {
        if (stream) {
            stream.getVideoTracks()[0].enabled = !isVideoEnabled;
            setIsVideoEnabled(!isVideoEnabled);
        }
    };

    const toggleAudio = () => {
        if (stream) {
            stream.getAudioTracks()[0].enabled = !isAudioEnabled;
            setIsAudioEnabled(!isAudioEnabled);
        }
    }

    return (
        <CallContext.Provider
            value={{
                call,
                callAccepted,
                myVideo,
                userVideo,
                stream,
                name: authUser?.fullName,
                callEnded,
                myPeerId,
                callUser,
                answerCall,
                leaveCall,
                isVideoEnabled, toggleVideo,
                isAudioEnabled, toggleAudio
            }}
        >
            {children}
        </CallContext.Provider>
    );
};