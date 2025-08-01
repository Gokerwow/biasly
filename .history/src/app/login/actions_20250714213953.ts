'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

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

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // PERBAIKAN: Strukturnya adalah options -> data -> {objek Anda}
    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                // Berikan nilai default, atau bisa juga string kosong
                full_name: 'New User', 
                avatar_url: '' 
            }
        }
    })

    if (error) {
        console.error("Error saat signup:", error) // Gunakan console.error untuk error
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}