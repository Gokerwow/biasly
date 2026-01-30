'use client'

import BackButton from "@/components/cards/UI/backButton";
import { PrevCardSkeleton } from "@/components/cards/cardSkeleton";
import PrevCard from "@/components/cards/prevCards";
import FilterMenuUI, { FilterProps } from "@/components/cards/UI/filter";
import { Input } from "@/components/cards/UI/input";
import { ROUTES } from "@/constants";
import { Tables } from "@/types/database.helper";
import { createClient } from "@/utils/supabase/client";
import { CheckCheck, Filter, Plus, Search, PackageOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Pagination from "@/components/cards/UI/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/providers/debounce";

export type CardWithIdol = Tables<'photocards'> & {
    idols: { id: string, stage_name: string | null } | null,
}

// Simple type for the groups state
type GroupOption = { id: number; name: string };

export default function CardsPage() {
    const supabase = createClient()
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [cardsData, setCardsData] = useState<CardWithIdol[]>([])
    const [groups, setGroups] = useState<GroupOption[]>([]) // 👈 Typed properly
    const [isLoading, setIsLoading] = useState(true)

    const [query, setQuery] = useState(searchParams.get('search') || '')
    const [debouncedQuery] = useDebounce(query, 500);

    const filters = useMemo(() => {
        return {
            sort_by: searchParams.get('sort_by') || '',
            groups: searchParams.get('groups') || '',
            card_type: searchParams.get('card_type') ? searchParams.get('card_type')!.split(',').map(i => i.trim()) : [],
            rarity: searchParams.get('rarity') ? searchParams.get('rarity')!.split(',').map(i => i.trim()) : []
        }
    }, [searchParams]);

    const [isOpen, setIsOpen] = useState(false)
    const [totalItems, setTotalItems] = useState<number>(0)
    const currentPage = Number(searchParams.get('page')) || 1;
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchCards = async () => {
            setIsLoading(true)
            try {
                const startIndex = (currentPage - 1) * itemsPerPage
                const endIndex = startIndex + itemsPerPage - 1

                const { sort_by, groups, card_type, rarity } = filters;
                const currentSearch = searchParams.get('search');

                let queryBuilder = supabase
                    .from('photocards')
                    .select('*, idols(id, stage_name), releases!inner(id, group_id, groups!inner(id, name, slug))', { count: 'exact' })
                    .eq('status', 'accepted')
                    .range(startIndex, endIndex)
                    .order(sort_by === 'name' ? 'name' : 'created_at', { ascending: sort_by === 'newest' ? false : true })

                // --- FILTERS ---
                if (currentSearch) {
                    queryBuilder = queryBuilder.ilike('name', `%${currentSearch}%`);
                }

                if (groups) {
                    queryBuilder = queryBuilder.eq('releases.group_id', groups);
                }

                if (card_type && card_type.length > 0) {
                    queryBuilder = queryBuilder.in('type', card_type);
                }

                if (rarity && rarity.length > 0) {
                    queryBuilder = queryBuilder.in('rarity', rarity);
                }

                const { data, count, error } = await queryBuilder

                if (error) throw error
                setCardsData(data || [])
                setTotalItems(count || 0)
            } catch (error) {
                console.error('Error fetching cards:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchCards()
    }, [supabase, currentPage, searchParams, filters])

    useEffect(() => {
        const fetchMasterGroups = async () => {
            const { data, error } = await supabase
                .from('active_groups')
                .select('*')
                .order('name');

            if (!error && data) {
                setGroups(data);
            }
        }
        fetchMasterGroups()
    }, [])

    // 3. URL SYNC (Input -> URL)
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());

        // Prevent Loop: Only update if changed
        if (debouncedQuery === searchParams.get('search')) return;

        if (debouncedQuery) {
            params.set('search', debouncedQuery);
        } else {
            params.delete('search');
        }

        params.set('page', '1'); // Reset page on search
        router.push(`${pathname}?${params.toString()}`);

    }, [debouncedQuery, pathname, router]) // Removed searchParams from dep to prevent loop

    // 4. BACK BUTTON SYNC (URL -> Input)
    useEffect(() => {
        const urlSearch = searchParams.get('search') || '';
        if (urlSearch !== query) {
            setQuery(urlSearch);
        }
    }, [searchParams])

    // Helper: Update Filters
    const updateFilter = (key: string, value: any) => {
        const params = new URLSearchParams(searchParams.toString())

        if (value !== null && value !== '' && value !== undefined) {
            // Handle Bulk Object (from Filter Menu)
            if (typeof value === 'object' && !Array.isArray(value)) {
                for (const [objKey, objVal] of Object.entries(value)) {
                    if (Array.isArray(objVal)) {
                        if (objVal.length > 0) params.set(objKey, objVal.join(','))
                        else params.delete(objKey);
                    }
                    else if (objVal) {
                        params.set(objKey, objVal.toString());
                    }
                    else {
                        params.delete(objKey);
                    };
                }
            }
            // Handle Single Value
            else {
                params.set(key, value.toString());
            }
        } else {
            params.delete(key);
        }

        // Logic: Reset page unless we are specifically changing the page
        if (key !== 'page') {
            params.set('page', '1');
        }

        router.push(`${pathname}?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <div className="flex flex-col gap-6 relative">
            <div>
                <BackButton label="Back to Dashboard" href="/dashboard" />
            </div>

            <div className="relative z-10 flex flex-col gap-8">

                {/* Header Section */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 pr-2">Database</span>
                        </h1>
                        <p className="mt-2 text-gray-400 font-mono text-sm">
                            Manage and organize the entire Biasly collection.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        <Link
                            href={ROUTES.DASHBOARD.CARDS.APPROVE}
                            className="group flex h-10 items-center gap-2 rounded-xl border border-purple-500/30 bg-purple-500/10 px-4 text-sm font-bold text-purple-400 transition-all hover:bg-purple-500 hover:text-white"
                        >
                            <CheckCheck className="h-4 w-4" />
                            <span className="hidden sm:inline">Approve Queue</span>
                        </Link>

                        <Link
                            href={ROUTES.DASHBOARD.CARDS.CREATE}
                            className="group flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-pink-600 to-pink-500 px-5 text-sm font-bold text-white shadow-lg shadow-pink-500/20 transition-all hover:scale-105 hover:shadow-pink-500/40"
                        >
                            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
                            <span>Add Card</span>
                        </Link>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="sticky top-4 z-20 rounded-2xl border border-white/10 bg-black/60 p-4 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </div>
                        <Input
                            name="searchCard"
                            placeholder="Search by card name, album, or era..."
                            value={query} // Controlled by local state
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                        />
                    </div>

                    <div className="relative"> {/* Wrap button and menu in relative container */}
                        <button onClick={() => setIsOpen(!isOpen)} className="h-11 px-4 cursor-pointer flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap">
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        {isOpen &&
                            <FilterMenuUI
                                onClose={() => setIsOpen(false)}
                                onConfirm={(compFilters: FilterProps) => updateFilter('bulk', compFilters)}
                                currentFilters={filters}
                                groups={groups}
                            />
                        }
                    </div>
                </div>

                {/* Grid Content */}
                <div className="relative">
                    {isLoading ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(20)].map((_, i) => (
                                <PrevCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : cardsData.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {cardsData.map((card) => (
                                    <div key={card.id} className="transition-transform hover:-translate-y-1 hover:z-10 duration-300">
                                        <PrevCard
                                            card={card}
                                        />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-center relative">
                                <Pagination
                                    totalItems={totalItems || 0}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    // ⚡ PAGINATION FIX IS HERE 👇
                                    onNext={() => updateFilter('page', currentPage + 1)}
                                    onPrevious={() => updateFilter('page', currentPage - 1)}
                                    onPageChange={(page) => updateFilter('page', page)}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            {/* Empty State... */}
                            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <PackageOpen className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No cards found</h3>
                            <button
                                onClick={() => setQuery('')}
                                className="mt-6 text-pink-400 text-sm font-bold hover:underline"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}