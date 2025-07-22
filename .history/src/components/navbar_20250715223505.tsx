'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [userProfiles, setUserProfiles] = useState<string  | null>(null)
    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)
        }

        getUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
        })

        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [supabase])

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
                        src="/assets/images/1080full-yuna-(itzy).jpg"
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