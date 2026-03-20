import { SignupType } from "@/types/user.types"
import { model, models, Schema } from "mongoose"

const userSchema = new Schema<SignupType>(
    {
        username: {
            type: String,
            required: [true, "Name is required!"],
            trim: true,
            maxLength: [30, "Name has to under 30 charaters!"],
            minLength: [3, "Name has to 3 charaters long!"],
        },
        email: {
            type: String,
            required: [true, "Email is required!"],
            unique: [true, "Email has to unique!"],
            lowercase: true,
            trim: true,
            match: [/^\S+@\S+\.\S+$/, "Please enter a valid email!"],
        },
        password: {
            type: String,
            required: [true, "Password is required!"],
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        forgotPasswordToken: String,
        forgotPasswordTokenExpiry: Date,
        verifyToken: String,
        verifyTokenExpiry: Date
    },
    {
        timestamps: true
    }
)

export const User = models.users || model("users", userSchema)
