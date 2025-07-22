'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor
import { redirect } from "next/navigation"
import { Bookmark, Heart, LogOut, Settings } from "lucide-react"
import { CgProfile } from "react-icons/cg"

const supabase = createClient()

export default function Navbar() {

    const [user, setUser] = useState<User | null>(null)
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
    const [bio, setBio] = useState<string | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)

            if (!session?.user) return;

            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('avatar, bio')
                .eq('id', session?.user.id)
                .single()


            if (error) {
                console.error("Error fetching profile:", error.message)
            } else {
                if (profileData) {
                    setAvatarUrl(profileData.avatar)
                    setBio(profileData.bio)
                }
            }
        }

        getUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            // If the user logs out, clear their profile data
            if (!session) {
                setBio(null)
                setAvatarUrl(null)
            } else {
                // If a new user logs in, you could re-fetch the profile here,
                // but often a page reload or navigation handles this.
                // For simplicity, we just set the user.
            }
        })

        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [])

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
            <div className="flex gap-2 relative group">
                {user ? (
                    <>
                        <div className="w-13 h-13 rounded-full overflow-hidden relative cursor-pointer">
                            <Image
                                src={avatarUrl ?? "/assets/images/1080full-yuna-(itzy).jpg"}
                                alt="User Photo Profiles"
                                fill
                                className="object-cover"
                            />
                        </div>
                        <div className="hidden absolute right-0 top-[100%] group-hover:block hover:block w-64 origin-top-right bg-white rounded-xl shadow-lg ring-1 ring-gray-100 overflow-hidden">
                            {/* Header with subtle K-pop accent */}
                            <div className="px-5 py-4 border-b border-gray-100">
                                <div className="flex items-center">
                                    <div className="mr-3 h-8 w-8 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">KP</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">My Biasly Profile</p>
                                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="py-1">
                                {[
                                    { icon: <CgProfile className="w-4 h-4 text-pink-500" />, label: "Profile" },
                                    { icon: <Heart className="w-4 h-4 text-red-500" />, label: "Favorites" },
                                    { icon: <Bookmark className="w-4 h-4 text-red-500" />, label: "Saved" },
                                    { icon: <Settings className="w-4 h-4 text-red-500" />, label: "Settings" },
                                ].map((item, index) => (
                                    <Link
                                        key={index}
                                        href="#"
                                        className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="mr-3">{item.icon}</span>
                                        <span>{item.label}</span>
                                    </Link>
                                ))}
                            </div>

                            <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    Sign out from Fandom
                                </button>
                            </div>
                        </div>
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