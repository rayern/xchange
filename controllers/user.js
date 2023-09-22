import jwt from "jsonwebtoken";
import User from "../models/index.js";
import asyncWrapper from "../middleware/async.js";
import { createCustomError } from "../errors/custom.js";
import admin from "firebase-admin";
import serviceAccount from "../config/firebase-service-account.json" assert { type: "json" };

export const login = asyncWrapper(async (req, res) => {
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
	const token = req.headers.authorization.split(" ")[1];
	const decodeValue = await admin.auth().verifyIdToken(token);
	if (decodeValue) {
		const user = await User.findOne({
			where: { firebase_id: decodeValue.user_id },
		});
		if (user) {
			const jwtToken = jwt.sign(
				{ token: token, role: user.role_id },
				process.env.JWT_SECRET,
				{
					expiresIn: "1h",
				}
			);
			if(user.first_login === null) user.first_login = new Date()
			user.last_login = new Date()
			user.save()
			return res.status(200).json({data: user, message: 'User logged in successfully'}).cookie("user", jwtToken, {
				expires: new Date(Date.now() + 25892000000),
				httpOnly: true,
			})
		} else {
			return next(createCustomError("User does not exist", 404))
		}
	}
	else{
		return next(createCustomError("User token is invalid", 400))
	}
});

export const signup = asyncWrapper(async (req, res) => {
	const { email, first_name, last_name, role, token } = req.body;
	admin.initializeApp({
		credential: admin.credential.cert(serviceAccount),
	});
	const decodeValue = await admin.auth().verifyIdToken(token);
	if(decodeValue){
		const user = await User.findOne({
			where: { firebase_id: decodeValue.user_id },
		});
		if (user) {
			return next(createCustomError("User already exist", 400))
		}
		user = await User.create({
			email: email,
			first_name: first_name,
			last_name: last_name,
			role_id: role,
			firebase_id: token
		});
		const jwtToken = jwt.sign(
			{ token: token, role: user.role_id },
			process.env.JWT_SECRET,
			{
				expiresIn: "1h",
			}
		);
		return res.status(200).json({data: user, message: 'User signed up successfully'}).cookie("user", jwtToken, {
			expires: new Date(Date.now() + 25892000000),
			httpOnly: true,
		})
	}
	else{
		return next(createCustomError("User token is invalid", 400))
	}
});

export const profile = asyncWrapper(async (req, res) => {

	return res.status(200).json({data: req.user, message: 'User signed up successfully'})
});

export const logout = asyncWrapper(async (req, res) => {
	res.clearCookie("user")
});
