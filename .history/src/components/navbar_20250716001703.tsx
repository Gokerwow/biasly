'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor
import { redirect } from "next/navigation"
import { profile } from "console"

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

  <div id="profile-menu" class="hidden absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-white shadow-xl z-50 overflow-hidden border border-gray-200">
    <div class="h-16 bg-gradient-to-r from-blue-400 to-purple-500 relative">
      <div class="absolute -bottom-4 left-4 w-8 h-8 rounded-lg overflow-hidden border-2 border-white shadow-md">
        <img src="https://i.pinimg.com/564x/d4/d4/d4/d4d4d4d4d4d4d4d4d4d4d4d4d4d4d4.jpg" alt="Profile" class="w-full h-full object-cover">
      </div>
    </div>
    
    <div class="pt-6 pb-2 px-4">
      <p class="text-sm font-bold text-gray-900">KPop Stan Account</p>
      <p class="text-xs text-gray-500">premium member</p>
    </div>
    
    <div class="py-1 border-t border-gray-100">
      <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
        <span class="w-1 h-1 rounded-full bg-blue-500 mr-3"></span>
        Profile
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50">
        <span class="w-1 h-1 rounded-full bg-blue-500 mr-3"></span>
        Settings
      </a>
      <a href="#" class="flex items-center px-4 py-2 text-sm text-red-500 hover:bg-red-50">
        <span class="w-1 h-1 rounded-full bg-red-500 mr-3"></span>
        Logout
      </a>
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