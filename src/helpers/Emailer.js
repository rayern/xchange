import nodemailer from "nodemailer";
import "dotenv/config";

export const sendEmail = async (email, subject, text) => {
	const transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: process.env.SMTP_PORT,
		secure: false,
		auth: {
			user: process.env.SMTP_EMAIL,
			pass: process.env.SMTP_PASSWORD,
		},
	});

	const mailOptions = {
		from: 'noreply@bixan.in',
		to: email,
		subject: subject,
		text: text
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent:", info.response);
	} catch (error) {
		console.error("Error:", error);
	}
}
