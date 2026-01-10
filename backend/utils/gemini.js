import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Inicialización del cliente con la API Key de entorno
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Obtiene una respuesta de la IA manejando el contexto del chat.
 * @param {string} userMessage - El mensaje enviado por el usuario.
 * @param {Array} history - Array de objetos de mensaje de la base de datos.
 */
export const getGeminiResponse = async (userMessage, history = []) => {
    try {
        // Selección del modelo: "gemini-1.5-flash" es ideal para chats rápidos y ligeros.
        // Importante: No uses el prefijo "models/" aquí para evitar el error 404 en el SDK.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Transformación del historial al esquema requerido por Google SDK:
        // El SDK espera: { role: "user" | "model", parts: [{ text: "..." }] }
        const chatHistory = history.map(msg => ({
            role: msg.senderUsername === "gemini_ai" ? "model" : "user",
            parts: [{ text: msg.message || "" }]
        }));

        // Verificación de integridad: Gemini falla si el último mensaje del historial es del "user"
        // y luego intentas enviar otro mensaje de "user" mediante sendMessage. 
        // startChat prepara la sesión con los mensajes previos.
        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7, // Controla la aleatoriedad (0.0 más preciso, 1.0 más creativo)
            },
        });

        // Envío del mensaje actual
        const result = await chat.sendMessage(userMessage);
        const response = await result.response;

        // Retornamos el texto generado por la IA
        return response.text();

    } catch (error) {
        // Log detallado para desarrollo en Sistemas Distribuidos
        console.error("--- Error en Gemini API ---");
        console.error("Status Code / Message:", error.message);

        // Estructura de respuesta de error amigable para el frontend
        if (error.message.includes("404")) {
            return "Error 404: El modelo no fue encontrado. Revisa la versión del SDK '@google/generative-ai'.";
        }
        if (error.message.includes("429")) {
            return "Error 429: Cuota excedida. Demasiadas solicitudes en poco tiempo.";
        }

        return `Error de IA: ${error.message || "Error desconocido"}.`;
    }
};