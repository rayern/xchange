import express from "express";
import { uploadImage, saveAddress } from "../controllers/xchangeController.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.post("/upload", uploadImage);
router.post("/saveAddress", saveAddress)

export default router;
