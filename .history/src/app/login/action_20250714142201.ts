// file: action.ts

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
    // TAMBAHKAN 'await' DI SINI
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    // Sekarang 'supabase' adalah objek SupabaseClient yang sebenarnya, 
    // dan Anda bisa mengakses .auth
    const { error } = await supabase.auth.signInWithPassword(data)

    if (error) {
        console.error('Login Error:', error.message) 
        return redirect('/login?message=Could not authenticate user.')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: FormData) {
    // TAMBAHKAN 'await' DI SINI JUGA
    const supabase = await createClient()

    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.error('Signup Error:', error.message)
        return redirect('/login?message=Could not sign up user.')
    }

    revalidatePath('/', 'layout')
    return redirect('/login?message=Check email to continue sign in process.')
}