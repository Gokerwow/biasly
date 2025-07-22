'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor
import { redirect } from "next/navigation"
import { UserIcon, SettingsIcon, HeartIcon, StaIcon, LogOutIcon, Mic } from 'lucide-react';

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const [userProfiles, setUserProfiles] = useState<string | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [isDropdown, setIsDropdown] = useState(false)

    const supabase = createClient()

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)

            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('avatar, bio')
                .eq('id', session?.user.id)
                .single()

            setUserProfiles(profileData)

            if (error) {
                redirect('/error')
            }

            if (profileData) {
                setAvatarUrl(profileData.avatar)
            }
        }

        getUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setUser(session?.user ?? null)
            setUserProfiles(userProfiles ?? null)
        })

        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [supabase])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        // UI akan otomatis update karena listener onAuthStateChange
    }

    const handleProfileClick = () => {
        setIsDropdown(true)
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
                    <>
                        <div className="w-13 h-13 rounded-full overflow-hidden relative" onClick={handleProfileClick}>
                            <Image
                                src={avatarUrl ?? "/assets/images/1080full-yuna-(itzy).jpg"}
                                alt="User Photo Profiles"
                                fill
                                className="object-cover"
                            />
                        </div>
                        {isDropdown && (
                            <div className="absolute right-0 mt-2 w-80 origin-top-right bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden border-2 border-white/20">
                                {/* Gradient hologram header */}
                                <div className="px-6 py-5 bg-gradient-to-r from-[#ff4d8d] to-[#ff9500] text-white relative overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://assets.codepen.io/13471/sparkles.png')] opacity-20"></div>
                                    <p className="font-black text-xl mb-1 relative">OPPA SARANGHAE! <span className="text-yellow-300">💖</span></p>
                                    <p className="text-sm font-medium text-white/90 relative">{user.email}</p>
                                </div>

                                <div className="divide-y divide-pink-100/50">
                                    <Link href="/profile" className="flex items-center px-6 py-4 hover:bg-pink-50/70 transition-all">
                                        <div className="bg-pink-100 p-2 rounded-lg mr-4">
                                            <Mic className="text-pink-600 w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-pink-900">My Fan Profile</p>
                                            <p className="text-xs text-pink-500">View your fan cards</p>
                                        </div>
                                    </Link>
                                    {/* Item lainnya */}
                                </div>

                                <div className="bg-gradient-to-r from-pink-100/50 to-orange-100/50 p-4">
                                    <button className="w-full flex justify-center items-center py-3 px-4 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 text-white font-bold shadow-lg hover:shadow-pink-300/50 transition-all">
                                        <LogOutIcon className="mr-2" />
                                        SAYONARA 💫
                                    </button>
                                </div>

                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-16 h-16 bg-pink-200/20 rounded-bl-full"></div>
                                <div className="absolute bottom-0 left-0 w-10 h-10 bg-yellow-200/20 rounded-tr-full"></div>
                            </div>
                        )}
                    </>
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