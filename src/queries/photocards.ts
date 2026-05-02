'use server'

import { TABLES } from "@/constants";
import { mapToCleanPhotocard } from "@/helper/cleanPhotocard";
import { handleQueryError } from "@/helper/errorHandling";
import { CleanPhotocard, PhotocardData } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { paginatedQuery, PaginationResult } from "./paginatedQuery";
import { FetchFilterProps } from "@/components/UI/filter";
import { applyGenericFilters, FilterRule } from "./appylyFilters";
import { FullWishlists } from "@/types/userWishlists";

export async function getSubmissionsData() {
    const supabase = await createClient();

    const { data: submissions, error } = await supabase
        .from(TABLES.PHOTOCARD_SUBMISSIONS)
        .select(`*, submitted_by_profile:profiles!submitted_by(id, email, username, avatar_url)`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

    if (error) handleQueryError(error, 'getting submissions data');

    // ... (Your existing mapping logic here remains great because it's handling raw JSONB payload)
    const allData = submissions.map(s => s.data as unknown as PhotocardData);
    const groupIds = [...new Set(allData.map(d => d?.primary_group_id).filter(Boolean))];
    const idolIds = [...new Set(allData.flatMap(d => d?.idol_ids ?? []).filter(Boolean))];
    const globalModifierIds = [...new Set(allData.flatMap(d => d.physical_type_ids ?? []).filter(Boolean))];
    const distributionTypesIds = [...new Set(allData.flatMap(d => d.distribution_type_id ?? []).filter(Boolean))];

    const [{ data: groups }, { data: idols }, { data: modifiers }, { data: distributions }] = await Promise.all([
        supabase.from(TABLES.GROUPS).select('id, name').in('id', groupIds),
        supabase.from(TABLES.IDOLS).select('id, stage_name').in('id', idolIds),
        supabase.from(TABLES.GLOBAL_CARDS_MODIFIERS).select('id, name').in('id', globalModifierIds),
        supabase.from(TABLES.DISTRIBUTION_TYPES).select('id, name').in('id', distributionTypesIds)
    ]);

    return submissions.map(s => {
        const data = s.data as unknown as PhotocardData;
        return {
            ...s,
            data: {
                ...data,
                group_name: groups?.find(g => g.id === data.primary_group_id)?.name ?? null,
                idol_names: (data.idol_ids ?? []).map(id => idols?.find(i => i.id === id)?.stage_name).filter((n): n is string => n !== undefined),
                modifier_names: (data.physical_type_ids ?? []).map(id => modifiers?.find(m => m.id == id)?.name).filter((name): name is string => name !== undefined),
                distribution_name: distributions?.find(d => d.id === data.distribution_type_id)?.name ?? null
            }
        };
    });
}

export async function getApprovedCards(page: number = 1, pageSize: number = 10, filters?: FilterRule[]): Promise<PaginationResult<CleanPhotocard>> {
    const SELECT_QUERY = `
            *,
            groups(id, name),
            releases(id, title),
            distribution_types(id, name),
            photocards_idol(idol:idols(id, stage_name)),
            photocards_modifiers_global(global_modifier:global_card_modifiers(id, name))
        `

    const results = await paginatedQuery(
        TABLES.PHOTOCARDS,
        { page, pageSize },
        SELECT_QUERY,
        q => applyGenericFilters(q, filters)
    )

    const { data, ...rest } = results
    console.log("DATA CARDS: ", results)


    return {
        ...rest,
        data: data.map(mapToCleanPhotocard)
    }
}

export async function getCardByID(id: string): Promise<CleanPhotocard | null> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.PHOTOCARDS)
        .select(`
            *,
            groups(id, name, slug),
            releases(id, title),
            distribution_types(id, name),
            photocards_idol(idol:idols(id, stage_name, slug)),
            photocards_modifiers_global(global_modifier:global_card_modifiers(id, name))
        `)
        .eq('id', id)
        .single();

    if (error) handleQueryError(error, 'getting card by ID');

    // Mapped cleanly!
    return mapToCleanPhotocard(data);
}

export async function getUserWishlistIds(userID: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from(TABLES.USER_WISHLIST).select('card_id').eq('user_id', userID);
    if (error) handleQueryError(error, 'getting user wishlist IDs');
    return data.map(item => item.card_id) ?? [];
}

export async function getUserWishlist(userID: string, page: number = 1, pageSize: number = 10) {
    const SELECT_QUERY = `
            *,
            photocards(
                *,
                distribution_types(name),
                groups(name),
                releases(title),
                photocards_idol(idol:idols(id, stage_name)),
                photocards_modifiers_global(global_modifier:global_card_modifiers(id, name))
            )
        `

    const results = await paginatedQuery<'user_wishlist', FullWishlists>(
        TABLES.USER_WISHLIST,
        { page, pageSize },
        SELECT_QUERY,
        q => q.eq('user_id', userID)
    )

    const { data, ...rest } = results

    return {
        ...rest,
        data: data.map(item => ({
            ...item,
            photocards: mapToCleanPhotocard(item.photocards)
        }))
    }
}

export async function CheckCardOwning(userID: string, cardID: string) {
    const supabase = await createClient()

    const { data: ownedData, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`*`)
        .eq('user_id', userID)
        .eq('card_id', cardID)
        .maybeSingle()

    if (error) {
        console.log(`Error at getting card owned data ${error}`)
        throw new Error(`Error at getting card owned data: ${error}`)
    }

    return ownedData
}

export async function CheckCardWishlisted(userID: string, cardID: string) {
    const supabase = await createClient()

    const { data: wishlistedData, error } = await supabase
        .from(TABLES.USER_WISHLIST)
        .select(`id, priority`)
        .eq('user_id', userID)
        .eq('card_id', cardID)
        .maybeSingle()

    if (error) {
        console.log(`Error at getting card wishlisted data ${error}`)
        throw new Error(`Error at getting card wishlisted data: ${error}`)
    }

    return wishlistedData
}