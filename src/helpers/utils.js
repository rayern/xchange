import FirebaseWrapper from "../helpers/FirebaseWrapper.js";
import config from "../config/appConfig.cjs";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { getUserByFirebaseId } from "../models/UserModel.js";

export const rtrim = (str, char)  => {
    const regex = new RegExp(char + '+$');
    return str.replace(regex, '');
}

export const getLoggedInUser = async (req) => {
    try {
		const { token, role } = jwt.verify(
			req.cookies[config.cookie.name],
			process.env.JWT_SECRET
		);
		const firebase = new FirebaseWrapper();
		const firebaseData = await firebase.verifyToken(token);
		return await getUserByFirebaseId(firebaseData.id);
	} catch (error) {
        return null
    }
}