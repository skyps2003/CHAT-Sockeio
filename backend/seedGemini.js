
import mongoose from "mongoose";
import User from "./models/user.model.js";
import dotenv from "dotenv";
import connectToMongoDB from "./db/connectToMongoDB.js";
import bcrypt from "bcryptjs";

dotenv.config();

const seedGemini = async () => {
    await connectToMongoDB();

    const geminiUsername = "gemini_ai";

    try {
        let aiUser = await User.findOne({ username: geminiUsername });

        if (!aiUser) {
            console.log("Creando usuario Gemini AI...");
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash("gemini_secret_password", salt);

            aiUser = new User({
                fullName: "Gemini AI",
                username: geminiUsername,
                password: hashedPassword,
                gender: "male", // Generic
                profilePic: "https://api.dicebear.com/9.x/bottts-neutral/svg?seed=Gemini",
            });

            await aiUser.save();
            console.log("✅ Usuario Gemini AI creado exitosamente.");
        } else {
            console.log("ℹ️ El usuario Gemini AI ya existe.");
        }

        console.log("USER ID:", aiUser._id.toString());
        process.exit(0);
    } catch (error) {
        console.error("Error al crear usuario Gemini:", error);
        process.exit(1);
    }
};

seedGemini();
