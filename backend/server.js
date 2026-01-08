import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const PORT = process.env.PORT || 4200;
const __dirname = path.resolve();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Rutas de autenticación
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

// ✅ NUEVO: Hacer pública la carpeta de uploads para acceder a las imágenes
app.use("/uploads", express.static(path.join(__dirname, "backend/uploads")));

// (Opcional) Servir frontend estático si estás en producción
app.use(express.static(path.join(__dirname, "/frontend/dist")));

// Opción A (Recomendada): Usar Expresión Regular para "todo lo demás"
app.get(/.*/, (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
    connectToMongoDB();
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});