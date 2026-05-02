'use client'

import { Plus } from "lucide-react";

export const CardSlot = ({ onClick }: { onClick?: () => void }) => (
    <button
        onClick={onClick}
        className="group relative aspect-[2/3] w-full rounded-lg border-2 border-dashed border-gray-700/60 bg-gradient-to-br from-gray-900/40 to-gray-800/40 hover:border-pink-500/60 hover:bg-pink-500/5 transition-all duration-300 backdrop-blur-sm cursor-pointer"
    >
        {/* Slot Background Pattern */}
        <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                backgroundSize: '16px 16px'
            }} />
        </div>

        {/* Plus Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-3 rounded-xl bg-gray-800/60 group-hover:bg-pink-500/20 transition-all group-hover:scale-110 backdrop-blur-sm border border-gray-700/50 group-hover:border-pink-500/50">
                <Plus className="h-5 w-5 text-gray-600 group-hover:text-pink-500 transition-colors" />
            </div>
        </div>

        {/* Corner Accent */}
        <div className="absolute top-1 right-1 w-2 h-2 border-t-2 border-r-2 border-gray-700/40 rounded-tr opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-1 left-1 w-2 h-2 border-b-2 border-l-2 border-gray-700/40 rounded-bl opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
)