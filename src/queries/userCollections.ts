/* eslint-disable @typescript-eslint/no-explicit-any */
import { FetchFilterProps, FilterProps } from "@/components/UI/filter";
import { TABLES } from "@/constants";
import { mapToCleanPhotocard } from "@/helper/cleanPhotocard";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";
import { paginatedQuery } from "./paginatedQuery";
import { FullUserCollections } from "@/types/user_collections";

export async function getUserCollectionIds(userID: string) {
    const supabase = await createClient();
    const { data, error } = await supabase.from(TABLES.USER_COLLECTION).select('card_id').eq('user_id', userID).is('deleted_at', null);
    if (error) handleQueryError(error, 'getting user collection IDs');
    return data.map(item => item.card_id) ?? [];
}

export async function getUserCollections(userID: string, page: number = 1, pageSize: number = 10, search?: string, filters?: FetchFilterProps) {
    const SELECT_QUERY = `
            *,
            photocards!inner(
                *,
                distribution_types!inner(name),
                groups!inner(id, name),
                releases!inner(title),
                photocards_idol(idol:idols!inner(id, stage_name)),
                photocards_idol_filter:photocards_idol!inner(idol:idols!inner(id)),
                photocards_modifiers_global(global_modifier:global_card_modifiers(id, name))
            )
        `

    const applyFilters = (query: any) => {
        let q = query
        q = q.eq('user_id', userID)

        // Apply group filter
        if (filters?.groups_ids && filters?.groups_ids.length > 0) {
            q = q.in('photocards.primary_group_id', filters.groups_ids)
        }

        // Apply idols filter
        if (filters?.idols_ids && filters?.idols_ids.length > 0) {
            q = q.in('photocards.photocards_idol_filter.idol.id', filters.idols_ids)
        }

        // Apply releases filter
        if (filters?.releases_ids && filters?.releases_ids?.length > 0) {
            q = q.in('photocards.releases.id', filters.releases_ids)
        }

        // Apply rarity filter
        if (filters?.raritys && filters.raritys.length > 0) {
            q = q.in('photocards.rarity', filters.raritys)
        }

        // Apply distribution filter
        if (filters?.distribution_type_id) {
            q = q.eq('photocards.distribution_type_id', filters.distribution_type_id)
        }

        // Apply sorting
        const sortBy = filters?.sort_by ?? 'newest'
        switch (sortBy) {
            case 'newest':
                q = q.order('acquired_at', { ascending: false })
                break
            case 'oldest':
                q = q.order('acquired_at', { ascending: true })
                break
            case 'name':
                q = q.order('name', { referencedTable: 'photocards', ascending: true })
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

    const results = await paginatedQuery<"user_collection", FullUserCollections>(
        TABLES.USER_COLLECTION,
        { page, pageSize },
        SELECT_QUERY,
        applyFilters
    )

    const { data, ...rest } = results
    const cleanResults = {
        ...rest,
        data: data.map(item => ({
            ...item,
            photocards: mapToCleanPhotocard(item.photocards)
        }))
    }

    // 3. Clean and return
    return cleanResults;
}

export async function getUserCollectionsGroups(userID: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`
            photocards!inner(
                groups(id,name)
            )
        `)
        .eq('user_id', userID)
        .is('deleted_at', null)
        .order('acquired_at', { ascending: false });

    if (error) handleQueryError(error, 'getting user collections groups for filters');

    const allgroups = new Map<string, { id: string, name: string }>()

    for (const entry of data) {
        const group = entry.photocards?.groups;
        if (group?.id) {
            allgroups.set(group.id, group);
        }
    }

    const groupsArray = [...allgroups.values()]

    return groupsArray
}

export async function getUserCollectionsRarity(userID: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`
            photocards!inner(
                rarity
            )
        `)
        .eq('user_id', userID)
        .is('deleted_at', null)
        .order('acquired_at', { ascending: false });

    if (error) handleQueryError(error, 'getting user collections rarity for filters');

    const allrarity = new Map<string, string>()

    for (const entry of data) {
        const rarity = entry.photocards?.rarity;
        if (rarity) {
            allrarity.set(rarity, rarity);
        }
    }

    const rarityArray = [...allrarity.values()]

    return rarityArray
}

export async function getUserCollectionsMembers(userID: string, groupID: string[]) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`
            photocards!inner(
                photocards_idol(idol:idols(id, stage_name))
            )
        `)
        .eq('user_id', userID)
        .in('photocards.primary_group_id', groupID)
        .is('deleted_at', null)
        .order('acquired_at', { ascending: false });

    if (error) handleQueryError(error, 'getting user collections members for filters');

    const allidols = new Map<string, { id: string, stage_name: string }>()

    const cleanIdol = data.flatMap(d => d.photocards.photocards_idol.map(i => i.idol))
    for (const entry of cleanIdol) {
        if (entry) {
            allidols.set(entry.id, entry);
        }
    }

    const idolsArray = [...allidols.values()]

    return idolsArray
}

export async function getUserCollectionsDistribution(userID: string) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`
            photocards!inner(
                distribution_types(id,name)
            )
        `)
        .eq('user_id', userID)
        .is('deleted_at', null)
        .order('acquired_at', { ascending: false });

    if (error) handleQueryError(error, 'getting user collections distribution for filters');

    const allDist = new Map<string, { id: string, name: string }>()

    const cleanDist = data.map(d => d.photocards.distribution_types)
    for (const entry of cleanDist) {
        if (entry) {
            allDist.set(entry.id, entry);
        }
    }

    const DistArray = [...allDist.values()]

    return DistArray
}

export async function getUserCollectionsReleases(userID: string, groupIDS: string[]) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`
            photocards!inner(
                releases(id,title)
            )
        `)
        .eq('user_id', userID)
        .in('photocards.releases.group_id', groupIDS)
        .is('deleted_at', null)
        .order('acquired_at', { ascending: false });

    if (error) handleQueryError(error, 'getting user collections distribution for filters');

    const allreleases = new Map<string, { id: string, title: string }>()

    const cleanReleases = data.map(d => d.photocards.releases)
    for (const entry of cleanReleases) {
        if (entry) {
            allreleases.set(entry.id, entry);
        }
    }

    const releasesArray = [...allreleases.values()]

    return releasesArray
}