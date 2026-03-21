import { User } from "@/models/user.model"
import bcrypt from "bcryptjs"
import nodemailer from "nodemailer"

type Params = {
    email: string,
    emailType: "VERIFY" | "FORGOT_PASSWORD",
    userId: string,
}

export async function sendEmail({ email, emailType, userId }: Params) {
    try {
        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 587,
            auth: {
                user: process.env.MAILTRAP_USER,
                pass: process.env.MAILTRAP_PASS,
            },
        })

        const hashedToken = await bcrypt.hash(userId.toString(), 10)

        switch (emailType) {
            case "VERIFY":
                await User.findByIdAndUpdate(userId, { 
                    $set: { verifyToken: hashedToken, verifyTokenExpiry: Date.now() + 3600000 }
                })
                break;
            case "FORGOT_PASSWORD": 
                await User.findByIdAndUpdate(userId, { 
                    $set: { forgotPasswordToken: hashedToken, forgotPasswordTokenExpiry: Date.now() + 1800000 }
                })
                break;
        }

        const mailPotions = {
            from: "",
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>
                        Click Here 👉🏾 
                        <a href="${process.env.DOMAIN}/${emailType === "VERIFY" ? "verify" : "verify-password"}?token=${hashedToken}">
                            ${process.env.DOMAIN}/${emailType === "VERIFY" ? "verify" : "verify-password"}?token=${hashedToken}
                        </a> 
                        to ${emailType === "VERIFY" ? "verify your email" : "forgot password"}
                   </p>`
        }

        const info = await transporter.sendMail(mailPotions)

        return info
    } catch (error) {
        console.error("Faild to send mail to user!")
        console.error(error)
    }
}
