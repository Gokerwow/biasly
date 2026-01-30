/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from "@/utils/supabase/server";
import { BaseSignupSchema } from "./schema";
import { redirect } from "next/navigation";
import z from "zod";

const ServerSignupSchema = BaseSignupSchema.extend({
    username: z.string().min(3).refine(async (username) => {
        const supabase = await createClient()
        const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('username', username)
            .maybeSingle() 

        return !data
    }, { message: 'Username is already taken!' })
})

export async function Signup(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        username: formData.get('username'),
        email: formData.get('email'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
    }

    console.log("SERVER RECEIVED:", rawData.password);

    const validatedFields = await ServerSignupSchema.safeParseAsync(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { username, email, password } = validatedFields.data

    const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                username: username
            }
        }
    })

    if (error) {
        return { message: error.message }
    }

    if (data.session) {
        redirect('/dashboard')
    } else {
        redirect('/verify?email=${encodeURIComponent(email)}')
    }

}