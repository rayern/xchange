import jwt from "jsonwebtoken";
import {
	createUser,
	updateUser,
	getUserById,
	getUserByFirebaseId,
	fetchProfilePic,
	upsertPasswordReset,
	getPasswordResetById,
} from "../models/UserModel.js";
import { getAddressByUser, updateAddress } from "../models/AddressModel.js";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/APIError.js";
import AuthError from "../errors/AuthError.js";
import "dotenv/config";
import FirebaseWrapper from "../helpers/FirebaseWrapper.js";
import { sendEmail } from "../helpers/Emailer.js";
import { encrypt, decrypt } from "../helpers/Encryptor.js";
import { uploadImage } from "../service/s3Service.js";
import config from "../config/appConfig.cjs";

const firebase = new FirebaseWrapper();

export const login = asyncWrapper(async (req, res) => {
	const { token } = req.body;
	const firebaseData = await firebase.verifyToken(token);
	const user = await getUserByFirebaseId(firebaseData.id);
	if (user) {
		const jwtToken = jwt.sign(
			{ token: token, role: user.role_id },
			process.env.JWT_SECRET,
			{
				expiresIn: config.jwt.expiry,
			}
		);
		let userUpdate = {};
		if (user.first_login === null) userUpdate.first_login = new Date();
		userUpdate.last_login = new Date();
		updateUser(userUpdate, user.id);
		return res
			.cookie(config.cookie.name, jwtToken, {
				expires: new Date(Date.now() + config.cookie.expiry),
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
	const user = await createUser({
		email: firebaseData.email,
		first_name: firstName,
		last_name: lastName,
		role: role,
		firebase_id: firebaseData.id,
	});
	if(user[0].error){
		throw new APIError(user[0].message, user[0].statusCode);
	}
	return res.status(200).json({
		success: true,
		data: user,
		message: "User signed up successfully",
	});
});

export const sendPasswordResetLink = asyncWrapper(async (req, res) => {
	const uid = await firebase.getID(req.body.email);
	if (uid) {
		const user = await getUserByFirebaseId(uid);
		const passwordResetID = await upsertPasswordReset({
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
	const passwordReset = await getPasswordResetById(id);
	if (passwordReset && passwordReset.is_used == 0) {
		const passwordResetDate = new Date(passwordReset.created_at);
		const validUntilDateTime = new Date(
			passwordResetDate.getTime() +
				parseInt(config.user.password.reset.validity)
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
		const passwordReset = await getPasswordResetById(id);
		if (passwordReset) {
			const user = await getUserById(passwordReset.user_id);
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
			upsertPasswordReset({ id: passwordReset.id, is_used: 1 });
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
	res.clearCookie(config.cookie.name);
	return res
		.status(200)
		.json({ success: true, message: "User logged out successfully" });
});

export const getProfile = asyncWrapper(async (req, res) => {
	const address_record = await getAddressByUser(req.user);
	return res.status(200).json({
		success: true,
		data: {
			firstName: req.user.first_name,
			lastName: req.user.last_name,
			address: address_record ? address_record.address : null,
			profile_pic: fetchProfilePic(req.user),
		},
		message: "Profile fetched successfully",
	});
});

export const updateProfile = asyncWrapper(async (req, res) => {
	const { firstName, lastName, address, profilePic } = req.body;
	const user = req.params.userId ? getUserById(req.params.userId) : req.user;
	let profile_pic = null;
	if (profilePic) {
		profile_pic = user.id + "/" + profilePic.filename;
		await uploadImage(
			user.id,
			profile_pic,
			profilePic.type,
			profilePic.base64
		);
	}
	const id = user.id;
	updateUser({
		id,
		first_name: firstName,
		last_name: lastName,
		profile_pic,
	});
	if (address) {
		try {
			await updateAddress(req.user, address);
		} catch (error) {
			return res
				.status(400)
				.json({ success: true, message: error.message });
		}
	}
	return res
		.status(200)
		.json({ success: true, message: "Profile updated successfully" });
});

export const updateProfilePic = asyncWrapper(async (req, res) => {
	const { filename, type, base64 } = req.body;
	let profile_pic = req.user.id + "/" + filename;
	await uploadImage(req.user.id, profile_pic, type, base64);
	const id = req.user.id;
	updateUser({
		id,
		profile_pic,
	});
	return res.status(200).json({
		success: true,
		message: "Profile picture updated successfully",
	});
});

export const updateProfileAddress = asyncWrapper(async (req, res) => {
	try {
		await updateAddress(req.user, req.body);
	} catch (error) {
		return res.status(400).json({ success: true, message: error.message });
	}
	return res
		.status(200)
		.json({ success: true, message: "Address updated successfully" });
});
