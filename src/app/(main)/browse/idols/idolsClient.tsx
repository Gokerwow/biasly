"use client"

import { Input } from "@/components/UI/input"
import { Search, Sparkles, Disc3, Filter } from "lucide-react"
import { useState, useMemo, useEffect } from "react"
import { Button } from "@/components/UI/button"
import FilterMenuUI from "@/components/UI/filter"
import { useDebounce } from "@/app/providers/debounce"
import { InferQueryType } from "@/helper/queryType"
import Pagination from "@/components/UI/pagination"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { updateParam } from "@/helper/params"
import { getAllIdols } from "@/queries/idols"
import { IdolCard } from "@/components/cards/idolCard"

export type AutoIdolsType = InferQueryType<typeof getAllIdols>

interface GroupsClientProps {
    idols: AutoIdolsType
    currentPage: number
}

export function IdolsClient({ idols, currentPage }: GroupsClientProps) {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()

    const [query, setQuery] = useState("")
    const [filterOpen, setFilterOpen] = useState(false)
    const debouncedQuery = useDebounce(query, 500)

    console.log("IDOLS: ", idols)
    const idolsData = idols.data


    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        updateParam(params, 'search', debouncedQuery)
        updateParam(params, 'page', '1')
        const queryString = params.toString()
        const url = queryString ? `${pathName}?${queryString}` : pathName
        router.push(url, { scroll: false })
    }, [debouncedQuery])

    return (
        <div className="flex flex-col gap-10">
            {/* Header */}
            <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-4xl font-black italic tracking-tighter text-zinc-900 dark:text-zinc-100">
                        BROWSE IDOLS
                    </h1>
                    <p className="mt-1 text-zinc-500 dark:text-zinc-400">
                        Explore all K-pop Idols and their photocards.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <Input
                            isSearch
                            name="search"
                            placeholder="Search idols..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full min-w-[200px] border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 pl-10 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-500 dark:placeholder:text-zinc-400 focus:border-pink-500 dark:focus:border-pink-400 focus:ring-pink-500/20 dark:focus:ring-pink-400/20 md:w-64"
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

                    {/* {filterOpen &&
                        <FilterMenuUI
                            currentFilters={currentFilters}
                            distributionTypes={distributionData}
                            groups={groupsData}
                            onClose={() => setFilterOpen(!filterOpen)}
                        />
                    } */}

                </div>
            </header>

            {/* Stats Section */}
            <section className="relative h-48 w-full overflow-hidden rounded-[2.5rem] border border-pink-500/20 dark:border-pink-400/20 bg-white dark:bg-zinc-900 shadow-2xl transition-all duration-500 hover:border-pink-500/40 dark:hover:border-pink-400/40">
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 dark:from-zinc-900 dark:via-zinc-900/90 to-transparent" />
                <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 md:px-12">
                    <div className="flex items-center gap-2 rounded-full border border-pink-500/30 dark:border-pink-400/30 bg-pink-500/10 dark:bg-pink-400/10 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 w-fit">
                        <Sparkles className="h-3 w-3" />
                        Collection Stats
                    </div>
                    {/* <h2 className="text-2xl font-black italic uppercase tracking-tighter text-zinc-900 dark:text-zinc-100 md:text-3xl">
                        {groups.length} <span className="text-pink-500 dark:text-pink-400">Groups</span> · {totalMembers} Idols · {totalReleases} Releases
                    </h2> */}
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        {idolsData.length} idols matching your search
                    </p>
                </div>
            </section>

            {/* Results */}
            {idolsData && idolsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center px-4 py-20">
                    <div className="relative mb-6">
                        <div className="absolute inset-0 rounded-full bg-pink-500/20 dark:bg-pink-400/20 blur-3xl" />
                        <div className="relative rounded-full border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-pink-500/10 dark:from-pink-400/10 to-zinc-100 dark:to-zinc-800/50 p-8">
                            <Search className="h-16 w-16 text-zinc-400 dark:text-zinc-500" />
                        </div>
                    </div>
                    <h3 className="mb-2 text-2xl font-black text-zinc-900 dark:text-zinc-100">
                        No Idols Found
                    </h3>
                    <p className="mb-6 max-w-md text-center text-zinc-500 dark:text-zinc-400">
                        We couldn&apos;t find any Idols matching your search. Try a
                        different search term.
                    </p>
                    <Button
                        onClick={() => setQuery("")}
                        className="bg-pink-500 text-white hover:bg-pink-600 dark:hover:bg-pink-400 transition-colors"
                    >
                        Clear Search
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                    {idolsData.map((idol) => (
                        <IdolCard key={idol.id} idol={idol} />
                    ))}
                </div>
            )}

            {/* --- PAGINATION (only show when there are results) --- */}
            {idols.totalPages > 1 && (
                <Pagination
                    totalItems={idols.total}
                    itemsPerPage={idols.pageSize}
                    currentPage={currentPage}
                    hasNextPage={idols.hasNextPage}
                    hasPreviousPage={idols.hasPreviousPage}
                    totalPages={idols.totalPages}
                />
            )}
        </div>
    )
}