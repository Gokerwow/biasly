'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor
import { redirect } from "next/navigation"
import { UserIcon, SettingsIcon, HeartIcon, StaIcon, LogOutIcon } from 'lucide-react';

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
                            <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 backdrop-blur-sm backdrop-filter">
                                <div className="px-5 py-4 border-b border-gray-100">
                                    <p className="font-semibold text-gray-900">Welcome back!</p>
                                    <p className="text-sm text-gray-500 truncate">{user.email}</p>
                                </div>

                                <div className="py-2 space-y-1">
                                    <Link href="/profile" className="flex items-center px-5 py-3 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:pl-6">
                                        <UserIcon className="w-5 h-5 mr-3 text-gray-400" />
                                        Your Profile
                                    </Link>
                                    <Link href="/settings" className="flex items-center px-5 py-3 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:pl-6">
                                        <SettingsIcon className="w-5 h-5 mr-3 text-gray-400" />
                                        Account Settings
                                    </Link>
                                    <Link href="/support" className="flex items-center px-5 py-3 text-sm text-gray-700 transition-all duration-200 hover:bg-gray-50 hover:pl-6">
                                        <HeartIcon className="w-5 h-5 mr-3 text-gray-400" />
                                        Customer Support
                                    </Link>
                                </div>

                                <div className="py-2 border-t border-gray-100">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-5 py-3 text-sm text-red-500 transition-all duration-200 hover:bg-gray-50 hover:pl-6"
                                    >
                                        <LogOutIcon className="w-5 h-5 mr-3" />
                                        Sign out
                                    </button>
                                </div>
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