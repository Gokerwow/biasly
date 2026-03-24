'use client'

import Link from 'next/link'
import { FileQuestion, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B0E11] px-4 text-center">

            {/* 1. Background Effects */}
            {/* A large, faint question mark in the background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-black text-[20rem] text-gray-800/20 select-none blur-sm">
                ?
            </div>

            {/* 2. Main Content */}
            <div className="relative z-10 flex flex-col items-center max-w-md">

                {/* The "Missing Card" Icon */}
                <div className="mb-8 relative">
                    <div className="h-32 w-24 rounded-xl border-2 border-dashed border-gray-700 bg-gray-900/50 flex items-center justify-center rotate-[-6deg] transition-transform hover:rotate-0 hover:scale-110 duration-500">
                        <FileQuestion className="h-10 w-10 text-gray-600 animate-pulse" />
                    </div>

                    {/* Decorative Badge */}
                    <div className="absolute -top-4 -right-4 rotate-[12deg] rounded-full bg-pink-500 px-3 py-1 text-[10px] font-black text-black uppercase tracking-widest shadow-[0_0_15px_rgba(236,72,153,0.5)]">
                        Missing
                    </div>
                </div>

                {/* Glitch Text 404 */}
                <h1 className="mb-2 text-6xl font-black italic tracking-tighter text-white drop-shadow-[4px_4px_0px_#ec4899]">
                    4<span className="text-gray-600">0</span>4
                </h1>

                <h2 className="mb-6 text-xl font-bold text-gray-300 uppercase tracking-widest">
                    Card Not Found
                </h2>

                <p className="mb-8 text-sm text-gray-500 leading-relaxed">
                    The page you are looking for might have been traded away, moved to a different binder, or never existed in this timeline.
                </p>

                {/* Action Buttons */}
                <div className="flex flex-col w-full gap-3 sm:flex-row">
                    <Link
                        href="/"
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-pink-600 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-95"
                    >
                        <Home className="h-4 w-4" />
                        Return Home
                    </Link>
                </div>
            </div>

        </div>
    )
}