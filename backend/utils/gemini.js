import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Inicialización con la nueva clave "Sockeio"
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
    try {
        // AJUSTE: Usamos la configuración por defecto del SDK (v1beta) que sí soporta 1.5-flash
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Formateo de historial según la estructura 'contents'
        const chatHistory = history.map(msg => ({
            role: msg.senderUsername === "gemini_ai" ? "model" : "user",
            parts: [{ text: String(msg.message || "") }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        // Enviar mensaje actual
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;

        return response.text();

    } catch (error) {
        console.error("--- Error en Nodo Gemini ---");
        console.error("Mensaje de red:", error.message);

        // Si el 404 persiste con la clave nueva, el SDK está forzando v1beta
        // cuando tu clave nueva prefiere v1.
        return `Error de conexión: ${error.message}. Intenta reiniciar el servidor.`;
    }
};