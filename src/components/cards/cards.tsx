'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Eye, ShoppingCart, User } from 'lucide-react'
import { CardRarity } from '@/types/database.helper'

// ── RARITY CONFIG ──────────────────────────────────────────
const rarityConfig: Record<string, {
    badge: string
    border: string
    glow: string
    label: string
}> = {
    UR:  { badge: 'text-yellow-300 border-yellow-400/50 bg-yellow-400/15',  border: 'group-hover:border-yellow-400/60',  glow: 'group-hover:shadow-yellow-400/25',  label: 'text-yellow-300'  },
    SSR: { badge: 'text-purple-300 border-purple-400/50 bg-purple-400/15',  border: 'group-hover:border-purple-400/60',  glow: 'group-hover:shadow-purple-400/25',  label: 'text-purple-300'  },
    SR:  { badge: 'text-blue-300   border-blue-400/50   bg-blue-400/15',    border: 'group-hover:border-blue-400/60',    glow: 'group-hover:shadow-blue-400/25',    label: 'text-blue-300'    },
    R:   { badge: 'text-emerald-300 border-emerald-400/50 bg-emerald-400/15', border: 'group-hover:border-emerald-400/60', glow: 'group-hover:shadow-emerald-400/25', label: 'text-emerald-300' },
    N:   { badge: 'text-gray-400   border-gray-500/50   bg-gray-500/15',    border: 'group-hover:border-gray-500/40',    glow: 'group-hover:shadow-gray-500/10',    label: 'text-gray-400'    },
}

// ── PROPS ──────────────────────────────────────────────────
interface CardProps {
    // Core
    id: string
    name: string
    front_image_url: string | null
    rarity: CardRarity
    group_name: string | null
    release_title?: string | null
    distribution_type?: string | null
    physical_types?: { name: string | null }[]
    idols?: { stage_name: string }[]

    // Layout
    width?: string          // default: 'w-full'
    asLink?: boolean        // default: false — use true for browse/collection pages
    type?: 'collection' | 'browse'

    // Browse mode
    onWishlist?: (e: React.MouseEvent) => void

    // Admin mode
    isSelected?: boolean
    onSelect?: () => void
    onInspect?: () => void
    submittedBy?: string | null
}

export default function Card({
    id,
    name,
    front_image_url,
    rarity,
    group_name,
    release_title,
    distribution_type,
    physical_types = [],
    idols = [],
    width = 'w-full',
    asLink = false,
    type = 'browse',
    onWishlist,
    isSelected = false,
    onSelect,
    onInspect,
    submittedBy,
}: CardProps) {
    const [isImageReady, setIsImageReady] = useState(false)
    const rc = rarityConfig[rarity] ?? rarityConfig['N']
    const idolNames = idols.map(i => i.stage_name.replace(/\(.*?\)/g, '')).join(' · ') || null
    const isAdminMode = !!(onSelect || onInspect || submittedBy)

    // ── IMAGE BLOCK ────────────────────────────────────────
    const imageBlock = (
        <div className={`
            relative w-full aspect-[2/3] overflow-hidden rounded-2xl bg-[#161B22]
            border transition-all duration-300 ease-out
            ${isSelected
                ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-[0.98]'
                : `border-white/10 ${rc.border} group-hover:-translate-y-1 group-hover:shadow-2xl ${rc.glow}`
            }
        `}>
            {/* Image */}
            {front_image_url ? (
                <>
                    <Image
                        src={front_image_url}
                        alt={name}
                        fill
                        className={`
                            object-cover transition-all duration-700 ease-in-out group-hover:scale-105
                            ${isImageReady ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}
                        `}
                        onLoad={() => setIsImageReady(true)}
                    />
                    {!isImageReady && <div className="absolute inset-0 bg-gray-800 animate-pulse" />}
                </>
            ) : (
                <div className="w-full h-full bg-[#0B0E11] flex items-center justify-center">
                    <span className="text-[10px] font-bold uppercase text-gray-600 tracking-widest">No Image</span>
                </div>
            )}

            {/* Rarity Badge — top left */}
            <div className="absolute top-2.5 left-2.5 z-30">
                <span className={`text-[10px] px-2.5 py-1 rounded-full font-black uppercase tracking-widest backdrop-blur-md border ${rc.badge}`}>
                    {rarity}
                </span>
            </div>

            {/* Distribution Badge — top right (browse mode) */}
            {!isAdminMode && distribution_type && (
                <div className="absolute top-2.5 right-2.5 z-30">
                    <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border bg-black/50 text-white/70 border-white/10">
                        {distribution_type}
                    </span>
                </div>
            )}

            {/* Admin — Selection checkmark top right */}
            {isAdminMode && (
                <div className={`
                    absolute top-2.5 right-2.5 z-30
                    h-7 w-7 rounded-full flex items-center justify-center
                    border shadow-lg transition-all duration-200
                    ${isSelected
                        ? 'bg-purple-500 border-purple-400 scale-100'
                        : 'bg-black/50 border-white/30 scale-0 group-hover:scale-100'
                    }
                `}>
                    {isSelected && <Check className="h-4 w-4 text-white stroke-[3]" />}
                </div>
            )}

            {/* Admin — Inspect button below checkmark */}
            {onInspect && (
                <button
                    onClick={(e) => { e.stopPropagation(); e.preventDefault(); onInspect() }}
                    className="
                        absolute top-11 right-2.5 z-30
                        h-7 w-7 rounded-full bg-black/60 border border-white/20
                        flex items-center justify-center text-white backdrop-blur-sm
                        opacity-0 group-hover:opacity-100 transition-all duration-200
                        hover:bg-white hover:text-black hover:scale-110 shadow-lg
                    "
                    title="Inspect"
                >
                    <Eye className="h-3.5 w-3.5" />
                </button>
            )}

            {/* Physical type badges — hover only (browse mode) */}
            {!isAdminMode && physical_types.length > 0 && (
                <div className="absolute top-9 left-2.5 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                    {physical_types.map((pt, i) => (
                        <span key={i} className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border bg-white/10 text-white/60 border-white/10 w-fit">
                            {pt.name}
                        </span>
                    ))}
                </div>
            )}

            {/* Browse — Wishlist button bottom right */}
            {!isAdminMode && (
                <button
                    onClick={(e) => { e.preventDefault(); onWishlist?.(e) }}
                    className="
                        absolute bottom-2.5 right-2.5 z-30
                        h-8 w-8 flex items-center justify-center rounded-xl
                        bg-pink-600 hover:bg-pink-500 text-white
                        transition-all duration-200 hover:scale-110 active:scale-95
                        shadow-lg shadow-pink-900/50
                        opacity-0 group-hover:opacity-100
                        translate-y-1 group-hover:translate-y-0
                    "
                >
                    <ShoppingCart className="h-3.5 w-3.5" />
                </button>
            )}

            {/* Gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20 mix-blend-overlay" />
        </div>
    )

    // ── TEXT BLOCK ─────────────────────────────────────────
    const textBlock = (
        <div className="pt-2.5 px-0.5 flex flex-col gap-0.5">
            {/* Group + Era */}
            <div className="flex items-center gap-1.5 overflow-hidden">
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest truncate shrink-0">
                    {group_name ?? '—'}
                </span>
                {release_title && (
                    <>
                        <span className="text-white/20 text-[10px] shrink-0">/</span>
                        <span className="text-[10px] text-white/40 truncate">{release_title}</span>
                    </>
                )}
            </div>

            {/* Card name */}
            <h3 title={name} className="text-sm font-black text-white truncate leading-tight tracking-tight">
                {name || 'Card Variant'}
            </h3>

            {/* Idol names + rarity / submitter */}
            <div className="flex items-center justify-between gap-2">
                {idolNames && (
                    <p className={`text-[11px] truncate ${rc.label}`} title={idolNames}>
                        {idolNames}
                    </p>
                )}

                {/* Browse — rarity label */}
                {!isAdminMode && (
                    <span className={`text-[10px] font-black uppercase tracking-widest shrink-0 ${rc.label}`}>
                        {rarity}
                    </span>
                )}

                {/* Admin — submitter tag */}
                {isAdminMode && submittedBy && (
                    <div className="flex shrink-0 items-center gap-1 text-[9px] text-gray-500 bg-white/5 px-1.5 py-0.5 rounded-md border border-white/5">
                        <User className="h-2.5 w-2.5" />
                        <span className="truncate max-w-[60px]">{submittedBy}</span>
                    </div>
                )}
            </div>
        </div>
    )

    // ── WRAPPER ────────────────────────────────────────────
    const wrapperClass = `group relative flex flex-col ${width} flex-shrink-0 cursor-pointer`

    if (asLink) {
        return (
            <Link href={`/${type}/${id}`} className={wrapperClass}>
                {imageBlock}
                {textBlock}
            </Link>
        )
    }

    return (
        <div onClick={onSelect} className={wrapperClass}>
            {imageBlock}
            {textBlock}
        </div>
    )
}