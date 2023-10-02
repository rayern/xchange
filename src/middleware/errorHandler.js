import APIError from "../errors/apiError.js"
import AuthError from "../errors/authError.js"
import db from "../models/index.js"

const errorHandler = async (err, req, res, next) => {
	console.log(err)
	if (err instanceof APIError) {
		return res
			.status(err.statusCode)
			.json({ success: false, message: err.message })
	}
	if (err instanceof AuthError) {
		await db.log.create({
			user_id: req.user?.id,
			ip_address:
				req.headers["x-forwarded-for"]?.split(",").shift() ||
				req.socket?.remoteAddress,
			api_endpoint: req.originalUrl,
            request: JSON.stringify(req.body),
			message: err.message,
			details: err.stack,
		})
		return res
			.status(err.statusCode)
			.json({ success: false, message: err.message })
	}
	return res
		.status(200)
		.json({
			success: false,
			message: "Something went wrong, please try again later",
		})
}
export default errorHandler
