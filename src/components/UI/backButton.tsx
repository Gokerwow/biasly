'use client'

import { useRouter } from 'next/navigation';
import { ArrowLeft, CornerUpLeft } from 'lucide-react';

interface BackButtonProps {
    label?: string;
    href?: string;
    className?: string;
}

export default function BackButton({ 
    label = "RETURN", 
    href, 
    className 
}: BackButtonProps) {
    const router = useRouter();

    const handleNavigation = () => {
        if (href) {
            router.push(href);
        } else {
            router.back();
        }
    };

    return (
        <button 
            onClick={handleNavigation}
            className={`
                group cursor-pointer relative overflow-hidden
                flex items-center gap-3 px-5 py-2.5 
                rounded-lg
                bg-[#0f0f13] border border-white/10
                transition-all duration-300 ease-out
                hover:border-pink-500/50 hover:shadow-[0_0_20px_rgba(236,72,153,0.15)]
                ${className || ''}
            `}
        >
            {/* 1. The Background Highlight (Slides in on hover) */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500/10 to-purple-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300 ease-out"></div>

            {/* 2. The Icon Box */}
            <div className="relative z-10 flex items-center justify-center h-6 w-6 rounded bg-white/5 border border-white/10 group-hover:bg-pink-500 group-hover:border-pink-400 group-hover:text-white transition-colors duration-300 text-gray-400">
                <CornerUpLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-0.5" />
            </div>

            {/* 3. The Separator Line */}
            <div className="h-4 w-[1px] bg-white/10 group-hover:bg-pink-500/50 transition-colors duration-300"></div>

            {/* 4. The Text */}
            <span className="relative z-10 text-xs font-bold tracking-widest text-gray-300 group-hover:text-white transition-colors duration-300 uppercase font-mono">
                {label}
            </span>

            {/* 5. Tiny Decorative Corners */}
            <div className="absolute top-0 left-0 h-2 w-2 border-t border-l border-white/0 group-hover:border-pink-500/50 transition-colors duration-300"></div>
            <div className="absolute bottom-0 right-0 h-2 w-2 border-b border-r border-white/0 group-hover:border-purple-500/50 transition-colors duration-300"></div>
        </button>
    );
}