
export type SignupType = {
    username: string,
    email: string,
    password: string,
    isVerified: boolean,
    isAdmin: boolean,
    forgotPasswordToken: string,
    forgotPasswordTokenExpiry: Date,
    verifyToken: string,
    verifyTokenExpiry: Date,
}
