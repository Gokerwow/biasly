'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return redirect('/login?message=Email and password are required.')
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        console.error('Login Error:', error.message)
        if (error.message.includes('Invalid login credentials')) {
            return redirect('/login?message=Incorrect email or password.')
        } else if (error.message.includes('Email not confirmed')) {
            return redirect('/login?message=Please confirm your email first.')
        }
        return redirect('/login?message=Could not authenticate user.')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    const supabase = createClient()
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email || !password) {
        return redirect('/login?message=Email and password are required.')
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
        },
    })

    if (error) {
        console.error('Signup Error:', error.message)
        if (error.message.includes('User already registered')) {
            return redirect('/login?message=This email is already registered.')
        } else if (error.message.includes('Password should be at least 6 characters')) {
            return redirect('/login?message=Password must be at least 6 characters long.')
        }
        return redirect('/login?message=Could not sign up user.')
    }

    revalidatePath('/', 'layout')
    return redirect('/login?message=Check your email to continue the sign-up process.')
}