'use client'

import { createClient } from '@/utils/supabase/client';
import { FcGoogle } from 'react-icons/fc';

export default function GoogleButton() {

    const supabase = createClient()

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
        <button
            onClick={handleSignInWithGoogle} // Replace with your Google auth function
            className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 cursor-pointer"
        >
            <FcGoogle className="h-5 w-5 mr-2" />
            Sign in with Google
        </button>
    )
}