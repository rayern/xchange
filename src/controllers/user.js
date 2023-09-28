import jwt from "jsonwebtoken"
import db from "../models/index.js"
import asyncWrapper from "../middleware/async.js"
import APIError from "../errors/apiError.js"
import admin from "firebase-admin"
import dotenv from "dotenv"

dotenv.config()
export const login = asyncWrapper(async (req, res) => {
	if (!admin.apps.length) {
		const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		})
	}
	const { token } = req.body
	try{
		const decodeValue = await admin.auth().verifyIdToken(token)
	}
	catch(err){
		throw new APIError("User token is invalid", 400)
	}
	if ( typeof decodeValue !== 'undefined' && decodeValue ){
		const user = await db.user.findOne({
			where: { firebase_id: decodeValue.user_id },
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
				.cookie("user", jwtToken, {
					expires: new Date(Date.now() + 25892000000),
					httpOnly: true,
				})
				.status(200)
				.json({ success: true, data: user, message: "User logged in successfully" })
		} else {
			throw new APIError("User does not exist", 404)
		}
	} else {
		throw new APIError("User token is invalid", 400)
	}
})

export const signup = asyncWrapper(async (req, res) => {
	const { email, firstName, lastName, role, token } = req.body
	if (!admin.apps.length) {
		const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount),
		})
	}
	try{
		const decodeValue = await admin.auth().verifyIdToken(token)
	}
	catch(err){
		throw new APIError("User token is invalid", 400)
	}
	if ( typeof decodeValue !== 'undefined' && decodeValue ){
		let user = await db.user.findOne({
			where: { firebase_id: decodeValue.user_id },
		})
		if (user) {
			throw new APIError("User already exist", 400)
		}
		user = await db.user.create({
			email: decodeValue.email,
			first_name: firstName,
			last_name: lastName,
			role_id: role,
			firebase_id: decodeValue.uid,
		})
		return res
			.status(200)
			.json({ success:true, data: user, message: "User signed up successfully" })
	} else {
		throw new APIError("User token is invalid", 400)
	}
})

export const profile = asyncWrapper(async (req, res) => {
	return res
		.status(200)
		.json({ sucess: true, data: req.user, message: "User signed up successfully" })
})

export const logout = asyncWrapper(async (req, res) => {
	res.clearCookie("user")
	return res
		.status(200)
		.json({ success: true, message: "User logged out successfully" })
})
