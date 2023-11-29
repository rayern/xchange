import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import AuthError from "../errors/AuthError.js";
import "dotenv/config";
import asyncWrapper from "../middleware/async.js";
import FirebaseWrapper from "../helpers/FirebaseWrapper.js";
import config from "../config/appConfig.cjs";

const userModel = new User();
const auth = asyncWrapper(async (req, res, next) => {
	if (!req.cookies[config.cookie.name]) {
		throw new AuthError("Unauthorized", 403);
	}
	try {
		const { token, role } = jwt.verify(
			req.cookies[config.cookie.name],
			process.env.JWT_SECRET
		);
		const firebase = new FirebaseWrapper();
		const firebaseData = await firebase.verifyToken(token);
		req.user = await userModel.getByFirebaseId(firebaseData.id);
	} catch (error) {
		console.log(error)
		throw new AuthError("Unauthorized", 403);
	}
	if (req.user == null) {
		throw new AuthError("Unauthorized", 403);
	}
	return next();
});

export default auth;
