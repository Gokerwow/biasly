"use client"

import { getOptimizedImageUrl } from "@/helper/cloudinary"
import { Activity, ChevronRight, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export interface Group {
    id: string
    name: string
    image_url: string | null
    slug: string
    agency: string | null
    status: string
    member_count: number
}

interface GroupCardProps {
    group: Group
}

export function GroupCard({ group }: GroupCardProps) {
    return (
        <Link
            href={`/groups/${group.slug}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-pink-500/15 hover:border-pink-400 dark:hover:border-pink-500"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                <Image
                    src={getOptimizedImageUrl(group.image_url, {
                        gravity: 'face',
                        crop: 'fill'
                    }) || '/placeholder.png'}
                    alt={group.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />

                {/* Richer Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-100" />

                {/* Stats Badges - Enhanced Glassmorphism */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                    <div className="flex gap-2">
                        <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold text-zinc-100 backdrop-blur-md border border-white/10">
                            <Users className="h-3.5 w-3.5 text-pink-400" />
                            <span>{group.member_count}</span>
                        </div>

                        <div className="flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 text-xs font-semibold capitalize text-zinc-100 backdrop-blur-md border border-white/10">
                            <Activity className={`h-3.5 w-3.5 ${group.status === 'active' ? 'text-emerald-400' : 'text-zinc-400'}`} />
                            <span>{group.status}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-1 flex-col gap-2 p-5 relative z-10 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-950">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors duration-300">
                    {group.name}
                </h3>

                <div className="flex items-center text-sm text-zinc-500 dark:text-zinc-400">
                    {group.agency ? (
                        <span className="font-medium">{group.agency}</span>
                    ) : (
                        <span className="italic opacity-70">Independent</span>
                    )}
                </div>

                {/* View Group Link - Animated Arrow */}
                <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-pink-500 dark:text-pink-400 transition-all duration-300">
                    View Profile
                    <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
            </div>
        </Link>
    )
}