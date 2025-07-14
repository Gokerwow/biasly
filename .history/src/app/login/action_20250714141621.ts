// file: action.ts (versi yang sudah dimodifikasi)

'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = createClient() // createClient tidak perlu await

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    // Alih-alih ke /error, kembali ke /login dengan pesan error
    return redirect('/login?message=Could not authenticate user. Please check your credentials.')
  }

  // Jika berhasil, revalidate dan arahkan ke halaman utama/dashboard
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = createClient() // createClient tidak perlu await

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    // Kembali ke /login dengan pesan error
    return redirect('/login?message=Could not sign up user. The email may already be in use.')
  }

  // PENTING: Untuk signup, berikan pesan bahwa user harus cek email
  // Ini karena default Supabase adalah mengaktifkan konfirmasi email.
  revalidatePath('/', 'layout')
  return redirect('/login?message=Check your email to continue the sign-in process.')
}