import {S3Client, PutObjectCommand, ListObjectsV2Command} from "@aws-sdk/client-s3";
import {randomString} from "../helpers/Encryptor.js";
import "dotenv/config";

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

const s3Url = "https://" + process.env.AWS_BUCKET + ".s3.amazonaws.com/"

export const listImages = async (userId) => {
    // list the images first. This should be blocking
    const listCommand = new ListObjectsV2Command( { // ListObjectsV2Request
        Bucket: process.env.AWS_BUCKET,
        Delimiter: ", ",
        EncodingType: "url",
        Prefix: userId + "/",
    });
    
    return s3.send(listCommand);
}

export const uploadImage = async (userId, filename, contentType, base64Image) => {
    const base64 = base64Image.replace(/^data:image\/\w+;base64,/, "")
    let buf = Buffer.from(
        base64,
        "base64"
    );
    
    const putCommand = new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET,
        Key: filename,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: contentType,
    });

    s3.send(putCommand)
    return s3Url + filename
}