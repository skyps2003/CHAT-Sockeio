import express from "express";
import multer from "multer";
import fs from "fs"; // ✅ IMPORTAR FS
import {
    getMessages,
    sendMessage,
    editMessage,
    deleteMessage,
    deleteChat
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "backend/uploads/";
        // ✅ VERIFICAR SI EXISTE LA CARPETA, SI NO, CREARLA
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        }
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});

const upload = multer({ storage: storage });

router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, upload.single("file"), sendMessage);

// ✅ NUEVAS RUTAS
router.put("/edit/:id", protectRoute, editMessage);
router.delete("/delete/:id", protectRoute, deleteMessage);
router.delete("/delete_chat/:id", protectRoute, deleteChat); // ✅ Nueva ruta vaciar chat

export default router;