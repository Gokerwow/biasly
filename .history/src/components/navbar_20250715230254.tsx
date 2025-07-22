'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null);
    const [username, setUsername] = useState<string | null>(null); // Ganti nama state ini
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [bio, setBio] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const supabase = createClient()

    useEffect(() => {
        // 1. Buat satu fungsi async untuk menangani semua pengambilan data
        const fetchUserProfile = async () => {
            setLoading(true);
            const { data: { session } } = await supabase.auth.getSession();

            // Jika ada sesi (pengguna login)...
            if (session) {
                setUser(session.user);

                console.log(session)
                // ...maka ambil data profilnya
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('username, avatar, bio') // Ambil kolom yang dibutuhkan
                    .eq('id', session.user.id)         // Berdasarkan ID pengguna
                    .single();                         // Ambil sebagai satu objek

                // Jika data profil ditemukan, set state-nya
                if (profileData) {
                    setUsername(profileData.username);
                    setAvatarUrl(profileData.avatar);
                    setBio(profileData.bio);
                }
            }
            setLoading(false);
        };

        // 2. Panggil fungsi tersebut saat komponen pertama kali dimuat
        fetchUserProfile();

        // 3. Setup listener untuk perubahan status otentikasi
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            // Jika ada event (login/logout), perbarui state user dan panggil lagi fungsi fetch
            setUser(session?.user ?? null);
            if (session) {
                fetchUserProfile(); // Panggil lagi untuk refresh data profil
            } else {
                // Bersihkan data profil jika pengguna logout
                setUsername(null);
                setAvatarUrl(null);
                setBio(null);
            }
        });

        // 4. Cleanup listener saat komponen di-unmount
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, []); // Dependency array bisa dikosongkan karena supabase client stabil


    const handleLogout = async () => {
        await supabase.auth.signOut()
        // UI akan otomatis update karena listener onAuthStateChange
    }

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
                            src={avatarUrl ?? "/assets/images/1080full-yuna-(itzy).jpg"}
                            alt="User Photo Profiles"
                            fill
                            className="object-cover"
                        />
                        {/* <button className="px-5 py-1 rounded-2xl border-1 border-gray-400">
                            {user.email}
                        </button>
                        <button onClick={handleLogout}>
                            logout
                        </button> */}
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