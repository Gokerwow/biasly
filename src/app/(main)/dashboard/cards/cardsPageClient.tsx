/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import BackButton from "@/components/UI/backButton";
import { PrevCardSkeleton } from "@/components/cards/cardSkeleton";
import PrevCard from "@/components/cards/prevCards";
import FilterMenuUI, { FilterProps } from "@/components/UI/filter";
import { Input } from "@/components/UI/input";
import { ROUTES } from "@/constants";
import { CheckCheck, Filter, Plus, Search, PackageOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import Pagination from "@/components/UI/pagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CardWithIdol, GroupOption } from "./page";

type Props = {
    initialCards: CardWithIdol[];
    groups: GroupOption[];
    totalItems: number;
    currentPage: number;
    itemsPerPage: number;
    initialFilters: FilterProps;
    initialSearch: string;
};

export default function CardsPageClient({
    initialCards,
    groups,
    totalItems,
    currentPage,
    itemsPerPage,
    initialFilters,
    initialSearch,
}: Props) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const [query, setQuery] = useState(initialSearch);
    const [isOpen, setIsOpen] = useState(false);

    // Update URL helper
    const updateURL = (updates: Record<string, any>) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(updates).forEach(([key, value]) => {
            if (value !== null && value !== '' && value !== undefined) {
                if (Array.isArray(value)) {
                    if (value.length > 0) params.set(key, value.join(','));
                    else params.delete(key);
                } else {
                    params.set(key, value.toString());
                }
            } else {
                params.delete(key);
            }
        });

        // Reset page on filter/search changes (unless updating page itself)
        if (!('page' in updates)) {
            params.set('page', '1');
        }

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    };

    // Debounced search handler
    const handleSearch = (value: string) => {
        setQuery(value);
        const timeoutId = setTimeout(() => {
            updateURL({ search: value || null });
        }, 500);
        return () => clearTimeout(timeoutId);
    };

    const updateFilter = (key: string, value: any) => {
        if (typeof value === 'object' && !Array.isArray(value)) {
            // Bulk update from filter menu
            updateURL(value);
        } else {
            updateURL({ [key]: value });
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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
                            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                        </div>
                        <Input
                            name="searchCard"
                            placeholder="Search by card name, album, or era..."
                            value={query}
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuery(value);
                                handleSearch(value);
                            }}
                            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                        />
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="h-11 px-4 cursor-pointer flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all whitespace-nowrap"
                        >
                            <Filter className="h-4 w-4" />
                            Filters
                        </button>
                        {isOpen && (
                            <FilterMenuUI
                                onClose={() => setIsOpen(false)}
                                onConfirm={(compFilters: FilterProps) => updateFilter('bulk', compFilters)}
                                currentFilters={initialFilters}
                                groups={groups}
                            />
                        )}
                    </div>
                </div>

                {/* Grid Content */}
                <div className="relative">
                    {isPending ? (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {[...Array(20)].map((_, i) => (
                                <PrevCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : initialCards.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {initialCards.map((card) => (
                                    <div key={card.id} className="transition-transform hover:-translate-y-1 hover:z-10 duration-300">
                                        <PrevCard card={card} />
                                    </div>
                                ))}
                            </div>
                            <div className="mt-8 flex justify-center relative">
                                <Pagination
                                    totalItems={totalItems}
                                    itemsPerPage={itemsPerPage}
                                    currentPage={currentPage}
                                    onPageChange={updateFilter}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                <PackageOpen className="h-10 w-10 text-gray-600" />
                            </div>
                            <h3 className="text-xl font-bold text-white">No cards found</h3>
                            <button
                                onClick={() => {
                                    setQuery('');
                                    updateURL({ search: null });
                                }}
                                className="mt-6 text-pink-400 text-sm font-bold hover:underline"
                            >
                                Clear Search
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}