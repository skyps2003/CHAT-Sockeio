
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const getGeminiResponse = async (userMessage, history = []) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Convertir historial de chat al formato de Gemini
        // history espera: [{ role: "user" | "model", parts: [{ text: "..." }] }]
        const chatHistory = history.map(msg => ({
            role: msg.senderUsername === "gemini_ai" ? "model" : "user",
            parts: [{ text: msg.message }]
        }));

        const chat = model.startChat({
            history: chatHistory,
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        return response.text();

    } catch (error) {
        console.error("Error en Gemini API:", error);
        return "Lo siento, estoy teniendo problemas para procesar tu solicitud en este momento.";
    }
};
