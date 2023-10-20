import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/user.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";

const PORT = process.env.PORT || 3000;
const app = express();

const whitelist = JSON.parse(process.env.CORS_WHITELIST);
const corsOptions = function (req, callback) {
	var corsOptions;
	if (whitelist.indexOf(req.header("Origin")) !== -1) {
		corsOptions = { origin: true };
	} else {
		corsOptions = { origin: false };
	}
	callback(null, corsOptions);
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
