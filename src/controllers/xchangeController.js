import { S3, PutObjectCommand } from "@aws-sdk/client-s3";
import "dotenv/config";
import asyncWrapper from "../middleware/async.js";
import APIError from "../errors/APIError.js";
import { randomString } from "../helpers/Encryptor.js";
import * as SmartyStreetsSDK from "smartystreets-javascript-sdk";

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
		console.log(base64Image.length);
		throw new APIError("Checksum does not match string length", 400);
	}
	const base64 = base64Image.replace(/^data:image\/\w+;base64,/, "");
	var buf = Buffer.from(base64, "base64");

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

export const saveAddress = asyncWrapper(async (req, res) => {
	const { street, city, state, zip } = req.body;
	const smartyStreetCore = SmartyStreetsSDK.default.core;

	let clientBuilder = new smartyStreetCore.ClientBuilder(
		new smartyStreetCore.StaticCredentials(
			process.env.SMARTY_STREET_AUTH_ID,
			process.env.SMARTY_STREET_AUTH_TOKEN
		)
	);
	let client = clientBuilder.buildUsStreetApiClient()

	const address = new SmartyStreetsSDK.default.usStreet.Lookup();
	address.street = street;
	address.city = city;
	address.state = state;
	address.zipCode = zip
	address.match = "invalid";
	
	try {
		const response = await client.send(address);
		console.log(response)
		if(response.lookups[0].result.length == 0){
			throw new Error
		}
		const result = response.lookups[0].result[0];
		console.log(console.log(response.lookups[0].result))
		const { latitude, longitude } = result.metadata;
		return res.status(200).json({
			success: true,
			data: {
				latitude: latitude,
				longitude: longitude,
			},
			message: "Address saved successfully",
		});
	} catch (error) {
		console.log(error);
		throw new APIError(
			"Invalid address. Please add more specific details",
			400
		);
	}
});
