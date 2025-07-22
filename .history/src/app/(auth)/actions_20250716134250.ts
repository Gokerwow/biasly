'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { createClient } from '@/utils/supabase/server'

export type SignupFormState = {
    message: string;
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
};

const SignUpSchema = z.object({
    email: z.string().email({ message: "Alamat email tidak valid" }),
    password: z.string().min(8, { message: "Password harus memiliki minimal 8 karakter" }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "password tidak cocok",
    path: ["confirmPassword"]
})

export async function login(formData: FormData) {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(prevState: SignupFormState,formData: FormData): Promise<SignupFormState></SignupFormState> {
    const supabase = await createClient()

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const FormDataObject = Object.entries(formData.entries())

    const validationResult = SignUpSchema.safeParse(FormDataObject)

    if (!validationResult.success) {
        console.error("validaton Error:", validationResult.error.flatten().fieldErrors)
    }

    const { error } = await supabase.auth.signUp(validationResult.data)

    if (error) {
        console.log('Supabase signup error:', error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}