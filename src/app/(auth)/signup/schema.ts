import { z } from "zod";

export const BaseSignupSchema = z.object({
    username: z.string().min(3, { message: "Username must be 3+ chars" }), 
    email: z.string().email({ message: 'Invalid Email Address' }),
    password: z.string().min(8).regex(/\d/, { message: 'Password must contain a number' }),
    confirmPassword: z.string()
}).refine((data) => data.confirmPassword === data.password, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
});