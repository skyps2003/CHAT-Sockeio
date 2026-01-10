import express from "express";
import multer from "multer";
import fs from "fs";
import protectRoute from "../middleware/protectRoute.js";
import { getUsersForSidebar, updateUser } from "../controllers/user.controller.js";

const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = "backend/uploads/";
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

router.get("/", protectRoute, getUsersForSidebar);
router.put("/update", protectRoute, upload.single("profilePic"), updateUser);

export default router;