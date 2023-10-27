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

	async sendPasswordResetLink(email) {
		try {
			const userRecord = await auth.getUserByEmail(email);
			const uid = userRecord.uid;

			const actionCodeSettings = {
				url: process.env.APP_URL + "/reset-password",
				handleCodeInApp: true,
			};
			const link = await auth.generatePasswordResetLink(
				email,
				actionCodeSettings
			);
			console.log(link)
		} catch (error) {
			console.error(
				"Password reset for user not found with email: ",
				email
			);
		}
	}
}

export default FirebaseWrapper;
