'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Eye, User } from 'lucide-react'
import { CardRarity } from '@/types/database.helper'
import { SimpleIdol } from '@/types'
import { CardActionBar } from './cardActionBar'
import { priorityConfig, rarityConfig } from '@/constants'

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
    idols?: SimpleIdol[]
    priority?: 'high' | 'medium' | 'low' | null

    // Layout
    width?: string          // default: 'w-full'
    asLink?: boolean        // default: false — use true for browse/collection pages
    type?: 'collection' | 'browse'

    // Browse mode
    isInWishlist?: boolean
    isInCollection?: boolean

    // Admin mode
    isSelected?: boolean
    onSelect?: () => void
    onInspect?: () => void
    submittedBy?: string | null
}

export default function CardItem({
    id,
    name,
    front_image_url,
    rarity,
    group_name,
    release_title,
    distribution_type,
    physical_types = [],
    idols = [],
    priority,
    width = 'w-full',
    asLink = false,
    type = 'browse',
    isInWishlist,
    isInCollection,
    isSelected = false,
    onSelect,
    onInspect,
    submittedBy,
}: CardProps) {
    const [isImageReady, setIsImageReady] = useState(false)
    const rc = rarityConfig[rarity] ?? rarityConfig['N']
    const pc = priority ? priorityConfig[priority] : priorityConfig['low']
    const idolNames = idols.map(i => i.stage_name?.replace(/\(.*?\)/g, '')).join(' · ') || null
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

            {priority && (
                <div className="absolute top-0 right-0 z-30 w-20 h-20 overflow-hidden rounded-tr-2xl">
                    <div className={`
                        absolute top-4 -right-1 w-24 py-1
                        rotate-45 text-center
                        text-[8px] font-black uppercase tracking-widest text-white shadow-xl
                        ${pc}
        `} style={{ right: '-22px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                        {priority}
                    </div>
                </div>
            )}

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

            {/* Hover Action Bar — bottom of image, browse mode only */}
            {!isAdminMode && type === 'browse' && (
                <CardActionBar
                    cardID={id}
                    isInCollection={isInCollection ?? false}
                    isInWishlist={isInWishlist ?? false}
                />
            )}

            {/* Gloss overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20 mix-blend-overlay" />
        </div>
    )

    // ── TEXT BLOCK ─────────────────────────────────────────
    const textBlock = (
        <div className="pt-2 px-0.5 flex flex-col gap-1.5">

            {/* Group + Era — one line */}
            <div className="flex items-center gap-1 overflow-hidden">
                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest shrink-0">
                    {group_name ?? '—'}
                </span>
                {release_title && (
                    <>
                        <span className="text-white/20 text-[10px] shrink-0">/</span>
                        <span className="text-[10px] text-white/30 truncate">{release_title}</span>
                    </>
                )}
            </div>

            {/* Card name */}
            <h3 title={name} className="text-sm font-black text-white truncate leading-tight tracking-tight">
                {name || 'Card Variant'}
            </h3>

            {/* Idol names */}
            {idolNames && (
                <p className={`text-[11px] text-gray-500 truncate ${rc.label}`} title={idolNames}>
                    {idolNames}
                </p>
            )}

            {/* Chips row — only secondary metadata, NO rarity (already on image) */}
            {(distribution_type || physical_types.length > 0) && (
                <div className="flex items-center gap-1 flex-wrap">
                    {distribution_type && (
                        <span title={distribution_type} className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border bg-white/5 text-white/40 border-white/8 truncate max-w-[90px]">
                            {distribution_type}
                        </span>
                    )}
                    {physical_types.slice(0, 1).map((pt, i) => (
                        pt.name && (
                            <span key={i} title={pt.name} className="text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wide border bg-white/5 text-white/40 border-white/8">
                                {pt.name}
                            </span>
                        )
                    ))}
                    {physical_types.length > 1 && (
                        <span className="text-[9px] px-1.5 py-0.5 rounded border bg-white/5 text-white/30 border-white/8">
                            +{physical_types.length - 1}
                        </span>
                    )}
                </div>
            )}

            {/* Admin — submitter tag */}
            {isAdminMode && submittedBy && (
                <div className="flex items-center gap-1 text-[9px] text-gray-600 bg-white/5 px-1.5 py-0.5 rounded border border-white/5 w-fit">
                    <User className="h-2.5 w-2.5" />
                    <span className="truncate max-w-[60px]">{submittedBy}</span>
                </div>
            )}
        </div>
    )

    // ── WRAPPER ────────────────────────────────────────────
    const wrapperClass = `group relative flex flex-col ${width} flex-shrink-0 cursor-pointer`

    if (asLink) {
        return (
            <Link href={`/photocard/${id}`} className={wrapperClass}>
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