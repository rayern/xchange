import express from "express";
import cors from "cors";
import "dotenv/config";
import metaRoute from "./routes/metaRoute.js";
import userRoute from "./routes/userRoute.js";
import itemRoute from "./routes/itemRoute.js";
import notFound from "./middleware/notFound.js";
import errorHandler from "./middleware/errorHandler.js";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import { loadEnums } from "./service/enumService.js"

const PORT = process.env.PORT || 3000;
const app = express();
global.ENUM = {};

const whitelist = JSON.parse(process.env.CORS_WHITELIST);
app.use(
	cors({
		origin: whitelist,
		methods: ["GET", "POST", "OPTIONS", "PATCH", "DELETE"],
		credentials: true,
	})
);
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/meta", metaRoute);
app.use("/user", userRoute);
app.use("/item", itemRoute);
app.use(notFound);
app.use(errorHandler);

const interval = setInterval(loadEnums, 10000);
app.listen(PORT, () => {
	loadEnums();
	console.log(`Server is running on port ${PORT}`);
});

process.on("SIGINT", () => {
	clearInterval(interval);
	process.exit();
});
