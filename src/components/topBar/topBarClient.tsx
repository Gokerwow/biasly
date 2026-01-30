'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import { Search, Bell, ChevronDown, User, Settings, LogOut, Slash } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { logout } from '@/app/(auth)/actions'
import { usePathname } from 'next/navigation'

export default function TopBarClient({ user, profile }: { user: any, profile: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const profileRef = useRef<HTMLDivElement>(null)
    const pathname = usePathname()
    const segments = pathname.split('/').filter(Boolean)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    const avatarUrl = profile?.avatar_url
    const displayName = profile?.username || profile?.email?.split('@')[0] || 'Collector'

    return (
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-800 bg-[#0B0E11]/80 px-8 backdrop-blur-md">

            {/* 1. Left Side - You can put Breadcrumbs or Page Title here instead of Search */}
            <div className="flex items-center gap-1 text-sm text-gray-500 font-medium">
                <div className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-white/5 transition-colors cursor-pointer">
                    <span className="text-gray-400">Biasly</span>
                </div>
                {segments.map((segment, index) => (
                    <div key={segment} className="flex items-center gap-1">
                        <Slash className="h-3 w-3 text-gray-700 -rotate-12" />
                        <span className={`px-2 py-1 rounded-md capitalize transition-colors ${index === segments.length - 1
                            ? 'bg-white/10 text-white font-semibold shadow-sm border border-white/5'
                            : 'hover:bg-white/5 hover:text-gray-300'
                            }`}>
                            {segment}
                        </span>
                    </div>
                ))}
            </div>

            {/* 2. Right Actions (Kept exactly the same) */}
            <div className="flex items-center gap-6 relative">

                {/* Notification Bell */}
                <button className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-800 hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-pink-500 ring-2 ring-[#0B0E11]"></span>
                </button>

                {/* Divider */}
                <div className="h-8 w-px bg-gray-800"></div>

                {/* User Profile */}
                <div className='relative' ref={profileRef}>
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-3 rounded-xl py-1 pl-1 pr-2 transition-colors hover:bg-gray-800/50  cursor-pointer">
                        <div className="relative h-9 w-9 overflow-hidden rounded-full border border-gray-700">
                            <Image
                                src={avatarUrl || '/assets/images/yeji-2.jpg'}
                                alt="Profile"
                                fill
                                className="object-cover"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="hidden text-left md:block">
                            <p className="text-sm font-semibold text-white">{displayName}</p>
                            <p className="text-xs text-gray-500">Collector</p>
                        </div>
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                    </button>

                    {isOpen && (
                        <div className="absolute right-0 top-full mt-2 w-56 origin-top-right overflow-hidden rounded-2xl border border-gray-800 bg-[#161B22] shadow-xl shadow-black/50 animate-in fade-in slide-in-from-top-2 duration-200">
                            {/* ... Menu Items ... */}
                            <div className="px-4 py-3 border-b border-gray-800">
                                <p className="text-sm font-bold text-white">My Account</p>
                                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                            </div>
                            <div className="p-2">
                                <Link href="/profile" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
                                    <User className="h-4 w-4" />
                                    Profile
                                </Link>
                                <Link href="/settings" className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-800 hover:text-white">
                                    <Settings className="h-4 w-4" />
                                    Settings
                                </Link>
                            </div>
                            <form action={logout} className="border-t border-gray-800 p-2">
                                <button type='submit' className="flex w-full items-center gap-3 cursor-pointer rounded-xl px-3 py-2 text-sm text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300">
                                    <LogOut className="h-4 w-4" />
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </header>
    )
}