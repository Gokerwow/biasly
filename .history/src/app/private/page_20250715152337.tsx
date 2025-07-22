// File: app/private/page.tsx
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function PrivatePage() {
  console.log("--- Mencoba mengakses halaman /private ---"); // Log 1

  const supabase = createClient(); // Menggunakan server client

  const { data, error } = await supabase.auth.getUser();

  console.log("Hasil dari getUser di server:", { 
    user: data?.user?.id, 
    email: data?.user?.email, 
    error 
  }); // Log 2

  if (error || !data?.user) {
    console.log("Gagal mendapatkan user, mengarahkan ke /login..."); // Log 3
    redirect('/login');
  }

  return (
    <div>
        <h1>Halaman Privat yang Terlindungi</h1>
        <p>Halo, {data.user.email}! Anda hanya bisa melihat ini jika sudah login.</p>
    </div>
  );
}