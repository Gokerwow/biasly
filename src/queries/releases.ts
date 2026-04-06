/* eslint-disable @typescript-eslint/no-explicit-any */
import { mapToCleanRelease } from "@/helper/cleanPhotocard";
import { paginatedQuery } from "./paginatedQuery";
import { TABLES } from "@/constants";
import { createClient } from "@/utils/supabase/server";
import { handleQueryError } from "@/helper/errorHandling";
import { FilterProps } from "@/components/UI/filter";

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
    filters?: FilterProps
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
            
        let searchIds: string[] | null = null

        if (search) {
            const { data: scoutResults, error: scoutError } = await supabase
                .rpc('search_browse_releases', { search_query: search })

            if (scoutError) {
                handleQueryError(scoutError, `Error searching releases: ${search}`)
            }

            searchIds = scoutResults?.map(s => s.id) ?? []

            if (searchIds.length === 0) {
                return {
                    data: [],
                    total: 0,
                    page,
                    pageSize,
                    totalPages: 0,
                    hasNextPage: false,
                    hasPreviousPage: false
                }
            }
        }

        const applyFilters = (query: any) => {
            let q = query

            // Apply search filter
            if (searchIds) {
                q = q.in('id', searchIds)
            }

            // Apply group filter
            if (filters?.group) {
                q = q.eq('group_id', filters.group.id)
            }

            // Apply rarity filter
            if (filters?.rarity && filters.rarity.length > 0) {
                q = q.in('photocards.rarity', filters.rarity)
            }

            // Apply distribution filter
            if (filters?.distribution_type) {
                q = q.eq('photocards.distribution_type_id', filters.distribution_type.id)
            }

            // Apply sorting
            const sortBy = filters?.sort_by ?? 'newest'
            switch (sortBy) {
                case 'newest':
                    q = q.order('created_at', { ascending: false })
                    break
                case 'oldest':
                    q = q.order('created_at', { ascending: true })
                    break
                case 'name':
                    q = q.order('title', { ascending: true })
                    break
                // case 'popular':
                //     q = q.order('view_count', { ascending: false, nullsFirst: false })
                //     break
                default:
                    q = q.order('created_at', { ascending: false })
            }

            q = q.order('created_at', {
                referencedTable: 'photocards',
                ascending: false
            })

            return q
        }

        const results = await paginatedQuery(
            TABLES.RELEASES,
            { page, pageSize },
            SELECT_QUERY,
            applyFilters
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