"use client"

import { useDebounce } from "@/app/providers/debounce"
import CardItem from "@/components/cards/cards"
import FilterMenuUI, { FilterProps } from "@/components/UI/filter"
import { Input } from "@/components/UI/input"
import Pagination from "@/components/UI/pagination"
import { getOptimizedImageUrl } from "@/helper/cloudinary"
import { SimpleDistribution, SimpleGroup } from "@/types"
import { BrowseFeaturedRelease, BrowseRelease } from "@/types/release"
import { ChevronRight, Sparkles, Search, Filter } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"

interface BrowseClientProps {
    bannerImage: string
    featuredRelease: BrowseFeaturedRelease
    releaseWithCards: BrowseRelease[]
    collectionIds: string[]
    wishlistIds: string[]
    currentPage: number
    totalPages: number
    totalItems: number
    hasNextPage: boolean
    hasPreviousPage: boolean
    groupsData: SimpleGroup[]
    distributionData: SimpleDistribution[]
    currentFilters: FilterProps
}

const ITEMS_PER_PAGE = 10

export function ReleasesClient({
    bannerImage,
    featuredRelease,
    releaseWithCards,
    collectionIds,
    wishlistIds,
    currentPage,
    totalItems,
    totalPages,
    hasNextPage,
    hasPreviousPage,
    groupsData,
    distributionData,
    currentFilters,
}: BrowseClientProps) {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [filterOpen, setFilterOpen] = useState(false)
    const [query, setQuery] = useState(searchParams.get('search') || '')
    const debouncedQuery = useDebounce(query, 500)

    // Memoize empty state check
    const hasResults = useMemo(() => releaseWithCards.length > 0, [releaseWithCards.length])
    const isSearching = useMemo(() => !!debouncedQuery, [debouncedQuery])

    // Memoize optimized banner URL
    const optimizedBannerUrl = useMemo(
        () => getOptimizedImageUrl(bannerImage, {
            width: 1000,
            gravity: 'face',
            crop: 'fill'
        }),
        [bannerImage]
    )

    // Memoize collection/wishlist check functions
    const isInCollection = useCallback((cardId: string) => collectionIds.includes(cardId), [collectionIds])
    const isInWishlist = useCallback((cardId: string) => wishlistIds.includes(cardId), [wishlistIds])

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedQuery) {
            params.set('search', debouncedQuery.trim())
            params.delete('page')
        } else {
            params.delete('search')
        }
        const queryString = params.toString()
        const url = queryString ? `${pathName}?${queryString}` : pathName
        router.push(url, { scroll: false })
    }, [debouncedQuery, pathName, router, searchParams])

    useEffect(() => {
        console.log(filterOpen)
    }, [filterOpen])

    return (
        <div className="flex flex-col gap-10 relative">

            {/* --- SEARCH & FILTER BAR --- */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                    <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1">
                        BROWSE RELEASES
                    </h2>
                    <p className="text-gray-400 text-sm">Explore the latest drops and complete your eras.</p>
                </div>

                <div className="relative flex items-center gap-3">
                    <div className="relative group">
                        <Input
                            name="search"
                            placeholder="Search Cards...."
                            isSearch={true}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </div>
                    <button 
                        id="filter-toggle-btn" 
                        onClick={() => setFilterOpen(!filterOpen)} 
                        className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#161B22] px-4 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>

                    {filterOpen &&
                        <FilterMenuUI
                            currentFilters={currentFilters}
                            distributionTypes={distributionData}
                            groups={groupsData}
                            onClose={() => setFilterOpen(!filterOpen)}
                        />
                    }
                </div>
            </div>

            {/* --- FEATURED DROP (HERO) --- */}
            <section className="group animate-border relative h-64 w-full overflow-hidden rounded-[2.5rem] border border-pink-500/20 shadow-2xl transition-all duration-500 hover:border-pink-500/40">

                {/* Background image — right side fading left */}
                <div
                    className="absolute right-0 top-0 h-full w-2/3 bg-cover bg-[center_30%] [mask-image:linear-gradient(to_right,transparent,black_20%)]"
                    style={{ backgroundImage: `url(${optimizedBannerUrl})` }}
                />

                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11] via-[#0B0E11]/80 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 md:px-12">
                    {/* Badge */}
                    <div className="flex items-center gap-2 rounded-full bg-pink-500/20 px-3 py-1 text-[10px] font-black text-pink-400 border border-pink-500/30 w-fit uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" />
                        Latest Release
                    </div>

                    {/* Title — smaller to fit h-64 */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                            {featuredRelease.title} <span className="text-pink-500">Era</span>
                        </h2>
                        <p className="text-sm text-gray-400 mt-1 font-medium">
                            {featuredRelease.groups?.name} · Oct 2024
                        </p>
                    </div>

                    {/* Actions — smaller buttons */}
                    <div className="flex items-center gap-3">
                        <button className="rounded-full bg-pink-600 px-5 py-2 text-xs font-black text-white transition-all hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-95 uppercase tracking-widest">
                            Explore Set
                        </button>
                        <button className="rounded-full bg-white/5 border border-white/10 px-5 py-2 text-xs font-black text-white/70 transition-all hover:bg-white/10 active:scale-95 uppercase tracking-widest">
                            Album Info
                        </button>
                    </div>
                </div>
            </section>

            {/* --- RESULTS OR EMPTY STATE --- */}
            {!hasResults ? (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
                        <div className="relative rounded-full bg-gradient-to-br from-pink-500/10 to-purple-500/10 border border-white/10 p-8">
                            <Search className="h-16 w-16 text-gray-600" />
                        </div>
                    </div>

                    <h3 className="text-2xl font-black text-white mb-2">
                        {isSearching ? 'No Results Found' : 'No Releases Yet'}
                    </h3>

                    <p className="text-gray-500 text-center max-w-md mb-6">
                        {isSearching
                            ? `We couldn't find any cards matching "${query}". Try adjusting your search terms.`
                            : "There are no releases available at the moment. Check back soon for new drops!"
                        }
                    </p>

                    {isSearching && (
                        <button
                            onClick={() => setQuery('')}
                            className="rounded-xl bg-pink-600 px-6 py-3 text-sm font-bold text-white hover:bg-pink-500 transition-all active:scale-95"
                        >
                            Clear Search
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* --- BROWSE BY ERA (GROUPS) --- */}
                    {releaseWithCards.map((release) => (
                        <section key={release.id} className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b border-gray-800/50 pb-4">
                                <div className="flex items-center gap-4">
                                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                        {release.group?.name} <span className="text-gray-600 mx-1">/</span> {release.title}
                                    </h3>
                                    <span className="rounded-md bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-500">
                                        {release.release_date ?? release.category}
                                    </span>
                                </div>
                                <Link
                                    href={`/browse/${release.title.toLowerCase()}`}
                                    className="group flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-pink-500 transition-colors"
                                >
                                    See Full Collection
                                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>

                            {/* Horizontal Scroll for Cards */}
                            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                                {release.photocards.map((card) => (
                                    <div key={card.id} className="shrink-0 w-54 snap-start p-2">
                                        <CardItem
                                            asLink
                                            front_image_url={card.front_image_url}
                                            back_image_url={card.back_image_url}
                                            group_name={release.group?.name ?? null}
                                            id={card.id}
                                            name={card.name}
                                            rarity={card.rarity ?? 'N'}
                                            distribution_type={card.distribution_type?.name}
                                            physical_types={card.physical_types_global}
                                            idols={card.idols}
                                            release_title={release.title}
                                            type='browse'
                                            isInCollection={isInCollection(card.id)}
                                            isInWishlist={isInWishlist(card.id)}
                                            isDoubleSided={card.is_double_sided ?? false}
                                        />
                                    </div>
                                ))}
                            </div>
                        </section>
                    ))}

                    {/* --- PAGINATION (only show when there are results) --- */}
                    {totalPages > 1 && (
                        <Pagination
                            totalItems={totalItems}
                            itemsPerPage={ITEMS_PER_PAGE}
                            currentPage={currentPage}
                            hasNextPage={hasNextPage}
                            hasPreviousPage={hasPreviousPage}
                            totalPages={totalPages}
                        />
                    )}
                </>
            )}
        </div>
    )
}