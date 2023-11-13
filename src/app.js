import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoute from "./routes/userRoute.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;
const app = express();

const whitelist = JSON.parse(process.env.CORS_WHITELIST);
app.use(
	cors({
		origin: whitelist,
		methods: ["GET", "POST"],
		credentials: true,
	})
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/user", userRoute);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
