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
  <div className="absolute right-0 mt-3 w-72 origin-top-right bg-gray-900 rounded-lg shadow-2xl border border-purple-500/30 overflow-hidden">
    {/* Header dengan efek neon */}
    <div className="px-5 py-4 bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-b border-purple-500/20">
      <p className="font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-400 text-sm">USER_ACCOUNT</p>
      <p className="font-mono text-xs text-purple-200 truncate glow-text">{user.email}</p>
    </div>

    <div className="py-2 space-y-1">
      <Link href="/profile" className="flex items-center px-5 py-3 group hover:bg-purple-900/30 transition-all duration-300">
        <div className="mr-3 w-1 h-6 bg-purple-400 group-hover:bg-pink-400 rounded-full transition-all"></div>
        <span className="text-purple-100 group-hover:text-white font-medium">PROFILE.exe</span>
        <span className="ml-auto text-xs text-purple-400/80">CTRL+P</span>
      </Link>
      {/* Item lainnya dengan pola sama */}
    </div>

    <div className="py-2 border-t border-purple-500/10">
      <button className="w-full px-5 py-3 text-left text-pink-400 hover:text-white flex items-center group">
        <div className="mr-3 w-1 h-6 bg-red-500 rounded-full animate-pulse"></div>
        <span className="font-mono">logout()</span>
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