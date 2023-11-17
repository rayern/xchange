import express from "express";
import { uploadImage } from "../controllers/xchangeController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/upload", upload.single("image"), uploadImage);

export default router;
