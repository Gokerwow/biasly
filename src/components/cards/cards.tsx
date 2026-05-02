'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Check, Eye, Repeat, User, DollarSign, ArrowLeftRight } from 'lucide-react'
import { CardRarity } from '@/types/database.helper'
import { SimpleIdol } from '@/types'
import { CardActionBar } from './cardActionBar'
import { rarityConfig } from '@/constants'
import { PriorityRibbon } from './priorityRibbon'
import { getOptimizedImageUrl } from '@/helper/cloudinary'

interface CardProps {
    // Core
    id: string
    name: string
    front_image_url: string | null
    back_image_url?: string | null
    rarity: CardRarity
    group_name: string | null
    release_title?: string | null
    distribution_type?: string | null
    physical_types?: { name: string | null }[]
    idols?: SimpleIdol[]
    priority?: 'high' | 'medium' | 'low' | null
    wishlistId?: number
    isDoubleSided?: boolean
    isHorizontal?: boolean

    // Layout
    width?: string          // default: 'w-full'
    asLink?: boolean        // default: false — use true for browse/collection pages
    type?: 'collection' | 'browse'

    // Browse mode
    isInWishlist?: boolean
    isInCollection?: boolean

    // Trade & Sale status
    isForSale?: boolean
    isForTrade?: boolean
    onToggleSale?: () => void
    onToggleTrade?: () => void

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
    back_image_url,
    rarity,
    group_name,
    release_title,
    distribution_type,
    physical_types = [],
    idols = [],
    priority,
    wishlistId,
    isDoubleSided,
    isHorizontal,
    width = 'w-full',
    asLink = false,
    type = 'browse',
    isInWishlist,
    isInCollection,
    isForSale = false,
    isForTrade = false,
    onToggleSale,
    onToggleTrade,
    isSelected = false,
    onSelect,
    onInspect,
    submittedBy,
}: CardProps) {
    const [isImageReady, setIsImageReady] = useState(false)
    const [showFront, setShowFront] = useState(true)
    const rc = rarityConfig[rarity] ?? rarityConfig['N']
    const idolNames = idols.map(i => i.stage_name?.replace(/\(.*?\)/g, '')).join(' · ') || null
    const isAdminMode = !!(onSelect || onInspect || submittedBy)
    const showTradeControls = type === 'collection' && (onToggleSale || onToggleTrade)

    const handleFlip = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        setShowFront(!showFront)
    }

    const handleSaleToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        onToggleSale?.()
    }

    const handleTradeToggle = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.stopPropagation()
        e.preventDefault()
        onToggleTrade?.()
    }

    // ── IMAGE BLOCK ────────────────────────────────────────
    const frontImageBlock = (
        <div className={`absolute inset-0 overflow-hidden rounded-2xl `} style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(0deg)' }}>

            {priority && wishlistId && (
                <PriorityRibbon priority={priority} wishlistId={wishlistId} />
            )}

            {/* Sale/Trade Status Badges - bottom left corner */}
            {(isForSale || isForTrade) && (
                <div className="absolute bottom-2.5 left-2.5 z-20 flex flex-col gap-1">
                    {isForSale && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 border border-emerald-400 backdrop-blur-sm shadow-lg">
                            <DollarSign className="h-3 w-3 text-white" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Sale</span>
                        </div>
                    )}
                    {isForTrade && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/90 border border-blue-400 backdrop-blur-sm shadow-lg">
                            <ArrowLeftRight className="h-3 w-3 text-white" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Trade</span>
                        </div>
                    )}
                </div>
            )}

            {/* Image */}
            {front_image_url ? (
                <>
                    <Image
                        src={getOptimizedImageUrl(front_image_url)}
                        alt={name}
                        fill
                        loading="lazy"
                        draggable={false}
                        className={`
                            object-cover transition-all duration-700 ease-in-out select-none group-hover:scale-105
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

            {isDoubleSided && (
                <button
                    onClick={(e) => handleFlip(e)}
                    className="
                        absolute top-2.5 right-2.5 z-40 cursor-pointer
                        h-8 w-8 rounded-full bg-black/60 border border-white/20
                        flex items-center justify-center text-white backdrop-blur-sm
                        opacity-0 group-hover:opacity-100 transition-all duration-200
                        hover:bg-white hover:text-black hover:scale-110 shadow-lg
                    "
                >
                    <Repeat className="h-4 w-4" />
                </button>
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

            {/* Collection Mode: Trade/Sale Controls — bottom of image */}
            {showTradeControls && (
                <div className="absolute bottom-0 left-0 right-0 z-30 p-2.5 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="flex items-center justify-center gap-2">
                        {onToggleSale && (
                            <button
                                onClick={handleSaleToggle}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs
                                    border transition-all duration-200 shadow-lg
                                    ${isForSale
                                        ? 'bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-600'
                                        : 'bg-black/60 border-white/30 text-white hover:bg-emerald-500 hover:border-emerald-400'
                                    }
                                `}
                                title={isForSale ? "Remove from sale" : "Mark for sale"}
                            >
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>{isForSale ? 'For Sale' : 'Sale'}</span>
                            </button>
                        )}
                        {onToggleTrade && (
                            <button
                                onClick={handleTradeToggle}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs
                                    border transition-all duration-200 shadow-lg
                                    ${isForTrade
                                        ? 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'
                                        : 'bg-black/60 border-white/30 text-white hover:bg-blue-500 hover:border-blue-400'
                                    }
                                `}
                                title={isForTrade ? "Remove from trade" : "Mark for trade"}
                            >
                                <ArrowLeftRight className="h-3.5 w-3.5" />
                                <span>{isForTrade ? 'For Trade' : 'Trade'}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Browse Mode: Hover Action Bar — bottom of image */}
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
    
    // ── IMAGE BLOCK (BACK) ────────────────────────────────────────
    const backImageBlock = (
        <div className={`absolute inset-0 overflow-hidden rounded-2xl`} style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', WebkitBackfaceVisibility: 'hidden' }}>

            {priority && wishlistId && (
                <PriorityRibbon priority={priority} wishlistId={wishlistId} />
            )}

            {/* Sale/Trade Status Badges - bottom left corner */}
            {(isForSale || isForTrade) && (
                <div className="absolute bottom-2.5 left-2.5 z-20 flex flex-col gap-1">
                    {isForSale && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-500/90 border border-emerald-400 backdrop-blur-sm shadow-lg">
                            <DollarSign className="h-3 w-3 text-white" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Sale</span>
                        </div>
                    )}
                    {isForTrade && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-blue-500/90 border border-blue-400 backdrop-blur-sm shadow-lg">
                            <ArrowLeftRight className="h-3 w-3 text-white" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-white">Trade</span>
                        </div>
                    )}
                </div>
            )}

            {/* Image */}
            {back_image_url ? (
                <>
                    <Image
                        src={getOptimizedImageUrl(back_image_url)}
                        alt={name}
                        fill
                        loading="lazy"
                        draggable={false}
                        className={`
                            object-cover transition-all duration-700 ease-in-out select-none group-hover:scale-105
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

            {isDoubleSided && (
                <button
                    onClick={(e) => handleFlip(e)}
                    className="
                        absolute top-2.5 right-2.5 z-40 cursor-pointer
                        h-8 w-8 rounded-full bg-black/60 border border-white/20
                        flex items-center justify-center text-white backdrop-blur-sm
                        opacity-0 group-hover:opacity-100 transition-all duration-200
                        hover:bg-white hover:text-black hover:scale-110 shadow-lg
                    "
                    title={showFront ? "Show front" : "Show back"}
                >
                    <Repeat className="h-4 w-4" />
                </button>
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

            {/* Collection Mode: Trade/Sale Controls — bottom of image */}
            {showTradeControls && (
                <div className="absolute bottom-0 left-0 right-0 z-30 p-2.5 bg-gradient-to-t from-black/80 via-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <div className="flex items-center justify-center gap-2">
                        {onToggleSale && (
                            <button
                                onClick={handleSaleToggle}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs
                                    border transition-all duration-200 shadow-lg
                                    ${isForSale
                                        ? 'bg-emerald-500 border-emerald-400 text-white hover:bg-emerald-600'
                                        : 'bg-black/60 border-white/30 text-white hover:bg-emerald-500 hover:border-emerald-400'
                                    }
                                `}
                                title={isForSale ? "Remove from sale" : "Mark for sale"}
                            >
                                <DollarSign className="h-3.5 w-3.5" />
                                <span>{isForSale ? 'For Sale' : 'Sale'}</span>
                            </button>
                        )}
                        {onToggleTrade && (
                            <button
                                onClick={handleTradeToggle}
                                className={`
                                    flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-xs
                                    border transition-all duration-200 shadow-lg
                                    ${isForTrade
                                        ? 'bg-blue-500 border-blue-400 text-white hover:bg-blue-600'
                                        : 'bg-black/60 border-white/30 text-white hover:bg-blue-500 hover:border-blue-400'
                                    }
                                `}
                                title={isForTrade ? "Remove from trade" : "Mark for trade"}
                            >
                                <ArrowLeftRight className="h-3.5 w-3.5" />
                                <span>{isForTrade ? 'For Trade' : 'Trade'}</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Browse Mode: Hover Action Bar — bottom of image */}
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
    const wrapperClass = `group relative flex flex-col ${width} flex-shrink-0 cursor-pointer [perspective:1200px]`

    if (asLink) {
        return (
            <div className={wrapperClass}>
                <Link
                    href={`/photocard/${id}`}
                    className="absolute inset-0 z-10 rounded-2xl"
                    prefetch={true}
                >
                    <span className="sr-only">View details for {name}</span>
                </Link>
                <div className={`
                        relative z-20 w-full aspect-[2/3] bg-[#161B22] rounded-2xl
                        border transition-all duration-300 ease-out
                        ${isSelected
                        ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-[0.98]'
                        : `border-white/10 ${rc.border} group-hover:-translate-y-1 group-hover:shadow-2xl ${rc.glow}`
                    }
                    `} style={{ transformStyle: 'preserve-3d', transform: `rotateY(${showFront ? '0deg' : '180deg'})` }}>
                    {frontImageBlock}
                    {backImageBlock}
                </div>
                {textBlock}
            </div>
        )
    }

    return (
        <div onClick={onSelect} className={wrapperClass}>
            <div className={`
                    relative w-full aspect-[2/3] bg-[#161B22] rounded-2xl
                    border transition-all duration-300 ease-out
                    ${isSelected
                    ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-[0.98]'
                    : `border-white/10 ${rc.border} group-hover:-translate-y-1 group-hover:shadow-2xl ${rc.glow}`
                }
                `} style={{ transformStyle: 'preserve-3d', transform: `rotateY(${showFront ? '0deg' : '180deg'})` }}>
                {frontImageBlock}
                {backImageBlock}
            </div>
            {textBlock}
        </div>
    )
}