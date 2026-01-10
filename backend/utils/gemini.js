import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Inicializamos el cliente
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
    try {
        // CAMBIO CLAVE: Usamos la versión estable 'v1' explícitamente 
        // para saltar el error 404 de la v1beta
        const model = genAI.getGenerativeModel(
            { model: "gemini-1.5-flash" },
            { apiVersion: "v1" }
        );

        const chatHistory = history.map(msg => ({
            role: msg.senderUsername === "gemini_ai" ? "model" : "user",
            parts: [{ text: String(msg.message || "") }] // Forzamos String por seguridad
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("--- Error Detallado en Gemini ---");
        console.error("Tipo:", error.constructor.name);
        console.error("Mensaje:", error.message);

        // Si el 404 persiste, es un problema de la API KEY, no del código
        if (error.message.includes("404")) {
            return "Error de Configuración (404): La API Key no tiene acceso al modelo 1.5 Flash en esta región o proyecto.";
        }
        return `Error de IA: ${error.message}`;
    }
};