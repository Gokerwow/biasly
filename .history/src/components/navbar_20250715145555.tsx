'use client'

import { createClient } from "@/utils/supabase/client"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor

export default function Navbar() {
    const [user, setUser] = useState<User | null>(null)
    const supabase = createClient()

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <nav className="fixed w-full bg-white flex justify-between items-center px-20 shadow-xl z-50">
      {/* Logo */}
      <header>
        <Image
          src="/assets/images/biaslyLogo.png"
          alt="Biasly Logo"
          width={80}
          height={80}
        />
      </header>

      {/* Centered Navigation Items */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <ul className="text-black bg-[#F9F9F9] flex justify-center items-center h-full px-5 rounded-2xl border border-gray-200 shadow-sm">
          {[
            { icon: '/home.svg', text: 'Home' },
            { icon: '/groups.svg', text: 'Groups' },
            { icon: '/idols.svg', text: 'Idols' },
            { icon: '/discovery.svg', text: 'Discovery' },
            { icon: '/community.svg', text: 'Community' },
          ].map((item, index) => (
            <li key={index} className="p-2">
              <Link href="#" className="flex flex-col items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors">
                <Image
                  src={item.icon}
                  alt={`${item.text} Icon`}
                  width={20}
                  height={20}
                  className="opacity-80"
                />
                <span className="text-sm">{item.text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Auth Buttons / Profile Dropdown */}
      <div className="flex gap-3 items-center">
        {user ? (
          <div className="relative">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-purple-500">
                <Image
                  src={user.photoURL || '/default-profile.png'}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <span className="hidden md:inline">{user.name || user.email}</span>
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                <Link 
                  href="/profile" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <Link 
                  href="/settings" 
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    // handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link 
              href='/login' 
              className="px-5 py-2 rounded-2xl border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href='/signup' 
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-[#9534E8] to-[#EA479B] text-white hover:opacity-90 transition-opacity"
            >
              Join Now
            </Link>
          </>
        )}
      </div>
    </nav>
    )
}