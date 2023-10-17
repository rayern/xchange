import express from "express"
import cors from "cors"
import "express-async-errors"
import dotenv from "dotenv"
import userRoutes from "./routes/user.js"
import notFound from "./middleware/notFound.js"
import errorHandler from "./middleware/errorHandler.js"
import cookieParser from "cookie-parser"

dotenv.config()
const PORT = process.env.PORT || 3000
const app = express()

const whitelist = JSON.parse(process.env.CORS_WHITELIST)
const corsOptions = {
	origin: function (origin, callback) {
		if (!origin) {
			return callback(null, true)
		}
		if (whitelist.indexof(origin) !== -1) {
			callback(null, true)
		} else {
			callback(new Error("Not allowed by CORS"))
		}
	},
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use("/user", userRoutes)
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})
