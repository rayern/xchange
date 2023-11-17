import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";
import asyncWrapper from "../middleware/async.js";

const s3 = new S3({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});
export const uploadImage = asyncWrapper(async (req, res) => {
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_BUCKET,
		Key: req.file.originalname,
		Body: req.file.buffer,
		ContentType: req.file.mimetype,
	});
	await s3.send(command);
	return res.status(200).json({
		success: true,
		message: "Image uploaded successfully",
	});
});
