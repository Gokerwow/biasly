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

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    }

    const { error } = await supabase.auth.signUp(data)

    if (error) {
        console.log(error)
        redirect('/error')
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export default function GoogleSignInButton() {
  const supabase = createClientComponentClient()

  // Fungsi ini yang akan dipanggil saat tombol di klik
  const handleSignInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        // URL di aplikasi Anda tempat pengguna akan kembali setelah login
        redirectTo: `${location.origin}/auth/callback`,
      },
    })

    if (error) {
      console.log(error)
      // Anda bisa menampilkan notifikasi error di sini
    }
  }

  return (
    <button onClick={handleSignInWithGoogle}>
      Sign In with Google
    </button>
  )
}