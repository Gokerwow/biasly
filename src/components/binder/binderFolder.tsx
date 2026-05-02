'use client'

import { COLOR_THEMES, ROUTES } from "@/constants"
import { getOptimizedImageUrl } from "@/helper/cloudinary"
import { Binder } from "@/types"
import { Globe, Lock, MoreVertical, Sparkles, Star } from "lucide-react"
import Image from "next/image"
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useRouter } from "next/navigation"
import { pinUserBinder } from "@/actions/binder_actions"
import { useToast } from "@/app/providers/toastProvider"
import Link from "next/link"

interface BinderFolderProps {
    isPreview?: boolean
    binder: Binder
    onTogglePinned?: () => void
}

export function BinderFolder({ binder, isPreview = false, onTogglePinned }: BinderFolderProps) {
    const router = useRouter()
    const { showToast } = useToast()

    const selectedTheme = COLOR_THEMES.find(theme => theme.id === binder.theme_color) || COLOR_THEMES[0]
    const [isPinned, setIsPinned] = useState(binder.is_pinned ?? false)

    const handleTogglePinned = async (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsPinned(!isPinned)
        const result = await pinUserBinder(!isPinned, binder.id)

        if (result?.error) {
            console.error('Error at pinning binder payload: ', result?.error)
            showToast('Failed to pinning binder', 'error')
        } else {
            showToast('Binder Pinned', 'success')
        }
    }

    const handleRedirect = () => {
        const url = ROUTES.BINDER.DETAIL.replace(':id', binder.id)
        router.push(url)
    }

    return (
        <Link href={ROUTES.BINDER.DETAIL.replace(':id', binder.id)}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="group"
                onClick={handleRedirect}
            >
                {/* Preview Label */}
                {isPreview &&
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-700"></div>
                        <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                            Live Preview
                        </span>
                        <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-700"></div>
                    </div>
                }
                {/* Binder Mockup */}
                <div className="relative aspect-[3/4] max-w-md mx-auto cursor-pointer">
                    {/* Shadow - Enhanced on Hover */}
                    <div
                        className="absolute inset-0 rounded-[3rem] blur-2xl opacity-60 scale-105 transition-all duration-500 group-hover:opacity-80 group-hover:blur-3xl group-hover:scale-110"
                        style={{
                            background: `linear-gradient(to bottom right, ${selectedTheme.color}40, #000000)`
                        }}
                    />
                    {/* Binder Body */}
                    <div
                        className="relative h-full rounded-[2.5rem] overflow-hidden border-2 bg-[#0B0E11] shadow-2xl transition-all duration-500 group-hover:-translate-y-3"
                        style={{
                            borderColor: 'rgb(31, 41, 55)', // default gray-800
                            '--hover-border-color': `${selectedTheme.color}66`, // 40% opacity
                        } as React.CSSProperties}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${selectedTheme.color}66`
                            e.currentTarget.style.boxShadow = `0 20px 60px -15px ${selectedTheme.color}4D`
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = 'rgb(31, 41, 55)'
                            e.currentTarget.style.boxShadow = ''
                        }}
                    >
                        {/* Cover Image */}
                        <div className="absolute inset-0">
                            {binder.cover_url ? (
                                <Image
                                    src={getOptimizedImageUrl(binder.cover_url)}
                                    alt="Binder Cover"
                                    fill
                                    className="object-cover opacity-40 transition-all duration-1000 group-hover:scale-110 group-hover:opacity-60"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                            )}
                        </div>
                        {/* Theme Overlay */}
                        <div
                            className="absolute inset-0 opacity-80"
                            style={{
                                background: `linear-gradient(to top, ${selectedTheme.color}80, rgba(0,0,0,0.6) 50%, transparent)`
                            }}
                        />
                        {/* Ring Holes */}
                        <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-[2px] border-r border-white/10">
                            {[...Array(6)].map((_, i) => (
                                <div
                                    key={i}
                                    className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black/80 border border-white/20 shadow-inner"
                                    style={{ top: `${15 + i * 14}%` }}
                                />
                            ))}
                        </div>
                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                            {/* Top Section: Privacy Badge & Star */}
                            <div className="flex justify-between items-start">
                                {/* Privacy Badge */}
                                {binder.is_public ? (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                                        <Globe className="h-3 w-3 text-emerald-400" />
                                        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                            Public
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/80 backdrop-blur-md border border-gray-700">
                                        <Lock className="h-3 w-3 text-gray-400" />
                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                            Private
                                        </span>
                                    </div>
                                )}
                                {/* Pinned Star - Toggleable */}
                                <button
                                    onClick={handleTogglePinned}
                                    className="transition-all duration-300 hover:scale-110"
                                >
                                    <Star
                                        className={`h-5 w-5 transition-all duration-300 ${isPinned
                                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                                            : 'text-gray-500 hover:text-yellow-400/60'
                                            }`}
                                    />
                                </button>
                            </div>
                            {/* Bottom Section: Title */}
                            <div>
                                <div className="mb-3">
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                        <Sparkles className="h-3 w-3 text-white" />
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                            {selectedTheme.name}
                                        </span>
                                    </div>
                                </div>
                                <h2
                                    className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-3 drop-shadow-lg transition-colors duration-300"
                                    style={{
                                        '--hover-text-color': selectedTheme.color,
                                    } as React.CSSProperties}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.color = selectedTheme.color
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.color = 'white'
                                    }}
                                >
                                    {binder.name || 'My Collection'}
                                </h2>
                                {binder.description && (
                                    <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-3 drop-shadow-md">
                                        {binder.description}
                                    </p>
                                )}
                            </div>
                        </div>
                        {/* Spine Highlight */}
                        <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
                        {/* Hover Options Overlay - Moved to Bottom Right */}
                        <button className="absolute bottom-6 right-6 z-20 p-2 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40 hover:scale-110">
                            <MoreVertical className="h-5 w-5 text-white" />
                        </button>
                    </div>
                    {/* 3D Edge */}
                    <div className="absolute right-0 top-4 bottom-4 w-3 bg-gradient-to-l from-black/40 to-transparent rounded-r-3xl -mr-3 -z-10 transition-all duration-500 group-hover:w-4" />
                </div>
            </motion.div>
        </Link>
    )
}