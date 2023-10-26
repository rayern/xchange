import express from "express";
import cors from "cors";
import "dotenv/config";
import userRoutes from "./routes/user.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

const PORT = process.env.PORT || 3000;
const app = express();

const whitelist = JSON.parse(process.env.CORS_WHITELIST);
const corsOptions = function (req, callback) {
	var corsOptions = {
		methods: ["GET", "POST"],
		credentials: true,
	};
	if (whitelist.indexOf(req.header("Origin")) !== -1) {
		corsOptions.origin = true;
	} else {
		corsOptions.origin = false;
	}
	callback(null, corsOptions);
};
// app.use(cors({
// 	origin: true,
// 	methods: ["GET", "POST"],
// 	credentials: true
// }));

app.use(
	cors({
		origin: "http://localhost:3000",
		credentials: true,
	})
);

app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
	res.setHeader(
		"Access-Control-Allow-Methods",
		"GET, POST, OPTIONS, PUT, PATCH, DELETE"
	);
	res.setHeader(
		"Access-Control-Allow-Headers",
		"X-Requested-With,content-type"
	);
	res.setHeader("Access-Control-Allow-Credentials", true);
	next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/user", userRoutes);
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
