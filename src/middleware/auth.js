import User from "../models/User.js"
import admin from "firebase-admin"
import jwt from "jsonwebtoken"
import APIError from '../errors/apiError.js'
import dotenv from "dotenv"
import asyncWrapper from "../middleware/async.js"

dotenv.config()
const auth = asyncWrapper(async (req, res, next) => {
	if(!req.cookies.user){
		throw new APIError("Unauthorized", 403)
	}
	const decodedJWT = jwt.verify(req.cookies.user, process.env.JWT_SECRET)
	if (!admin.apps.length) {
		const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		})
	}
	const { token, role } = decodedJWT
	const decodeValue = await admin.auth().verifyIdToken(token)
	if (decodeValue) {
		req.user = await User.findOne({
			where: { firebase_id: decodeValue.user_id },
		})
		if (req.user == null) {
			throw new APIError("Unauthorized", 403)
		}
		return next()
	}
	throw new APIError("Unauthorized", 403)
})

export default auth