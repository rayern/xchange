import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PasswordReset from "../models/PasswordReset.js";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/APIError.js";
import AuthError from "../errors/AuthError.js";
import "dotenv/config";
import FirebaseWrapper from "../helpers/FirebaseWrapper.js";
import { sendEmail } from "../helpers/Emailer.js";
import { encrypt, decrypt } from "../helpers/Encryptor.js";

const firebase = new FirebaseWrapper();
const userModel = new User();
const passwordResetModel = new PasswordReset();
export const login = asyncWrapper(async (req, res) => {
	const { token } = req.body;
	const firebaseData = await firebase.verifyToken(token);
	const user = await userModel.findOne({
		where: { firebase_id: firebaseData.id },
	});
	if (user) {
		const jwtToken = jwt.sign(
			{ token: token, role: user.role_id },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRE,
			}
		);
		if (user.first_login === null) user.first_login = new Date();
		user.last_login = new Date();
		user.save()
		return res
			.cookie(process.env.AUTH_COOKIE_NAME, jwtToken, {
				expires: new Date(Date.now() + 25892000000),
				sameSite: "None",
				secure: true,
			})
			.status(200)
			.json({
				success: true,
				data: user,
				message: "User logged in successfully",
			});
	} else {
		throw new AuthError("User does not exists", 404);
	}
});

export const signup = asyncWrapper(async (req, res) => {
	const { firstName, lastName, role, token } = req.body;
	const firebaseData = await firebase.verifyToken(token);
	let user = await userModel.findOne({
		where: { firebase_id: firebaseData.id },
	});
	if (user) {
		throw new APIError("User already exists", 400);
	}
	user = await userModel.create({
		email: firebaseData.email,
		first_name: firstName,
		last_name: lastName,
		role_id: role,
		firebase_id: firebaseData.id,
	});
	return res.status(200).json({
		success: true,
		data: user,
		message: "User signed up successfully",
	});
});

export const sendPasswordResetLink = asyncWrapper(async (req, res) => {
	const uid = await firebase.getID(req.body.email);
	if (uid) {
		const user = await userModel.findOne({
			where: { firebase_id: uid },
		});
		const passwordResetID = await passwordResetModel.create({
			user_id: user.id,
		});
		const code = encrypt(JSON.stringify({ id: passwordResetID }));
		const extendedLink =
			process.env.APP_URL + "/PasswordReset?code=" + code;
		const text =
			"Please click on the link below to reset your password.<br><br>" +
			extendedLink;
		sendEmail(req.body.email, "Password Reset", text);
	}
	return res.status(200).json({
		sucess: true,
		message: "Password reset email sent successfully",
	});
});

export const validateCode = asyncWrapper(async (req, res) => {
	const { id } = JSON.parse(decrypt(req.params.code));
	const passwordReset = await passwordResetModel.findOne({
		where: { id: id },
	});
	if (passwordReset && passwordReset.is_used == 0) {
		const passwordResetDate = new Date(passwordReset.created_at);
		const validUntilDateTime = new Date(
			passwordResetDate.getTime() + parseInt(process.env.RESET_VALIDITY)
		);
		if (validUntilDateTime >= new Date()) {
			return res.status(200).json({
				sucess: true,
				message: "Reset code validated successfully",
			});
		} else {
			throw new APIError("Reset Code has expired", 403);
		}
	} else {
		throw new APIError("Reset Code is invalid", 403);
	}
});

export const resetPassword = asyncWrapper(async (req, res) => {
	try {
		const { id } = JSON.parse(decrypt(req.body.code));
		const passwordReset = await passwordResetModel.findOne({
			where: { id: id },
		});
		if (passwordReset) {
			const user = await userModel.findOne({
				where: { id: passwordReset.user_id },
			});
			const status = await firebase.resetPassword(
				user.firebase_id,
				req.body.password
			);
			if (!status) {
				throw new APIError(
					"Something went wrong. Please try again",
					400
				);
			}
			passwordReset.is_used = 1;
			passwordReset.save();
			return res
				.status(200)
				.json({ sucess: true, message: "Password reset successfully" });
		} else {
			throw new APIError("Reset Code is invalid", 403);
		}
	} catch (error) {
		console.log(error);
		throw new APIError("Reset Code is invalid", 403);
	}
});

export const logout = asyncWrapper(async (req, res) => {
	res.clearCookie(process.env.AUTH_COOKIE_NAME);
	return res
		.status(200)
		.json({ success: true, message: "User logged out successfully" });
});
