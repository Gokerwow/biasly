import { Upload, Check, User, Eye } from "lucide-react";
import RarityBadge from "./UI/rarityBadge";
import Image from "next/image";
import { getRarityBorder, getRarityGlow, getRarityText } from "@/helper";
import { CardWithDetail } from "@/app/(main)/dashboard/cards/approve/page";
import { useState } from "react";

interface PrevCardProps {
    // Standard Props
    card: CardWithDetail

    // 🛡️ ADMIN / SELECTION PROPS
    isSelected?: boolean
    onClick?: () => void
    submitted_by?: string | null
    onInspect?: (item: CardWithDetail) => void // 👈 New Prop
}

export default function PrevCard({
    card,
    isSelected = false,
    onClick,
    submitted_by,
    onInspect,
}: PrevCardProps) {
    const [isImageReady, setIsImageReady] = useState(false);

    const borderClass = isSelected
        ? 'border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] scale-[0.98]'
        : `${getRarityBorder(card.rarity)} hover:scale-[1.02]`

    return (
        <div
            onClick={onClick}
            className={`relative z-10 flex flex-col items-center transition-all duration-200 ${onClick ? 'cursor-pointer' : ''}`}
        >
            <div className="relative group perspective-1000 w-full">

                {/* 1. Glow Effect */}
                <div className={`absolute -inset-0.5 blur-xl transition-all duration-500 
                    ${isSelected ? 'opacity-75 bg-purple-500' : `opacity-40 group-hover:opacity-75 ${getRarityGlow(card.rarity)}`}
                `}></div>

                {/* 2. The Main Card Container */}
                <div className={`relative mx-auto aspect-[2/3] w-full min-w-[160px] overflow-hidden rounded-xl border-[3px] transition-all duration-300 ease-out bg-gray-900 shadow-2xl ${borderClass}`}>

                    {/* IMAGE */}
                    {card.image_url ? (
                        <>
                            <Image
                                src={card.image_url}
                                alt={card.name}
                                fill
                                className={`object-cover transition-all duration-700 ease-in-out
                                    ${isImageReady ? 'opacity-100 scale-100 blur-0' : 'opacity-0 scale-110 blur-xl'}
                                `}
                                onLoad={() => setIsImageReady(true)}
                            />

                            {!isImageReady && (
                                <div className="absolute inset-0 bg-gray-800 animate-pulse flex flex-col items-center justify-center z-0">
                                    <div className="h-8 w-8 text-gray-600 animate-spin">
                                        {/* You can use a spinner or your logo here */}
                                        <Upload className="h-full w-full opacity-50" />
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        // Fallback if no URL provided at all
                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0E11]">
                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
                            <Upload className="mb-3 h-10 w-10 text-gray-700 animate-pulse" />
                            <span className="text-[10px] font-bold uppercase text-gray-600 tracking-widest">Awaiting Data</span>
                        </div>
                    )}

                    {/* Gloss Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20 mix-blend-overlay"></div>

                    {/* 🛡️ ACTIONS CONTAINER (Top Left) */}
                    <div className="absolute top-2 left-2 z-40 flex flex-col gap-2">

                        {/* A. Selection Checkmark */}
                        {(isSelected || onClick) && (
                            <div className={`h-7 w-7 rounded-full flex items-center justify-center transition-all duration-200 border shadow-lg ${isSelected
                                    ? 'bg-purple-500 border-purple-400 scale-100'
                                    : 'bg-black/50 border-white/30 scale-0 group-hover:scale-100'
                                }`}>
                                {isSelected && <Check className="h-4 w-4 text-white stroke-[3]" />}
                            </div>
                        )}

                        {/* B. 👁️ Inspect Button (New) */}
                        {onInspect && (
                            <button
                                onClick={(e) => { e.stopPropagation(); onInspect(card); }}
                                className="h-7 w-7 rounded-full bg-black/60 border border-white/30 flex items-center justify-center text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black hover:scale-110 shadow-lg"
                                title="Inspect Details"
                            >
                                <Eye className="h-4 w-4" />
                            </button>
                        )}
                    </div>

                    {/* Rarity Badge (Top Right) */}
                    <div className="absolute top-2 right-2 z-30">
                        <RarityBadge tier={card.rarity} />
                    </div>

                    {/* 3. INFO FOOTER */}
                    <div className="absolute bottom-0 left-0 w-full z-30">
                        <div className="h-12 w-full bg-gradient-to-t from-black/90 to-transparent"></div>
                        <div className={`backdrop-blur-md px-4 py-3 border-t transition-colors ${isSelected ? 'bg-purple-900/80 border-purple-500/50' : 'bg-black/80 border-white/10'
                            }`}>
                            <div className="flex flex-col">
                                {/* Card Name */}
                                <h4 className={`text-sm md:text-base font-black italic leading-none uppercase tracking-tighter drop-shadow-lg truncate ${getRarityText(card.rarity)}`}>
                                    {card.name || 'Card Variant'}
                                </h4>

                                {/* Idol / Group Name */}
                                <div className="mt-1 flex items-center justify-between">
                                    <p className="text-[10px] md:text-xs font-bold text-white truncate max-w-[120px]">
                                        {card.subject_category === 'Solo' ? (card.idols?.stage_name || 'IDOL') :
                                            card.subject_category === 'Unit' ? (card.unit_names?.map(i => i?.name).join(', ') || 'UNIT') :
                                                'GROUP'}
                                    </p>

                                    {/* Admin User Tag */}
                                    {submitted_by ? (
                                        <div className="flex items-center gap-1 text-[9px] text-gray-400 bg-black/40 px-1.5 py-0.5 rounded-md border border-white/5">
                                            <User className="h-2.5 w-2.5" />
                                            <span className="truncate max-w-[60px]">{card.profiles?.username}</span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-0.5">
                                            <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                            <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                                            <div className="h-1 w-1 rounded-full bg-gray-700"></div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}