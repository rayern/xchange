import User from "../models/User.js"
import jwt from "jsonwebtoken"
import AuthError from "../errors/AuthError.js"
import dotenv from "dotenv"
import asyncWrapper from "../middleware/async.js"
import FirebaseWrapper from "../helpers/FirebaseWrapper.js"

dotenv.config()
const auth = asyncWrapper(async (req, res, next) => {
	if(!req.cookies[process.env.AUTH_COOKIE_NAME]){
		throw new AuthError("Unauthorized", 403)
	}
	const { token, role } = jwt.verify(req.cookies[process.env.AUTH_COOKIE_NAME], process.env.JWT_SECRET)
	const firebase = new FirebaseWrapper
	const firebaseData = await firebase.verifyToken(token)
	req.user = await User.findOne({
		where: { firebase_id: firebaseData.id },
	})
	if (req.user == null) {
		throw new AuthError("Unauthorized", 403)
	}
	return next()
})

export default auth