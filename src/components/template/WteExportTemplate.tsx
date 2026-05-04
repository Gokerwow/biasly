'use client'

import React, { forwardRef } from 'react'
import Image from 'next/image'
import { DollarSign, ArrowLeftRight, Sparkles } from 'lucide-react'
import { FullUserCollections } from '@/types/user_collections'
import { Profile } from '@/types'
import { getOptimizedImageUrl } from '@/helper/cloudinary'

interface WteExportTemplateProps {
    userCollections: FullUserCollections[]
    profile: Profile
    exportType: 'sale' | 'trade' | 'both'
    format?: 'feed' | 'story' | 'wide'
}

export const WteExportTemplate = forwardRef<HTMLDivElement, WteExportTemplateProps>(
    ({ userCollections, profile, exportType, format = 'wide' }, ref) => {
        const saleCards = userCollections.filter(c => c.is_for_sale)
        const tradeCards = userCollections.filter(c => c.is_for_trade)

        const showSale = exportType === 'sale' || exportType === 'both'
        const showTrade = exportType === 'trade' || exportType === 'both'

        const dimensions = {
            feed: 'w-[1080px] h-[1350px]',   // 4:5 aspect ratio
            story: 'w-[1080px] h-[1920px]',  // 9:16 aspect ratio
            wide: 'w-[1200px] min-h-[800px]' // Your original flexible layout
        }

        return (
            <div
                ref={ref}
                className={`relative overflow-hidden ${dimensions[format]}`}
                style={{ 
                    background: 'linear-gradient(135deg, #0a0118 0%, #1a0b2e 25%, #2d1b4e 50%, #1a0b2e 75%, #0a0118 100%)',
                }}
            >
                {/* Dynamic Background Elements */}
                <div className="absolute inset-0">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl" 
                        style={{ background: 'radial-gradient(circle, #ff006e 0%, #8338ec 50%, transparent 70%)' }} 
                    />
                    <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full opacity-25 blur-3xl" 
                        style={{ background: 'radial-gradient(circle, #3a86ff 0%, #06ffa5 50%, transparent 70%)' }} 
                    />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 blur-3xl" 
                        style={{ background: 'radial-gradient(circle, #fb5607 0%, #ffbe0b 50%, transparent 70%)' }} 
                    />
                    
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-[0.03]" 
                        style={{ 
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)',
                            backgroundSize: '40px 40px'
                        }}
                    />
                </div>

                <div className="relative z-10 h-full flex flex-col" style={{ padding: '56px' }}>
                    {/* Header Section */}
                    <div className="mb-10">
                        {/* Logo Placeholder */}
                        <div className="flex items-center justify-center mb-8">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 blur-xl opacity-60" />
                                <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl px-8 py-4 shadow-2xl">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 via-purple-400 to-cyan-400 flex items-center justify-center">
                                            <Sparkles className="h-6 w-6 text-white" />
                                        </div>
                                        <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 tracking-tighter">
                                            BIASLY
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Info Card */}
                        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    {profile.avatar_url ? (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl blur-md opacity-60" />
                                            <div className="relative h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/30 shadow-xl">
                                                <Image
                                                    src={profile.avatar_url}
                                                    alt={profile.username || 'User'}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="relative">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500 to-purple-500 rounded-2xl blur-md opacity-60" />
                                            <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center border-2 border-white/30 shadow-xl">
                                                <span className="text-3xl font-black text-white">
                                                    {profile.username?.charAt(0).toUpperCase() || 'U'}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    <div>
                                        <h2 className="text-4xl font-black text-white tracking-tight mb-1">
                                            {profile.username || 'Collector'}
                                        </h2>
                                        <p className="text-base text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-purple-300 font-bold uppercase tracking-wide">
                                            {exportType === 'both' ? '💎 Trading & Selling' :
                                                exportType === 'sale' ? '💰 For Sale' : '🔄 For Trade'}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Pills */}
                                <div className="flex flex-col gap-2">
                                    {showSale && saleCards.length > 0 && (
                                        <div className="backdrop-blur-md bg-emerald-400/20 border border-emerald-300/30 rounded-full px-5 py-2.5 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
                                                    <DollarSign className="h-4 w-4 text-emerald-950" />
                                                </div>
                                                <span className="text-lg font-black text-emerald-50">
                                                    {saleCards.length}
                                                </span>
                                                <span className="text-sm font-bold text-emerald-200 uppercase">
                                                    Sale
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                    {showTrade && tradeCards.length > 0 && (
                                        <div className="backdrop-blur-md bg-cyan-400/20 border border-cyan-300/30 rounded-full px-5 py-2.5 shadow-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-cyan-400 flex items-center justify-center">
                                                    <ArrowLeftRight className="h-4 w-4 text-cyan-950" />
                                                </div>
                                                <span className="text-lg font-black text-cyan-50">
                                                    {tradeCards.length}
                                                </span>
                                                <span className="text-sm font-bold text-cyan-200 uppercase">
                                                    Trade
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area - Flex grows to fill space */}
                    <div className="flex-1 overflow-hidden">
                        {/* Cards Grid - For Sale */}
                        {showSale && saleCards.length > 0 && (
                            <div className="mb-8">
                                <div className="backdrop-blur-md bg-white/5 border border-emerald-400/20 rounded-2xl p-5 shadow-xl mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center shadow-lg">
                                            <DollarSign className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-green-300 uppercase tracking-tight">
                                            For Sale
                                        </h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-8 gap-3">
                                    {saleCards.slice(0, 24).map((collection) => {
                                        if (!collection.photocards) return null
                                        return (
                                            <ExportCardItem
                                                key={collection.id}
                                                frontImageUrl={collection.photocards.front_image_url}
                                                name={collection.photocards.name}
                                                groupName={collection.photocards.group?.name}
                                                type="sale"
                                            />
                                        )
                                    })}
                                </div>
                                {saleCards.length > 24 && (
                                    <div className="mt-4 text-center">
                                        <div className="inline-block backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-2">
                                            <p className="text-sm text-emerald-300 font-bold">
                                                +{saleCards.length - 24} more available
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Cards Grid - For Trade */}
                        {showTrade && tradeCards.length > 0 && (
                            <div>
                                <div className="backdrop-blur-md bg-white/5 border border-cyan-400/20 rounded-2xl p-5 shadow-xl mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                                            <ArrowLeftRight className="h-5 w-5 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-300 uppercase tracking-tight">
                                            For Trade
                                        </h3>
                                    </div>
                                </div>
                                <div className="grid grid-cols-8 gap-3">
                                    {tradeCards.slice(0, 24).map((collection) => {
                                        if (!collection.photocards) return null
                                        return (
                                            <ExportCardItem
                                                key={collection.id}
                                                frontImageUrl={collection.photocards.front_image_url}
                                                name={collection.photocards.name}
                                                groupName={collection.photocards.group?.name}
                                                type="trade"
                                            />
                                        )
                                    })}
                                </div>
                                {tradeCards.length > 24 && (
                                    <div className="mt-4 text-center">
                                        <div className="inline-block backdrop-blur-md bg-white/5 border border-white/10 rounded-full px-5 py-2">
                                            <p className="text-sm text-cyan-300 font-bold">
                                                +{tradeCards.length - 24} more available
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Empty State */}
                    {((showSale && saleCards.length === 0 && !showTrade) ||
                        (showTrade && tradeCards.length === 0 && !showSale) ||
                        (showSale && showTrade && saleCards.length === 0 && tradeCards.length === 0)) && (
                            <div className="flex-1 flex flex-col items-center justify-center py-20">
                                <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl p-10 shadow-2xl">
                                    <div className="flex flex-col items-center">
                                        <div className="relative mb-6">
                                            <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl blur-xl" />
                                            <div className="relative rounded-2xl bg-white/5 p-8 border border-white/10">
                                                {exportType === 'sale' ? (
                                                    <DollarSign className="h-16 w-16 text-gray-400" />
                                                ) : (
                                                    <ArrowLeftRight className="h-16 w-16 text-gray-400" />
                                                )}
                                            </div>
                                        </div>
                                        <p className="text-xl text-gray-300 text-center font-bold">
                                            No cards marked for {exportType === 'both' ? 'trading or selling' : exportType}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Footer */}
                    <div className="mt-auto pt-6">
                        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl px-6 py-4 shadow-xl">
                            <p className="text-sm text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300 font-bold uppercase tracking-widest">
                                ✨ Made with Biasly • Your K-Pop Collection Hub
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
)

WteExportTemplate.displayName = 'WteExportTemplate'

// Mini card component for export
interface ExportCardItemProps {
    frontImageUrl: string | null
    name: string
    groupName?: string | null
    type: 'sale' | 'trade'
}

function ExportCardItem({ frontImageUrl, name, groupName, type }: ExportCardItemProps) {
    return (
        <div className="relative group">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
                {/* Glow effect */}
                <div className={`absolute inset-0 -z-10 blur-lg opacity-0 group-hover:opacity-60 transition-opacity ${type === 'sale' ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                
                {/* Card border with gradient */}
                <div className={`absolute inset-0 rounded-xl ${type === 'sale' ? 'bg-gradient-to-br from-emerald-400/30 to-green-500/30' : 'bg-gradient-to-br from-cyan-400/30 to-blue-500/30'} p-[2px]`}>
                    <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
                        {frontImageUrl ? (
                            <Image
                                src={getOptimizedImageUrl(frontImageUrl)}
                                alt={name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                                <span className="text-[10px] text-gray-600 uppercase font-bold">No Image</span>
                            </div>
                        )}

                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                        {/* Badge */}
                        <div className="absolute bottom-2 right-2 z-10">
                            {type === 'sale' ? (
                                <div className="backdrop-blur-sm bg-emerald-400/95 border border-emerald-300 rounded-lg px-2 py-1 shadow-lg">
                                    <DollarSign className="h-3 w-3 text-emerald-950" />
                                </div>
                            ) : (
                                <div className="backdrop-blur-sm bg-cyan-400/95 border border-cyan-300 rounded-lg px-2 py-1 shadow-lg">
                                    <ArrowLeftRight className="h-3 w-3 text-cyan-950" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Card info */}
            <div className="mt-2 px-0.5">
                <p className={`text-[10px] font-black uppercase truncate tracking-wide ${type === 'sale' ? 'text-emerald-300' : 'text-cyan-300'}`}>
                    {groupName || '—'}
                </p>
                <p className="text-[11px] text-white font-bold truncate">
                    {name}
                </p>
            </div>
        </div>
    )
}

