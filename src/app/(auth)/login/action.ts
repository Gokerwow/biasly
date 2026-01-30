/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { createClient } from "@/utils/supabase/server"
import { LoginSchema } from "./schema"
import { redirect } from "next/navigation"

export async function login(prevState: any, formData: FormData) {
    const supabase = await createClient()

    const rawData = {
        email: formData.get('email'),
        password: formData.get('password')
    }

    const validatedFields = LoginSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors
        }
    }

    const { email, password } = validatedFields.data

    const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
    })

    if (error) {
        return {
            message: error.message 
        }
    }

    redirect('/dashboard')
}