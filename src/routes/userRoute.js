import express from "express";
import {
	signup,
	login,
	logout,
	validateCode,
	sendPasswordResetLink,
	resetPassword,
	getProfile,
	updateProfile,
	updateProfilePic,
	updateProfileAddress,
} from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.use(["/profile", "/logout"], authMiddleware);

router.post("/signup", signup);
router.post("/login", login);
router.post("/send-reset-password-link", sendPasswordResetLink);
router.post("/reset-password", resetPassword);
router.get("/validate-code/:code", validateCode);
router.get("/profile", getProfile);
router.post("/profile", updateProfile);

router.post("/profile/picture", updateProfilePic);
router.post("/profile/address", updateProfileAddress);
router.get("/logout", logout);

export default router;
