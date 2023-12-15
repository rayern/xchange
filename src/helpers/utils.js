import FirebaseWrapper from "../helpers/FirebaseWrapper.js";
import config from "../config/appConfig.cjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { getUserByFirebaseId } from "../models/UserModel.js";

export const rtrim = (str, char) => {
	const regex = new RegExp(char + "+$");
	return str.replace(regex, "");
};

export const getLoggedInUser = async (req) => {
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
		const { token, role } = jwt.verify(jwtToken, process.env.JWT_SECRET);
		const firebase = new FirebaseWrapper();
		const firebaseData = await firebase.verifyToken(token);
		return await getUserByFirebaseId(firebaseData.id);
	} catch (error) {
		return null;
	}
};
