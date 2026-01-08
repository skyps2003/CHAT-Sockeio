import express from "express";
import multer from "multer";
import {
    getMessages,
    sendMessage,
    editMessage,   // ✅ IMPORTAR
    deleteMessage,  // ✅ IMPORTAR
    deleteChat      // ✅ IMPORTAR
} from "../controllers/message.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "backend/uploads/");
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