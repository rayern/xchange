import admin from "firebase-admin";
import "dotenv/config";
import AuthError from "../errors/AuthError.js";

class FirebaseWrapper {
	constructor() {
		if (!admin.apps.length) {
			const serviceAccount = JSON.parse(process.env.FIREBASE_CONFIG);
			admin.initializeApp({
				credential: admin.credential.cert(serviceAccount),
			});
		}
	}

	async verifyToken(token) {
		try {
			const decodeValue = await admin.auth().verifyIdToken(token);
			if (typeof decodeValue !== "undefined" && decodeValue) {
				return {
					id: decodeValue.user_id,
					email: decodeValue.email,
				};
			} else {
				throw new Error();
			}
		} catch (err) {
			throw new AuthError("User token is invalid", 400);
		}
	}

	async getID(email) {
		try {
			const userRecord = await admin.auth().getUserByEmail(email);
			const uid = userRecord.uid;
			return uid
		} catch (error) {
			console.log(error)
			return false
		}
	}

	async resetPassword(uid, password) {
		try {
		  await admin.auth().updateUser(uid, {
			password: password,
		  });
		  return true
		} catch (error) {
		  console.error('Error:', error);
		  return false
		}
	  }
}

export default FirebaseWrapper;
