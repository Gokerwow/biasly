/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapToCleanRelease } from "@/helper/cleanPhotocard";
import { paginatedQuery } from "./paginatedQuery";
import { TABLES } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { handleQueryError } from "@/helper/errorHandling";
import { applyGenericFilters, FilterRule, SortRule } from "./appylyFilters";

export async function getReleasesByGroup(groupID: string, search?: string) {
    const supabase = await createClient();
    const query = supabase.from(TABLES.RELEASES).select('id, title').eq('group_id', groupID);

    if (search) query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) handleQueryError(error, 'getting releases data for forms');
    return data;
}

export async function getReleasesBySoloIdol(idolID: string, search?: string) {
    const supabase = await createClient();
    const query = supabase.from(TABLES.RELEASES).select('id, title').eq('solo_idol_id', idolID);

    if (search) query.ilike('title', `%${search}%`);

    const { data, error } = await query;
    if (error) handleQueryError(error, 'getting solo releases data');
    return data;
}

export async function getReleasesWithCards(
    search?: string,
    page: number = 1,
    pageSize: number = 10,
    filters: FilterRule[] = [],
    sort?: SortRule
) {
    const supabase = await createClient()

    try {
        const SELECT_QUERY = `
            *,
            groups(id, name),
            photocards!inner(
                *,
                photocards_idol(
                    idol:idols(id, stage_name)
                ),
                distribution_types(id, name),
                photocards_modifiers_global(
                    global_modifier:global_card_modifiers(id, name)
                )
            )
        `
        
        // 1. We clone the filters array so we don't mutate the original
        const finalRules = [...filters]

        // 2. Handle the RPC Search Logic
        if (search) {
            const { data: scoutResults, error: scoutError } = await supabase
                .rpc('search_browse_releases', { search_query: search })

            if (scoutError) handleQueryError(scoutError, `Error searching releases: ${search}`)

            const searchIds = scoutResults?.map(s => s.id) ?? []

            if (searchIds.length === 0) {
                // Return empty if search yields nothing
                return { data: [], total: 0, page, pageSize, totalPages: 0, hasNextPage: false, hasPreviousPage: false }
            }

            // Append the search IDs as a standard FilterRule!
            finalRules.push({ column: 'id', operator: 'in', value: searchIds })
        }

        // 3. Pass everything into the generic paginated query
        const results = await paginatedQuery(
            TABLES.RELEASES,
            { page, pageSize },
            SELECT_QUERY,
            (q) => applyGenericFilters(q, finalRules, sort)
        )

        return {
            ...results,
            data: results.data.map(mapToCleanRelease)
        }

    } catch (error) {
        console.error('Error getting releases with cards:', error)
        throw new Error(`Failed to fetch releases: ${error}`)
    }
}

export async function getFeaturedRelease() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.RELEASES)
        .select(
            `
                *,
                groups(id, name),
                photocards(
                    id,
                    name,
                    front_image_url
                )
            `
        )
        .order('created_at', { ascending: false })
        .order('created_at', {
            referencedTable: 'photocards',
            ascending: false
        })

    if (error) handleQueryError(error, 'Error at fetching newest releases')

    return data ?? []
}