const { User } = require('../models')
const admin = require("firebase-admin")
const serviceAccount = require("../config/firebase-service-account.json");

class Middleware {
	async authenticate(req, res, next) {
		try {
			admin.initializeApp({
				credential: admin.credential.cert(serviceAccount)
			});
			const token = req.headers.authorization.split(" ")[1]
			const decodeValue =  await admin.auth().verifyIdToken(token)
			if (decodeValue) {
				req.user = await User.findOne({ where: { firebase_id: decodeValue.user_id } })
				if(req.user == null){
					req.user = User.create({
						email: decodeValue.email,
						firebase_id: decodeValue.user_id,
						first_login: new Date(),
						last_login: new Date()
					})
				}
				else{
					req.user.last_login = new Date()
					req.user.save()
				}
				return next()
			}
			return res.status(403).json({ message: "Unauthorized" })
		} catch (e) {
            console.log(e)
			return res.status(403).json({ message: "Unauthorized" })
		}
	}
}

module.exports = new Middleware()