import db from "../models/index.js";
import admin from "firebase-admin";
import jwt from "jsonwebtoken";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../config/firebase-service-account.json")

const auth = async (req, res, next) => {
	try {
		const decodedJWT = jwt.verify(req.cookies.user, process.env.JWT_SECRET)
		if (!admin.apps.length) {
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
				throw new Error("Unauthorized")
			}
			return next()
		}
		return res.status(403).json({ message: "Unauthorized" })
	} catch (e) {
		console.log(e)
		return res.status(403).json({ message: "Unauthorized" })
	}
};

export default auth