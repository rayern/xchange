import { getUserByFirebaseId } from "../models/UserModel.js";
import jwt from "jsonwebtoken";
import AuthError from "../errors/AuthError.js";
import "dotenv/config";
import asyncWrapper from "../middleware/async.js";
import FirebaseWrapper from "../helpers/FirebaseWrapper.js";
import config from "../config/appConfig.cjs";

const auth = asyncWrapper(async (req, res, next) => {
	try {
		let jwtToken = null
		const authHeader = req.headers["authorization"];
		if (authHeader) {
			let [bearer, authToken] = authHeader.split(" ");
			if (bearer !== "Bearer" || !authToken) {
				throw new AuthError("Unauthorized", 403);
			}
			jwtToken = authToken
		} else {
			if (req.cookies[config.cookie.name]) {
				jwtToken = req.cookies[config.cookie.name];
			}
		}
		const { token, role } = jwt.verify(
			jwtToken,
			process.env.JWT_SECRET
		);
		const firebase = new FirebaseWrapper();
		const firebaseData = await firebase.verifyToken(token);
		req.user = await getUserByFirebaseId(firebaseData.id);
	} catch (error) {
		throw new AuthError("Unauthorized", 403);
	}
	if (req.user == null) {
		throw new AuthError("Unauthorized", 403);
	}
	return next();
});

export default auth;
