import { createLogger, transports, format } from "winston"
import Log from "../models/Log.js"

const DatabaseTransport = new transports.Console({
	level: "error",
	format: format.json(),
	async log(info) {
		try {
			await Log.create({
				level: info.level,
				message: info.message,
                details: JSON.stringify(info.errorDetails)
			})
		} catch (error) {
			console.error("Error logging to database:", error)
		}
	},
})

const logger = createLogger({
	level: "info",
	format: format.combine(format.timestamp(), format.json()),
	transports: [DatabaseTransport],
})

export default logger
