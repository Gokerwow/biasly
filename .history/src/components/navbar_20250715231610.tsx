'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [userProfiles, setUserProfiles] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [bio, setBio] = useState<string | null>(null)

    const supabase = createClient()

useEffect(() => {
    // 1. Buat satu fungsi async untuk menangani semua pengambilan data
    const fetchUserAndProfile = async () => {
        // Ambil data sesi terlebih dahulu
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
            console.error('Error getting session:', sessionError);
            return;
        }

        // Jika ada sesi (pengguna login)...
        if (session) {
            // Set state user terlebih dahulu
            setUser(session.user);

            // ...BARU ambil data profilnya menggunakan session.user.id
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('avatar, bio') // Perbaiki sintaks: satu string dipisahkan koma
                .eq('id', session.user.id) // Gunakan session.user.id yang sudah pasti ada
                .single();

            if (profileError) {
                console.error('Error fetching profile:', profileError);
            } else {
                // Set state profil
                setUserProfiles(profileData);
            }

        } else {
            // Jika tidak ada sesi, pastikan state user dan profil kosong
            setUser(null);
            setUserProfiles(null);
        }
    };

    // 2. Panggil fungsi tersebut saat komponen pertama kali dimuat
    fetchUserAndProfile();

    // 3. Setup listener untuk perubahan status otentikasi
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('Auth event:', event);
        // Jika ada event (login/logout), panggil lagi fungsi untuk refresh semua data
        fetchUserAndProfile();
    });

    // 4. Cleanup listener saat komponen di-unmount
    return () => {
        authListener?.subscription.unsubscribe();
    };
}, [supabase]); // <-- 'supabase' sebagai dependency sudah cukup

    const handleLogout = async () => {
        await supabase.auth.signOut()
        // UI akan otomatis update karena listener onAuthStateChange
    }

    console.log(userProfiles)

    return (
        <nav className="fixed w-full bg-white flex justify-between items-center px-20 shadow-xl">
            <header>
                <Image
                    src="/assets/images/biaslyLogo.png"
                    alt="Biasly Logo"
                    width={80}
                    height={80}
                />
            </header>
            <ul className="text-black bg-[#F9F9F9] flex justify-center items-center h-full px-5 rounded-2xl border-1 border-gray-400">
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                            src="/home.svg"
                            alt="Home Icon"
                            width={25}
                            height={25}
                        />
                        <span>Home</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                            src="/groups.svg"
                            alt="Home Icon"
                            width={25}
                            height={25}
                        />
                        <span>Groups</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                            src="/idols.svg"
                            alt="Home Icon"
                            width={25}
                            height={25}
                        />
                        <span>Idols</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                            src="/discovery.svg"
                            alt="Home Icon"
                            width={25}
                            height={25}
                        />
                        <span>Discovery</span>
                    </Link>
                </li>
                <li className="p-2 flex justify-center items-center ">
                    <Link href="#" className="flex justify-center items-end gap-1">
                        <Image
                            src="/community.svg"
                            alt="Home Icon"
                            width={25}
                            height={25}
                        />
                        <span>Community</span>
                    </Link>
                </li>
            </ul>
            <div className="flex gap-2">
                {user ? (
                    <div className="w-13 h-13 rounded-full overflow-hidden relative">
                        <Image
                            src="/assets/images/1080full-yuna-(itzy).jpg"
                            alt="User Photo Profiles"
                            fill
                            className="object-cover"
                        />
                    </div>
                ) : (
                    <>
                        <Link href='/login' className="px-5 py-1 rounded-2xl border-1 border-gray-400">
                            Sign In
                        </Link>
                        <Link href='/login' className="px-5 py-1 rounded-2xl border-1 bg-gradient-to-r from-[#9534E8] to-[#EA479B] text-white">
                            Join
                        </Link>
                    </>
                )}
            </div>
        </nav>
    )
}