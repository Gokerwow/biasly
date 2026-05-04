'use client'

import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import CardItem from '@/components/cards/cards'
import { Filter, Search, LayoutGrid, List, X } from 'lucide-react'
import { FullUserCollections } from '@/types/user_collections'
import Pagination from '@/components/UI/pagination'
import { Profile, SimpleDistribution, SimpleGroup, SimpleIdol, SimpleRelease } from '@/types'
import { FilterProps } from '@/components/UI/filter'
import CollectionFilterMenu from '@/components/collections/collectionsFilter'
import { MarkCard } from '@/actions/card_actions'
import { useToast } from '@/app/providers/toastProvider'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/app/providers/debounce'
import { updateParam } from '@/helper/params'
import { Button } from '@/components/UI/button'
import { WteExportTemplate } from '@/components/template/WteExportTemplate'
import { toPng } from 'html-to-image';

export interface Pagination {
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

// This would be your server component wrapper
export default function CollectionPageClient({
    userCollections,
    profile,
    groupsFilters,
    idolsFilters,
    distFilters,
    releasesFilters,
    currentFilters,
    pagination
}: {
    userCollections: FullUserCollections[],
    profile: Profile
    groupsFilters: SimpleGroup[]
    idolsFilters: SimpleIdol[]
    distFilters: SimpleDistribution[]
    releasesFilters: SimpleRelease[]
    currentFilters: FilterProps
    pagination: Pagination
}) {

    const pathName = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const ref = useRef<HTMLDivElement>(null)

    // State management
    const [searchQuery, setSearchQuery] = useState('')
    const debouncedQuery = useDebounce(searchQuery, 500)
    const { showToast } = useToast()

    const handleToggleMark = async (collectionID: string, type: 'sale' | 'trade') => {
        const response = await MarkCard(collectionID, type, pathName)

        if (response.error) {
            console.error("Error at toggling marking :", response.error)
            showToast(`Failed marking cards to ${type}`, 'error')
            return
        }

        showToast(`Successfully marking cards to ${type}`, 'success')
    }

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        updateParam(params, 'search', debouncedQuery)
        updateParam(params, 'page', '1')

        const queryString = params.toString()
        const url = queryString ? `${pathName}?${queryString}` : pathName
        router.push(url, { scroll: false })
    }, [debouncedQuery])

    const handleExport = useCallback(() => {
        if (ref.current === null) {
            return
        }

        toPng(ref.current, { cacheBust: true })
            .then((dataUrl) => {
                const link = document.createElement('a')
                link.download = 'export_collection.png'
                link.href = dataUrl
                link.click()
            })
            .catch((err) => {
                console.log(err)
            })
    }, [ref])

    // // Toggle release filter
    // const toggleRelease = (release: string) => {
    //     const newSelected = new Set(selectedReleases)
    //     if (newSelected.has(release)) {
    //         newSelected.delete(release)
    //     } else {
    //         newSelected.add(release)
    //     }
    //     setSelectedReleases(newSelected)
    // }

    // const hasActiveFilters = searchQuery !== '' || selectedGroups.length > 0 // || selectedIdols.size > 0 || selectedReleases.size > 0

    return (
        <div className="flex flex-col gap-6">

            {/* --- 1. HERO BANNER --- */}
            <div className="relative w-full overflow-hidden rounded-3xl border border-gray-800 bg-[#161B22]">

                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                />

                {/* Pink glow */}
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Left — title */}
                    <div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">
                            Your Vault
                        </p>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                            My Collection
                        </h1>
                        <p className="mt-1 text-gray-400 text-sm">
                            Manage, track, and flex your inventory.
                        </p>
                    </div>

                    {/* Right — stats */}
                    <div className="flex gap-4 shrink-0">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Cards</p>
                            <p className="font-mono text-2xl font-black text-white mt-1">
                                {userCollections.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Groups</p>
                            <p className="font-mono text-2xl font-black text-pink-400 mt-1">
                                {new Set(userCollections.map(c => c.photocards?.group?.name).filter(Boolean)).size}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Idols</p>
                            <p className="font-mono text-2xl font-black text-purple-400 mt-1">
                                {new Set(userCollections.flatMap(c => c.photocards?.idols.map(pi => pi.id) ?? []).filter(Boolean)).size}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. MAIN CONTENT SPLIT (Filters + Grid) --- */}
            <div className="flex gap-8">

                <aside className="sticky top-8 h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto rounded-2xl border border-gray-800 bg-[#161B22] p-4 hidden lg:block">
                    <CollectionFilterMenu
                        currentFilters={currentFilters}
                        distributionTypes={distFilters}
                        groups={groupsFilters}
                        idols={idolsFilters}
                        releases={releasesFilters}
                    />
                </aside>

                {/* RIGHT: THE GRID */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="mb-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by card name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full rounded-xl border border-gray-800 bg-[#161B22] py-2.5 pl-10 pr-10 text-sm text-white focus:border-pink-500 focus:outline-none transition-colors"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                            )}

                        </div>
                        <Button
                            variant='default'
                            onClick={() => handleExport()}
                        >
                            <span>Export</span>
                        </Button>
                    </div>

                    {/* Active filters display */}
                    {/* {hasActiveFilters && (
                        <div className="mb-4 flex flex-wrap items-center gap-2">
                            <span className="text-xs text-gray-500 font-medium">Active filters:</span>
                            {Array.from(selectedGroups).map(group => (
                                <button
                                    key={group.id}
                                    onClick={() => toggleGroup(group)}
                                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 px-3 py-1 text-xs text-pink-300 hover:bg-pink-500/30 transition-colors"
                                >
                                    <span>{group.name}</span>
                                    <X className="h-3 w-3" />
                                </button>
                            ))}
                            {Array.from(selectedIdols).map(idol => (
                                <button
                                    key={idol}
                                    onClick={() => toggleIdol(idol)}
                                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 border border-purple-500/30 px-3 py-1 text-xs text-purple-300 hover:bg-purple-500/30 transition-colors"
                                >
                                    <span>{idol}</span>
                                    <X className="h-3 w-3" />
                                </button>
                            ))}
                            {Array.from(selectedReleases).map(release => (
                                <button
                                    key={release}
                                    onClick={() => toggleRelease(release)}
                                    className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 px-3 py-1 text-xs text-blue-300 hover:bg-blue-500/30 transition-colors"
                                >
                                    <span className="truncate max-w-[150px]">{release}</span>
                                    <X className="h-3 w-3 shrink-0" />
                                </button>
                            ))}
                        </div>
                    )} */}

                    {/* Results count */}
                    {/* <div className="mb-4 text-sm text-gray-400">
                        Showing <span className="text-white font-medium">{filteredCollections.length}</span> of {userCollections.length} cards
                    </div> */}

                    {/* Cards Grid */}
                    {userCollections.length > 0 ? (
                        <div className={`grid gap-4 grid-cols-2 xl:grid-cols-4`}>
                            {userCollections.map((collection) => {
                                if (!collection.photocards) return null

                                return <CardItem
                                    asLink
                                    key={collection.id}
                                    id={collection.photocards.id}
                                    front_image_url={collection.photocards.front_image_url}
                                    back_image_url={collection.photocards.back_image_url}
                                    group_name={collection.photocards.group?.name ?? 'No Group Name'}
                                    name={collection.photocards.name}
                                    rarity={collection.photocards.rarity ?? 'N'}
                                    idols={collection.photocards.idols}
                                    distribution_type={collection.photocards.distribution_type?.name}
                                    physical_types={collection.photocards.physical_types_global}
                                    release_title={collection.photocards?.releases?.title}
                                    type='collection'
                                    isDoubleSided={collection.photocards.is_double_sided ?? false}
                                    isHorizontal={collection.photocards.is_horizontal ?? false}
                                    isForSale={collection.is_for_sale ?? false}
                                    isForTrade={collection.is_for_trade ?? false}
                                    onToggleSale={() => handleToggleMark(collection.id, 'sale')}
                                    onToggleTrade={() => handleToggleMark(collection.id, 'trade')}
                                />
                            })}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="rounded-full bg-gray-800/50 p-6 mb-4">
                                <Search className="h-12 w-12 text-gray-600" />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">No cards found</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Try adjusting your filters or search query
                            </p>
                            <button
                                // onClick={clearAllFilters}
                                className="rounded-lg bg-gradient-to-r from-pink-500 to-purple-500 px-6 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                    {/* PAGINATION */}
                    {pagination.totalPages > 1 && (
                        <Pagination
                            currentPage={pagination.page}
                            hasNextPage={pagination.hasNextPage}
                            hasPreviousPage={pagination.hasPreviousPage}
                            itemsPerPage={pagination.pageSize}
                            totalItems={pagination.total}
                            totalPages={pagination.totalPages}
                        />
                    )}
                </div>

            </div>

            <div className="absolute top-0 -left-[9999px]">
                <WteExportTemplate
                    ref={ref}
                    exportType='trade'
                    profile={profile}
                    userCollections={userCollections.filter(c => c.is_for_trade === true)}
                    format='feed'
                />
            </div>
        </div>
    )
}