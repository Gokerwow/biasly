import { createClient } from "@/utils/supabase/server";
import CardsPageClient from "./cardsPageClient";
import { Tables } from "@/types/supabase";
import { FilterProps } from "@/components/UI/filter";
import { Enums } from "@/types/database.helper";
import { GetApprovedCard } from "@/queries/photocards";

type SearchParams = {
    search?: string;
    page?: string;
    sort_by?: string;
    groups?: string;
    card_type?: string;
    rarity?: string;
};

// Simple type for the groups state
export type GroupOption = { id: string | null; name: string | null };

export default async function CardsPage({
    searchParams,
}: {
    searchParams: SearchParams;
}) {
    const params = await searchParams

    const cardsData = await GetApprovedCard()

    console.log(cardsData)

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
        <CardsPageClient
            initialCards={cardsData}
            // groups={groups}
            // totalItems={totalItems}
            // currentPage={currentPage}
            // itemsPerPage={itemsPerPage}
            // initialFilters={filters}
            // initialSearch={params.search || ''}
        />
    );
}