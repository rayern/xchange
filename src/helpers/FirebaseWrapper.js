import admin from "firebase-admin"
import dotenv from "dotenv"
import AuthError from "../errors/AuthError.js"

dotenv.config()
class FirebaseWrapper {
	constructor() {
		if (!admin.apps.length) {
			const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG)
			admin.initializeApp({
				credential: admin.credential.cert(serviceAccount),
			})
		}
	}

	async verifyToken(token) {
		try {
			const decodeValue = await admin.auth().verifyIdToken(token)
            if (typeof decodeValue !== "undefined" && decodeValue) {
                return {
                    id: decodeValue.user_id,
                    email: decodeValue.email
                }
            } else {
                throw new Error
            }
		} catch (err) {
			throw new AuthError("User token is invalid", 400)
		}
	}
}

export default FirebaseWrapper
