import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

async function listModels() {
    try {
        console.log("Checking available models...");
        const key = process.env.GEMINI_API_KEY;
        if (!key) throw new Error("No API Key found");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
        const data = await response.json();

        if (data.models) {
            const modelNames = data.models
                .filter(m => m.supportedGenerationMethods.includes("generateContent"))
                .map(m => m.name)
                .join("\n");

            fs.writeFileSync("models_fs.txt", modelNames);
            console.log("Models written to models_fs.txt");
        } else {
            fs.writeFileSync("models_fs.txt", "NO_MODELS_FOUND: " + JSON.stringify(data));
            console.log("No models found.");
        }

    } catch (error) {
        console.error("Error listing models:", error);
        fs.writeFileSync("models_fs.txt", "ERROR: " + error.message);
    }
}

listModels();
