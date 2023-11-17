import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/APIError.js";
import { randomString } from "../helpers/Encryptor.js";


const s3 = new S3({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_KEY,
	},
});
export const uploadImage = asyncWrapper(async (req, res) => {
	const { base64Image, checksum } = req.body;
    if (base64Image.length !== checksum) {
        console.log(base64Image.length)
		throw new APIError("Checksum does not match string length", 400);
	}
    const base64 = base64Image.replace(/^data:image\/\w+;base64,/, "")
	var buf = Buffer.from(
		base64,
		"base64"
	);
	
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_BUCKET,
		Key: randomString(8) + ".jpg",
		Body: buf,
		ContentEncoding: "base64",
		ContentType: "image/jpeg",
	});
	await s3.send(command);
	return res.status(200).json({
		success: true,
		message: "Image uploaded successfully",
	});
});
