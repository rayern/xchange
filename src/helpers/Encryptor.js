import crypto from "crypto";
import "dotenv/config"

export const encrypt = (decrypted) => {
	const cipher = crypto.createCipher("aes-256-cbc", process.env.ENCRYPT_SALT);
	let encryptedUserId = cipher.update(decrypted, "utf-8", "hex");
	encryptedUserId += cipher.final("hex");
	return encryptedUserId;
};

export const decrypt = (encrypted) => {
	const decipher = crypto.createDecipher("aes-256-cbc", process.env.ENCRYPT_SALT);
	let decryptedUserId = decipher.update(encrypted, "hex", "utf-8");
	decryptedUserId += decipher.final("utf-8");
	return decryptedUserId;
};
