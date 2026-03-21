import { z } from "zod";

export const UserSignupSechma = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(30, "Username must be at most 30 characters"),
    email: z.string().lowercase(),
    password: 
        z.string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password has to lessthen 16 characters")
})

export const UserLoginSechma = z.object({
    email: z.string().lowercase(),
    password: 
        z.string()
        .min(6, "Password must be at least 6 characters")
        .max(16, "Password has to lessthen 16 characters")
})

export type UserSignupFormData = z.infer<typeof UserSignupSechma>
export type UserLoginFormData = z.infer<typeof UserLoginSechma>
