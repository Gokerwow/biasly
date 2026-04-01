import { createClient } from "@/utils/supabase/server";
import CardsPageClient from "./cardsPageClient";
import { Tables } from "@/types/supabase";
import { FilterProps } from "@/components/UI/filter";
import { Enums } from "@/types/database.helper";
import { getApprovedCards } from "@/queries/photocards";
import BackButton from "@/components/UI/backButton";
import Link from "next/link";
import { ROUTES } from "@/constants";
import { CheckCheck, Plus } from "lucide-react";
import { Suspense } from "react";
import { PrevCardSkeleton } from "@/components/cards/cardSkeleton";

type SearchParams = {
    search?: string;
    page?: string;
    sort_by?: string;
    groups?: string;
    card_type?: string;
    rarity?: string;
};

async function CardDataFetcher() {
    const cardsData = await getApprovedCards()
    return <CardsPageClient initialCards={cardsData} />
}

export default async function CardsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams

    const cardsData = await getApprovedCards()

    console.log("APPROVED CARDS: ", cardsData)

    // const currentPage = Number(params.page) || 1;
    // const itemsPerPage = 20;
    // const startIndex = (currentPage - 1) * itemsPerPage;
    // const endIndex = startIndex + itemsPerPage - 1;

    // // Parse filters from searchParams
    // const filters: FilterProps = {
    //     sort_by: params.sort_by || '',
    //     groups: params.groups || '',
    //     card_type: params.card_type?.split(',').map(i => i.trim()) as Enums<'card_type'>[] || [],
    //     rarity: params.rarity?.split(',').map(i => i.trim()) as Enums<'card_rarity'>[] || [],
    // };

    // // Build query
    // let queryBuilder = supabase
    //     .from('photocards')
    //     .select('*, idols(id, stage_name), releases!inner(id, group_id, groups!inner(id, name, slug))', { count: 'exact' })
    //     .eq('status', 'accepted')
    //     .range(startIndex, endIndex)
    //     .order(filters.sort_by === 'name' ? 'name' : 'created_at', {
    //         ascending: filters.sort_by === 'oldest' ? true : false
    //     });

    // // Apply filters
    // if (params.search) {
    //     queryBuilder = queryBuilder.ilike('name', `%${params.search}%`);
    // }

    // if (filters.groups) {
    //     queryBuilder = queryBuilder.eq('releases.group_id', filters.groups);
    // }

    // if (filters.card_type.length > 0) {
    //     queryBuilder = queryBuilder.in('type', filters.card_type);
    // }

    // if (filters.rarity.length > 0) {
    //     queryBuilder = queryBuilder.in('rarity', filters.rarity);
    // }

    // // Fetch data
    // const [cardsResult, groupsResult] = await Promise.all([
    //     queryBuilder,
    //     supabase.from('active_groups').select('*').order('name')
    // ]);

    // const cardsData = cardsResult.data || [];
    // const totalItems = cardsResult.count || 0;
    // const groups = groupsResult.data || [];

    // Pass to Client Component
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

                <Suspense fallback={<PrevCardSkeleton/>}>
                    <CardDataFetcher/>
                </Suspense>
            </div>
        </div>
    );
}