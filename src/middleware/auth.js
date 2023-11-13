import User from "../models/UserModel.js"
import jwt from "jsonwebtoken"
import AuthError from "../errors/AuthError.js"
import "dotenv/config"
import asyncWrapper from "../middleware/async.js"
import FirebaseWrapper from "../helpers/FirebaseWrapper.js"

const userModel = new User()
const auth = asyncWrapper(async (req, res, next) => {
	if(!req.cookies[process.env.AUTH_COOKIE_NAME]){
		throw new AuthError("Unauthorized", 403)
	}
	const { token, role } = jwt.verify(req.cookies[process.env.AUTH_COOKIE_NAME], process.env.JWT_SECRET)
	const firebase = new FirebaseWrapper
	const firebaseData = await firebase.verifyToken(token)
	req.user = await userModel.findOne({
		where: { firebase_id: firebaseData.id },
	})
	if (req.user == null) {
		throw new AuthError("Unauthorized", 403)
	}
	return next()
})

export default auth