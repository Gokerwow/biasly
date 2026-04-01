'use client'

import { PrevCardSkeleton } from "@/components/cards/cardSkeleton";
import { Input } from "@/components/UI/input";
import { Search, PackageOpen, Filter } from "lucide-react";
import { useState } from "react";
import { CleanPhotocard } from "@/types";
import CardItem from "@/components/cards/cards"

type Props = {
    initialCards: CleanPhotocard[];
};

export default function CardsPageClient({ initialCards }: Props) {
    const [query, setQuery] = useState('');

    // const filteredCards = useMemo(() => {
    //     if (!query.trim()) return initialCards;
    //     const q = query.toLowerCase();
    //     return initialCards.filter(card =>
    //         card.name.toLowerCase().includes(q) ||
    //         card.group?.name?.toLowerCase().includes(q) ||
    //         card.photocards_idol?.some(pi =>
    //             (Array.isArray(pi.idol) ? pi.idol[0] : pi.idol)
    //                 ?.stage_name?.toLowerCase().includes(q)
    //         )
    //     );
    // }, [query, initialCards]);

    return (
        <>
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
            {initialCards.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {initialCards.map((card) => {

                        return (
                            <div
                                key={card.id}
                                className="transition-transform hover:-translate-y-1 hover:z-10 duration-300"
                            >
                                <CardItem
                                    asLink
                                    id="preview"
                                    type="collection"
                                    distribution_type={card.distribution_type?.name}
                                    physical_types={card.physical_types_global}
                                    group_name={card.group?.name ?? null}
                                    front_image_url={card.front_image_url}
                                    back_image_url={card.back_image_url}
                                    idols={card.idols}
                                    name={card.name}
                                    rarity={card.rarity ?? 'N'}
                                    release_title={card.releases?.title}
                                    isDoubleSided={card.is_double_sided ?? false}
                                    isHorizontal={card.is_horizontal ?? false}
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
                    Showing {initialCards.length} of {initialCards.length} cards — pagination coming soon
                </div>
            </div>
        </>
    );
}