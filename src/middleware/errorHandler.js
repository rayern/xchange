import APIError from "../errors/apiError.js"
import AuthError from "../errors/authError.js"
import db from "../models/index.js"
import logger from "../helpers/logger.js"
const errorHandler = async (err, req, res, next) => {
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
	else{
		logger.error(JSON.stringify({error: err.message, api: req.originalUrl, request: req.body,}))
		if (err instanceof APIError) {
			return res
				.status(err.statusCode)
				.json({ success: false, message: err.message })
		}
	}

	return res
		.status(200)
		.json({
			success: false,
			message: "Something went wrong, please try again later",
		})
}
export default errorHandler
