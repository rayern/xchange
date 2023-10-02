import jwt from "jsonwebtoken"
import db from "../models/index.js"
import asyncWrapper from "../middleware/async.js"
import APIError from "../errors/apiError.js"
import AuthError from "../errors/authError.js"
import dotenv from "dotenv"
import FirebaseWrapper from "../helpers/FirebaseWrapper.js"

dotenv.config()
export const login = asyncWrapper(async (req, res) => {
	const { token } = req.body
	const firebase = new FirebaseWrapper
	const firebaseData = await firebase.verifyToken(token)
	const user = await db.user.findOne({
		where: { firebase_id: firebaseData.id },
	})
	if (user) {
		const jwtToken = jwt.sign(
			{ token: token, role: user.role_id },
			process.env.JWT_SECRET,
			{
				expiresIn: process.env.JWT_EXPIRE,
			}
		)
		if (user.first_login === null) user.first_login = new Date()
		user.last_login = new Date()
		user.save()
		return res
			.cookie(process.env.AUTH_COOKIE_NAME, jwtToken, {
				expires: new Date(Date.now() + 25892000000),
				httpOnly: true,
			})
			.status(200)
			.json({ success: true, data: user, message: "User logged in successfully" })
	} else {
		throw new AuthError("User does not exist", 404)
	}
})

export const signup = asyncWrapper(async (req, res) => {
	const { firstName, lastName, role, token } = req.body
	const firebase = new FirebaseWrapper
	const firebaseData = await firebase.verifyToken(token)
	let user = await db.user.findOne({
		where: { firebase_id: firebaseData.id },
	})
	if (user) {
		throw new APIError("User already exist", 400)
	}
	user = await db.user.create({
		email: firebaseData.email,
		first_name: firstName,
		last_name: lastName,
		role_id: role,
		firebase_id: firebaseData.id,
	})
	return res
		.status(200)
		.json({ success:true, data: user, message: "User signed up successfully" })
})

export const profile = asyncWrapper(async (req, res) => {
	return res
		.status(200)
		.json({ sucess: true, data: req.user, message: "User signed up successfully" })
})

export const logout = asyncWrapper(async (req, res) => {
	res.clearCookie(process.env.AUTH_COOKIE_NAME)
	return res
		.status(200)
		.json({ success: true, message: "User logged out successfully" })
})