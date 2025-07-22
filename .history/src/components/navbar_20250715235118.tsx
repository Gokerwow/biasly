'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor
import { redirect } from "next/navigation"
import { Flame } from 'lucide-react';

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
                            <div className="absolute right-0 mt-2 w-72 origin-top-right bg-white rounded-2xl shadow-[0_25px_50px_-12px_rgba(236,72,153,0.25)] overflow-hidden border-4 border-white">
                                {/* Album cover style header */}
                                <div className="relative h-24 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-400 overflow-hidden">
                                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                                    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                        <p className="font-black text-xl drop-shadow-md">MY FAN PAGE</p>
                                        <p className="text-xs font-medium text-white/90 truncate">{user.email}</p>
                                    </div>
                                    <div className="absolute -top-5 -right-5 w-24 h-24 bg-pink-300 rounded-full opacity-20"></div>
                                </div>

                                <div className="p-2">
                                    {[
                                        { emoji: "💌", name: "Fan Letters", desc: "Send to your idols" },
                                        { emoji: "🎤", name: "Vocal Stats", desc: "Singing records" },
                                        { emoji: "💃", name: "Dance Practice", desc: "Learn choreo" }
                                    ].map((item, i) => (
                                        <Link key={i} href="#" className="block p-3 hover:bg-pink-50 rounded-lg transition-all mb-1">
                                            <div className="flex items-center">
                                                <span className="text-2xl mr-3">{item.emoji}</span>
                                                <div>
                                                    <p className="font-bold text-pink-900">{item.name}</p>
                                                    <p className="text-xs text-pink-600">{item.desc}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>

                                <div className="p-4 bg-pink-100/30 border-t border-pink-200/50">
                                    <button className="w-full py-2 px-4 bg-pink-600 hover:bg-pink-700 text-white font-bold rounded-full text-sm shadow-md transition-all flex items-center justify-center">
                                        <span className="mr-2">LOGOUT</span>
                                        <Flame className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Album corner decoration */}
                                <div className="absolute top-2 right-2 w-8 h-8 bg-yellow-400 rounded-bl-full"></div>
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