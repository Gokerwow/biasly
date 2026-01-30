'use client'

import Link from 'next/link'
import { ShieldBan, ArrowLeft, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function UnauthorizedPage() {
    const router = useRouter()

    const handleReturn = () => {
        router.back()
    }

    return (
        <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#050505] px-4 text-center">

            {/* 1. Background Ambience (Red/Pink Warning Glow) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="h-64 w-64 rounded-full bg-red-600/20 blur-[100px] animate-pulse"></div>
            </div>

            {/* 2. Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(20,20,20,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(20,20,20,0.5)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20"></div>

            {/* 3. The Content Card */}
            <div className="relative z-10 max-w-lg">

                {/* Animated Icon Wrapper */}
                <div className="mb-8 flex justify-center">
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-red-500/10 ring-1 ring-red-500/30">
                        {/* The pulsing ring */}
                        <div className="absolute inset-0 rounded-full border border-red-500 opacity-20 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>

                        {/* The Icon (Shaking) */}
                        <ShieldBan className="h-10 w-10 text-red-500 animate-[bounce_1s_infinite]" />

                        {/* Small floating lock */}
                        <div className="absolute -right-2 -top-2 rounded-full bg-[#050505] p-2 ring-1 ring-red-900">
                            <Lock className="h-4 w-4 text-gray-400" />
                        </div>
                    </div>
                </div>

                {/* Typography */}
                <h1 className="mb-2 text-5xl font-black italic tracking-tighter text-white drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
                    ACCESS <span className="text-red-500">DENIED</span>
                </h1>

                <div className="mb-8 space-y-2">
                    <p className="text-lg font-bold text-gray-300 uppercase tracking-widest">
                        VIP Clearance Required
                    </p>
                    <p className="text-sm text-gray-500">
                        You don&apos;t have the required &quot;Stan Pass&quot; to enter this area. <br />
                        Please log in with a different account or return to the lobby.
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">

                    {/* Primary: Go Back */}
                    <button
                        onClick={handleReturn}
                        className="group flex items-center gap-2 rounded-xl bg-white px-8 py-3 text-sm font-bold text-black transition-all hover:bg-gray-200 hover:scale-105 active:scale-95"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Return to Safety
                    </button>

                    {/* Secondary: Login */}
                    <Link
                        href="/login"
                        className="flex items-center gap-2 rounded-xl border border-gray-800 bg-transparent px-8 py-3 text-sm font-bold text-gray-400 transition-all hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5"
                    >
                        Switch Account
                    </Link>
                </div>

                {/* Decorative "Error Code" Footer */}
                <div className="mt-12 flex justify-center gap-8 border-t border-white/5 pt-8 text-[10px] font-mono text-gray-600 uppercase tracking-widest">
                    <span>Error: 403_FORBIDDEN</span>
                    <span>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</span>
                </div>

            </div>
        </div>
    )
}