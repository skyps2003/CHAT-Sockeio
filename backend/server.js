import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors"; // ✅ 1. IMPORTAR CORS

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4200;
const __dirname = path.resolve();

// ✅ 2. CONFIGURAR CORS (JUSTO AQUÍ, ANTES DE LAS RUTAS)
app.use(cors({
    origin: [
        "http://localhost:3000",  // Para tu desarrollo local
        "https://ambitious-beach-07ae23d10.2.azurestaticapps.net" // ✅ TU URL DE AZURE
    ],
    credentials: true // Permite envío de cookies/headers
}));

app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// Para servir imágenes estáticas
app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));

// Archivos estáticos del frontend (Opcional, si sirvieras el front desde aquí, pero ahora usas Azure)
// app.use(express.static(path.join(__dirname, "/frontend/dist")));

// server.get("*", (req, res) => {
// 	res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
// });

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});