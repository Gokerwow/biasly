'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { logout } from '@/app/(auth)/actions'
import {
    Home,
    Grid,
    Heart,
    Settings,
    LogOut,
    Book,
    Compass
} from 'lucide-react'
import Image from 'next/image'
import { ROUTES } from '@/constants'

const MENU_ITEMS = [
    { name: 'Dashboard', icon: Home, href: ROUTES.DASHBOARD.INDEX },
    { name: 'My Collection', icon: Grid, href: ROUTES.COLLECTION.INDEX },
    { name: 'Browse', icon: Compass, href: ROUTES.BROWSE.RELEASES },
    { name: 'Wishlist', icon: Heart, href: ROUTES.WISHLIST.INDEX },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-800 bg-[#0B0E11] text-gray-400">

            {/* 1. Logo Section */}
            <div className="w-full h-20 flex justify-center items-center p-2 border-b border-gray-800">
                <Image
                    src="/assets/images/biasly full logo.png"
                    alt="Biasly Logo"
                    width={150}
                    height={40}
                    className="object-contain"
                />
            </div>

            {/* 2. Navigation Menu */}
            <div className="flex flex-col gap-2 p-4 mt-4">
                <p className="px-4 text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                    Menu
                </p>

                {MENU_ITEMS.map((item) => {
                    const isActive = pathname === item.href

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-200 
                                ${isActive || pathname.includes(item.href)
                                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-900/20'
                                    : 'hover:bg-gray-800 hover:text-white'
                                }`}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="font-medium text-sm">{item.name}</span>
                        </Link>
                    )
                })}

                <Link href='/binder' className="group flex items-center justify-between w-full p-3 rounded-xl 
                    bg-gradient-to-r from-pink-500/10 to-transparent 
                    border border-pink-500/20 hover:border-pink-500/50 transition-all cursor-pointer">
                    <div className="flex items-center gap-3">
                        <Book className="w-6 h-6 text-pink-500" />
                        <span className="font-semibold text-gray-200">My Binders</span>
                    </div>
                    <span className="text-[10px] bg-pink-500 text-white px-1.5 py-0.5 rounded-md font-bold">
                        PRO
                    </span>
                </Link>
            </div>

            {/* 3. Bottom Section (Settings/Logout) */}
            <div className="absolute bottom-8 left-0 w-full px-4 flex flex-col gap-4">
                <Link
                    href="/settings"
                    className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-gray-800 hover:text-white transition-colors"
                >
                    <Settings className="h-5 w-5" />
                    <span className="font-medium text-sm">Settings</span>
                </Link>
                <form action={logout}>
                    <button
                        // onClick={handleLogout}
                        className="flex items-center gap-4 rounded-xl px-4 py-3 hover:bg-red-800 hover:text-white transition-colors w-full cursor-pointer"
                    >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium text-sm">Log Out</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}