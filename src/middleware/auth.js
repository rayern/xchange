import db from "../models/index.js";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { createCustomError } from "../errors/custom.js";
import dotenv from "dotenv";

dotenv.config();
const auth = async (req, res, next) => {
	try {
		const decodedJWT = jwt.verify(req.cookies.user, process.env.JWT_SECRET)
		if (!admin.apps.length) {
			const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
			admin.initializeApp({
				credential: admin.credential.cert(serviceAccount),
			});
		}
		const { token, role } = decodedJWT;
		const decodeValue = await admin.auth().verifyIdToken(token)
		if (decodeValue) {
			req.user = await db.user.findOne({
				where: { firebase_id: decodeValue.user_id },
			});
			if (req.user == null) {
				createCustomError("Unauthorized", 400)
			}
			return next()
		}
		return res.status(403).json({ success: false, message: "Unauthorized" })
	} catch (e) {
		console.log(e)
		return res.status(403).json({ success: false, message: "Unauthorized" })
	}
};

export default auth