'use client'

import BackButton from "@/components/UI/backButton";
import { PrevCardSkeleton } from "@/components/cards/cardSkeleton";
import { Input } from "@/components/UI/input";
import { ROUTES } from "@/constants";
import { CheckCheck, Plus, Search, PackageOpen, Loader2, Filter } from "lucide-react";
import Link from "next/link";
import { useState, useMemo } from "react";
import { ListPhotocard, SimpleIdol } from "@/types";
import CardItem from "@/components/cards/cards"

type Props = {
    initialCards: ListPhotocard[];
};

export default function CardsPageClient({ initialCards }: Props) {
    const [query, setQuery] = useState('');

    const filteredCards = useMemo(() => {
        if (!query.trim()) return initialCards;
        const q = query.toLowerCase();
        return initialCards.filter(card =>
            card.name.toLowerCase().includes(q) ||
            card.groups?.name?.toLowerCase().includes(q) ||
            card.photocards_idol?.some(pi =>
                (Array.isArray(pi.idol) ? pi.idol[0] : pi.idol)
                    ?.stage_name?.toLowerCase().includes(q)
            )
        );
    }, [query, initialCards]);

    return (
        <div className="flex flex-col gap-6 relative">
            <div>
                <BackButton label="Back to Dashboard" href="/dashboard" />
            </div>

            <div className="relative z-10 flex flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                            Master{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 pr-2">
                                Database
                            </span>
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
                <div className="sticky top-4 z-20 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row gap-4">
                    <div className="flex-1 relative group">
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                            <Search className="h-4 w-4" />
                        </div>
                        <Input
                            name="searchCard"
                            placeholder="Search by card name, idol, or group..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                        />
                    </div>

                    {/* Filter placeholder */}
                    <button
                        disabled
                        className="h-11 px-4 flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 text-sm font-semibold text-gray-500 cursor-not-allowed whitespace-nowrap"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                        <span className="text-xs text-gray-600">(soon)</span>
                    </button>
                </div>

                {/* Grid */}
                {filteredCards.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        {filteredCards.map((card) => {
                            const idols = card.photocards_idol
                                .map(pi => pi.idol)
                                .filter((i): i is SimpleIdol => i !== null)


                            return (
                                <div
                                    key={card.id}
                                    className="transition-transform hover:-translate-y-1 hover:z-10 duration-300"
                                >
                                    <CardItem
                                        id="preview"
                                        type="collection"
                                        distribution_type={card.distribution_types?.name}
                                        group_name={card.groups?.name ?? null}
                                        front_image_url={card.front_image_url}
                                        idols={idols}
                                        name={card.name}
                                        rarity={card.rarity ?? 'N'}
                                        release_title={card.releases?.title}
                                    />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <PackageOpen className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">No cards found</h3>
                        <p className="text-gray-500 text-sm mt-1">
                            Try a different search term
                        </p>
                        <button
                            onClick={() => setQuery('')}
                            className="mt-6 text-pink-400 text-sm font-bold hover:underline"
                        >
                            Clear Search
                        </button>
                    </div>
                )}

                {/* Pagination placeholder */}
                <div className="flex justify-center">
                    <div className="text-xs text-gray-600 font-mono">
                        Showing {filteredCards.length} of {initialCards.length} cards — pagination coming soon
                    </div>
                </div>
            </div>
        </div>
    );
}