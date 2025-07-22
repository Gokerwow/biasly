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
                    {isDropdown && (
  <div className="absolute right-0 mt-2 w-64 origin-top-right bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden animate-fade-in">
    {/* Header with subtle accent */}
    <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
      <p className="text-sm font-medium text-gray-700">Account</p>
      <p className="text-xs text-gray-500 truncate">{user.email}</p>
    </div>

    {/* Menu Items with hover animations */}
    <div className="py-1">
      {[
        { icon: <User className="w-4 h-4" />, label: "Profile", shortcut: "⌘P" },
        { icon: <Settings className="w-4 h-4" />, label: "Settings", shortcut: "⌘S" },
        { icon: <LifeBuoy className="w-4 h-4" />, label: "Support", shortcut: "⌘H" }
      ].map((item, index) => (
        <Link
          key={index}
          href="#"
          className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-all duration-200 group"
        >
          <span className="text-gray-400 group-hover:text-gray-600 mr-3">
            {item.icon}
          </span>
          <span className="flex-1">{item.label}</span>
          <span className="text-xs text-gray-400 group-hover:text-gray-500">
            {item.shortcut}
          </span>
        </Link>
      ))}
    </div>

    {/* Footer with sign out */}
    <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
      <button
        onClick={handleLogout}
        className="w-full text-left py-2 text-sm text-red-500 hover:text-red-600 flex items-center"
      >
        <LogOut className="w-4 h-4 mr-2" />
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