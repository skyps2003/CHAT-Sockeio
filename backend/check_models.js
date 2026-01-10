import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function listModels() {
    try {
        console.log("Checking available models...");
        // For v1beta (default)
        // Note: The SDK doesn't expose listModels directly on the main class in all versions, 
        // but let's try assuming standard usage or fetching via invalid model error which implies list functionality isn't always direct.
        // Actually, we can use the model to get metadata or just try a standard known list.
        // Since ListModels is a separate API call, we might rely on the error or try a different approach if SDK lacks it.

        // Wait, the SDK DOES usually have it via ModelManager or similar, but simplified:
        // Let's try to just hit the API endpoint using fetch if the SDK is obscure.

        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("No API Key found");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            console.log("✅ Models available:");
            data.models.forEach(m => {
                if (m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        } else {
            console.log("❌ No models found or error:", data);
        }

    } catch (error) {
        console.error("Error listing models:", error);
    }
}

listModels();
