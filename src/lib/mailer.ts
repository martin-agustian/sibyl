import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export async function sendMail(to: string, subject: string, html: string) {
	await transporter.sendMail({
		from: `"Sibyl" <${process.env.EMAIL_USER}>`, to, subject, html,
	});
}
