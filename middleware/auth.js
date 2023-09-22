import { User } from '../models'
import admin from "firebase-admin"
import serviceAccount from "../config/firebase-service-account.json";
import jwt from 'jsonwebtoken'

const auth = async (req, res, next) => {
	try {
		const decodedJWT = jwt.verify(req.cookies.user, process.env.JWT_SECRET)
		admin.initializeApp({
			credential: admin.credential.cert(serviceAccount)
		})
		const {token, role} = decodedJWT
		const decodeValue =  await admin.auth().verifyIdToken(token)
		if (decodeValue) {
			req.user = await User.findOne({ where: { firebase_id: decodeValue.user_id } })
			if(req.user == null){
				throw new Error("Unauthorized")
			}
			return next()
		}
		return res.status(403).json({ message: "Unauthorized" })
	} catch (e) {
		console.log(e)
		return res.status(403).json({ message: "Unauthorized" })
	}
}

export default auth