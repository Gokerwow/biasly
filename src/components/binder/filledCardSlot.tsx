'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Repeat, AlertTriangle, Eye, X, Sparkles, Heart, Lock } from 'lucide-react'
import { CardRarity } from '@/types/database.helper'
import { rarityConfig } from '@/constants'
import { getOptimizedImageUrl } from '@/helper/cloudinary'

export type CardCollectionStatus = 'OWNED' | 'WISHLIST' | 'UNACQUIRED'

interface BinderFilledSlotProps {
    collectionId: string | number
    frontImage: string
    backImage?: string | null
    rarity: CardRarity
    isDoubleSided?: boolean
    condition?: string | null
    cardName?: string
    idolName?: string[]
    status?: CardCollectionStatus
    onClick?: () => void
    onRemove?: () => void
}

export const BinderFilledSlot = ({
    collectionId,
    frontImage,
    backImage,
    rarity,
    isDoubleSided,
    condition,
    cardName,
    idolName,
    status = 'OWNED',
    onClick,
    onRemove
}: BinderFilledSlotProps) => {
    const [isFlipped, setIsFlipped] = useState(false)
    const [isImageReady, setIsImageReady] = useState(false)

    const rc = rarityConfig[rarity] ?? rarityConfig['N']

    const handleFlip = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsFlipped(!isFlipped)
    }

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        onRemove?.()
    }

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation()
        onClick?.()
    }

    // Only show condition warning if they actually own the card
    const showConditionWarning = status === 'OWNED' && condition && !['mint', 'near mint', 'good'].includes(condition.toLowerCase())

    // Determine visual filters based on status
    const imageFilterClass = status === 'OWNED' 
        ? '' 
        : 'grayscale contrast-125 opacity-50'

    return (
        <div
            className="group relative aspect-[2/3] w-full [perspective:1200px] cursor-pointer"
            aria-label={cardName || "Photocard in binder"}
        >
            {/* Hover Glow Effect - Only show if owned */}
            {status === 'OWNED' && (
                <div className={`absolute -inset-1 rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${rc.glow}`} />
            )}

            {/* --- 3D CARD CONTAINER --- */}
            <div
                className="relative w-full h-full transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.02]"
                style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${isFlipped ? '180deg' : '0deg'})`
                }}
            >
                {/* --- FRONT FACE --- */}
                <div 
                    className={`
                        absolute inset-0 overflow-visible rounded-xl bg-gradient-to-br from-gray-900 to-gray-800
                        border-2 shadow-xl transition-all duration-500
                        ${status === 'OWNED' ? `${rc.border} ${rc.glow}` : 'border-gray-700/50'}
                        ${isFlipped ? 'pointer-events-none' : ''}
                    `}
                    style={{ 
                        backfaceVisibility: 'hidden',
                        transform: 'translateZ(1px)'
                    }}
                >
                    {/* Image Container */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl bg-black">
                        {frontImage ? (
                            <>
                                <Image
                                    src={getOptimizedImageUrl(frontImage)}
                                    alt={cardName || "Photocard"}
                                    fill
                                    loading="lazy"
                                    draggable={false}
                                    className={`
                                        object-cover select-none transition-all duration-700
                                        ${isImageReady ? 'opacity-100 blur-0' : 'opacity-0 blur-xl'}
                                        ${imageFilterClass}
                                        group-hover:scale-105
                                    `}
                                    onLoad={() => setIsImageReady(true)}
                                />
                                {!isImageReady && (
                                    <div className="absolute inset-0 bg-gray-800 animate-pulse" />
                                )}
                            </>
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <span className="text-[10px] font-bold uppercase text-gray-600 tracking-widest">
                                    No Image
                                </span>
                            </div>
                        )}

                        {/* STATUS OVERLAYS */}
                        {status === 'WISHLIST' && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/10">
                                <div className="bg-pink-500/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-pink-400 flex items-center gap-1.5 shadow-[0_0_20px_rgba(236,72,153,0.6)]">
                                    <Heart className="h-4 w-4 text-white fill-white animate-pulse" />
                                    <span className="text-xs font-black text-white uppercase tracking-widest">WTB</span>
                                </div>
                            </div>
                        )}

                        {status === 'UNACQUIRED' && (
                            <div className="absolute inset-0 flex items-center justify-center z-20 bg-black/20">
                                <div className="bg-gray-900/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-gray-600 flex items-center gap-1.5">
                                    <Lock className="h-3.5 w-3.5 text-gray-400" />
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Missing</span>
                                </div>
                            </div>
                        )}

                        {/* Protective Sleeve Shine */}
                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                        
                        {/* Top Gloss */}
                        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                    </div>

                    {/* Rarity Corner Badge */}
                    <div className="absolute top-0 right-0 z-30 opacity-90">
                        <div className={`
                            px-2 py-1 rounded-bl-lg rounded-tr-xl backdrop-blur-md shadow-lg
                            border-b border-l border-t-2 border-r-2
                            transition-all duration-300
                            ${status === 'OWNED' ? `${rc.badge} ${rc.border}` : 'bg-gray-800/80 border-gray-600 text-gray-400'}
                        `}>
                            <div className="flex items-center gap-1">
                                <Sparkles className="h-2.5 w-2.5" />
                                <span className="text-[9px] font-black uppercase tracking-wider">
                                    {rarity}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Condition Warning (Only for Owned) */}
                    {showConditionWarning && (
                        <div className="absolute top-2 left-2 z-30 opacity-90 group-hover:opacity-100 transition-opacity" title={`Condition: ${condition}`}>
                            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-orange-500/90 border border-orange-400/50 backdrop-blur-sm shadow-lg">
                                <AlertTriangle className="h-3 w-3 text-white" />
                                <span className="text-[9px] font-bold text-white uppercase tracking-wide">
                                    {condition}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Hover Action Buttons */}
                    <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 px-2 z-30">
                        <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-2xl">
                            {onClick && (
                                <button onClick={handleView} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-110 transition-all" title="View details">
                                    <Eye className="h-3.5 w-3.5" />
                                </button>
                            )}
                            {isDoubleSided && backImage && (
                                <button onClick={handleFlip} className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white hover:scale-110 transition-all" title="Flip card">
                                    <Repeat className="h-3.5 w-3.5" />
                                </button>
                            )}
                            {onRemove && (
                                <button onClick={handleRemove} className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white hover:scale-110 transition-all" title="Remove from binder">
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Card Info Label */}
                    {(cardName || idolName) && (
                        <div className="absolute -bottom-2 left-0 right-0 translate-y-0 group-hover:-translate-y-14 opacity-0 group-hover:opacity-100 transition-all duration-300 z-20 px-2">
                            <div className="bg-gradient-to-t from-black/95 to-black/80 backdrop-blur-md rounded-lg px-3 py-2 border border-white/10 shadow-xl">
                                {idolName && idolName?.length > 0 && (
                                    <p className={`text-[10px] font-bold uppercase tracking-wide truncate ${status === 'OWNED' ? 'text-pink-400' : 'text-gray-400'}`}>
                                        {idolName.join(', ')}
                                    </p>
                                )}
                                {cardName && (
                                    <p className="text-[11px] font-semibold text-white truncate leading-tight mt-0.5">
                                        {cardName}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Sleeve Edge Effects */}
                    <div className="absolute inset-0 pointer-events-none rounded-xl">
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-white/10 rounded-tl-xl" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-white/10 rounded-br-xl" />
                        <div className="absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), inset 0 -1px 0 0 rgba(0,0,0,0.2)' }} />
                    </div>
                </div>

                {/* --- BACK FACE --- */}
                {isDoubleSided && backImage && (
                    <div 
                        className={`
                            absolute inset-0 overflow-visible rounded-xl bg-gradient-to-br from-gray-900 to-gray-800
                            border-2 shadow-xl
                            ${status === 'OWNED' ? `${rc.border} ${rc.glow}` : 'border-gray-700/50'}
                            ${!isFlipped ? 'pointer-events-none' : ''}
                        `}
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg) translateZ(1px)' }}
                    >
                        <div className="absolute inset-0 overflow-hidden rounded-xl bg-black">
                            <Image
                                src={getOptimizedImageUrl(backImage)}
                                alt={`${cardName} (back)` || "Photocard back"}
                                fill
                                loading="lazy"
                                draggable={false}
                                className={`object-cover select-none group-hover:scale-105 transition-transform duration-700 ${imageFilterClass}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent opacity-50 pointer-events-none" />
                        </div>
                        
                        {/* Rarity Corner Badge (Mirrored) */}
                        <div className="absolute top-0 left-0 z-30 opacity-90">
                            <div className={`
                                px-2 py-1 rounded-br-lg rounded-tl-xl backdrop-blur-md shadow-lg
                                border-b border-r border-t-2 border-l-2
                                transition-all duration-300
                                ${status === 'OWNED' ? `${rc.badge} ${rc.border}` : 'bg-gray-800/80 border-gray-600 text-gray-400'}
                            `}>
                                <div className="flex items-center gap-1">
                                    <Sparkles className="h-2.5 w-2.5" />
                                    <span className="text-[9px] font-black uppercase tracking-wider">{rarity}</span>
                                </div>
                            </div>
                        </div>

                        {/* Back Face Buttons */}
                        <div className="absolute bottom-2 left-0 right-0 flex items-center justify-center opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 px-2 z-30">
                            <div className="flex items-center gap-1.5 bg-black/80 backdrop-blur-md rounded-full p-1 border border-white/10 shadow-2xl">
                                {onClick && (
                                    <button onClick={handleView} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:scale-110 transition-all">
                                        <Eye className="h-3.5 w-3.5" />
                                    </button>
                                )}
                                <button onClick={handleFlip} className="p-2 rounded-full bg-blue-500/80 hover:bg-blue-500 text-white hover:scale-110 transition-all">
                                    <Repeat className="h-3.5 w-3.5" />
                                </button>
                                {onRemove && (
                                    <button onClick={handleRemove} className="p-2 rounded-full bg-red-500/80 hover:bg-red-500 text-white hover:scale-110 transition-all">
                                        <X className="h-3.5 w-3.5" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="absolute inset-0 pointer-events-none rounded-xl">
                            <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-white/10 rounded-tr-xl" />
                            <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-white/10 rounded-bl-xl" />
                            <div className="absolute inset-0 rounded-xl" style={{ boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), inset 0 -1px 0 0 rgba(0,0,0,0.2)' }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}