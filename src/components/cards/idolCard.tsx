"use client"

import { getOptimizedImageUrl } from "@/helper/cloudinary"
import { ChevronRight, Heart, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

// 1. Updated Interface to match your JSON data structure exactly
export interface IdolGroup {
    groups: {
        id: string
        name: string
    }
}

export interface IdolData {
    id: string
    stage_name: string
    slug: string
    image_url: string
    native_name: string | null
    real_name: string
    idol_groups: IdolGroup[]
    // Kept these optional in case you join them later in your SQL query
    card_count?: number 
    is_favorite?: boolean
}

interface IdolCardProps {
    idol: IdolData
    onFavoriteToggle?: (id: string) => void
}

export function IdolCard({ idol, onFavoriteToggle }: IdolCardProps) {
    // Safely extract and join group names (e.g., handles idols in multiple groups like Xiumin)
    const groupNames = idol.idol_groups?.map((g) => g.groups.name).join(", ")

    return (
        <Link
            href={`/idols/${idol.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/15 hover:border-pink-400 dark:hover:border-pink-500"
        >
            {/* Image Container */}
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                    src={getOptimizedImageUrl(idol.image_url, {
                        gravity: 'face',
                        crop: 'fill'
                    }) || '/placeholder.png'}
                    alt={idol.stage_name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Richer Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Favorite Button */}
                {onFavoriteToggle && (
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            onFavoriteToggle(idol.id)
                        }}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all hover:bg-black/60 hover:scale-110"
                    >
                        <Heart
                            className={`h-4 w-4 transition-colors ${
                                idol.is_favorite
                                    ? "fill-pink-500 text-pink-500"
                                    : "text-zinc-100 hover:text-pink-400"
                            }`}
                        />
                    </button>
                )}

                {/* Card Count Badge (Only shows if card_count exists) */}
                {idol.card_count !== undefined && (
                    <div className="absolute bottom-4 left-4 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-zinc-100 backdrop-blur-md border border-white/10">
                        <Star className="h-3.5 w-3.5 text-pink-400" />
                        <span>{idol.card_count} Cards</span>
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-5 relative z-10 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
                <h3 className="text-xl font-bold uppercase italic tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors duration-300">
                    {idol.stage_name}
                </h3>
                
                <div className="flex items-center text-sm font-medium text-zinc-500 dark:text-zinc-400 line-clamp-1">
                    {groupNames ? (
                        <span>{groupNames}</span>
                    ) : (
                        <span className="italic opacity-70">Soloist</span>
                    )}
                </div>

                {/* View Profile Link */}
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-pink-500 dark:text-pink-400 transition-all duration-300">
                    View Profile
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}