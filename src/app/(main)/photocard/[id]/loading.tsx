'use client'

import { Heart } from 'lucide-react'

export default function Loading() {
    return (
        <div className="absolute inset-0 z-50 flex h-full w-full flex-col items-center justify-center bg-[#111]">
            
            {/* Main Animation Container */}
            <div className="relative flex h-16 w-16 items-center justify-center mb-4">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-700 animate-[spin_10s_linear_infinite]"></div>
                <div className="absolute inset-0 rounded-full border-t-2 border-pink-500 border-r-transparent border-b-transparent border-l-transparent animate-spin shadow-[0_0_15px_rgba(236,72,153,0.5)]"></div>
                
                <div className="relative z-10 flex items-center justify-center">
                    <div className="absolute h-8 w-8 bg-pink-500/20 rounded-full blur-md animate-pulse"></div>
                    <Heart className="h-6 w-6 text-pink-500 fill-current animate-[pulse_2s_ease-in-out_infinite]" />
                </div>
            </div>

            <div className="flex items-center gap-1">
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">
                    SYNCING
                </span>
                <span className="h-1 w-1 rounded-full bg-pink-500 animate-pulse"></span>
            </div>
        </div>
    )
}