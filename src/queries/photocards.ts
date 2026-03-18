'use server'

import { TABLES } from "@/constants";
import { PhotocardData } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getGroups(search?: string) {
    const supabase = await createClient()

    try {
        const queryBuilder = supabase
            .from('groups')
            .select('id, name')

        if (search) {
            queryBuilder.ilike('name', `%${search}%`)
        }

        const { data, error } = await queryBuilder

        if (error) {
            console.log(`Error at getting group data for forms ${error}`)
            throw new Error(`Error at getting group data for forms: ${error}`)
        }

        return data

    } catch (error) {
        console.log(`Error at getting group data for forms ${error}`)
        throw new Error(`Error at getting group data for forms: ${error}`)
    }
}

export async function getIdolsByGroup(groupID: string) {
    const supabase = await createClient()

    try {
        const queryBuilder = supabase
            .from('idol_groups')
            .select('id, idols(id, stage_name)')
            .eq('group_id', groupID)

        const { data, error } = await queryBuilder

        if (error) {
            console.log(`Error at getting idol data for forms ${error}`)
            throw new Error(`Error at getting idol data for forms: ${error}`)
        }

        return data
    } catch (error) {
        console.log(`Error at getting idol data for forms ${error}`)
        throw new Error(`Error at getting idol data for forms: ${error}`)
    }
}

export async function getReleasesByGroup(groupID: string, search?: string) {
    const supabase = await createClient()

    try {
        const queryBuilder = supabase
            .from('releases')
            .select('id, title')
            .eq('group_id', groupID)

        if (search) {
            queryBuilder.ilike('title', `%${search}%`)
        }

        const { data, error } = await queryBuilder

        if (error) {
            console.log(`Error at getting releases data for forms ${error}`)
            throw new Error(`Error at getting releases data for forms: ${error}`)
        }

        return data
    } catch (error) {
        console.log(`Error at getting releases data for forms ${error}`)
        throw new Error(`Error at getting releases data for forms: ${error}`)
    }
}

export async function getReleasesBySoloIdol(idolID: string, search?: string) {
    const supabase = await createClient()

    try {
        const queryBuilder = supabase
            .from('releases')
            .select('id, title')
            .eq('solo_idol_id', idolID)

        if (search) {
            queryBuilder.ilike('title', `%${search}%`)
        }

        const { data, error } = await queryBuilder

        if (error) {
            console.log(`Error at getting releases data for forms ${error}`)
            throw new Error(`Error at getting releases data for forms: ${error}`)
        }

        return data
    } catch (error) {
        console.log(`Error at getting releases data for forms ${error}`)
        throw new Error(`Error at getting releases data for forms: ${error}`)
    }
}

export async function GetCardTypes() {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase
            .from('distribution_types')
            .select('id, name, rarity_weight, description')

        if (error) {
            console.log(`Error at getting card types data for forms ${error}`)
            throw new Error(`Error at getting card types data for forms: ${error}`)
        }

        return data

    } catch (error) {
        console.log(`Error at getting card types data for forms ${error}`)
        throw new Error(`Error at getting card types data for forms: ${error}`)
    }
}

export async function GetPhysicalTypes() {
    const supabase = await createClient()
    try {
        const { data, error } = await supabase
            .from('card_modifiers')
            .select('id, name, modifier, description')

        if (error) {
            console.log(`Error at getting card modifier data for forms ${error}`)
            throw new Error(`Error at getting card modifier data for forms: ${error}`)
        }

        return data

    } catch (error) {
        console.log(`Error at getting card modifier data for forms ${error}`)
        throw new Error(`Error at getting card modifier data for forms: ${error}`)
    }
}


export async function GetSubmissionsData() {
    const supabase = await createClient()

    // 1. Get submissions
    const { data: submissions, error } = await supabase
        .from(TABLES.PHOTOCARD_SUBMISSIONS)
        .select(`
            *,
            submitted_by_profile:profiles!submitted_by(
                id, email, username, avatar_url
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })

    if (error) throw error

    // 2. Collect all unique group + idol ids from the data jsonb
    const allData = submissions.map(s => s.data as unknown as PhotocardData)

    const groupIds = [...new Set(allData.map(d => d?.primary_group_id).filter(Boolean))]
    const idolIds = [...new Set(allData.flatMap(d => d?.idol_ids ?? []).filter(Boolean))]

    // 3. Fetch group names
    const { data: groups } = await supabase
        .from(TABLES.GROUPS)
        .select('id, name')
        .in('id', groupIds)

    // 4. Fetch idol names
    const { data: idols } = await supabase
        .from(TABLES.IDOLS)
        .select('id, stage_name')
        .in('id', idolIds)

    // 5. Merge into submissions
    const enriched = submissions.map(s => {
        const data = s.data as unknown as PhotocardData

        return {
            ...s,
            data: {
                ...data,
                group_name: groups?.find(g => g.id === data.primary_group_id)?.name ?? null,
                idol_names: (data.idol_ids ?? [])
                    .map(id => idols?.find(i => i.id === id)?.stage_name)
                    .filter((n): n is string => n !== undefined)
            }
        }
    })

    return enriched
}

export async function GetApprovedCard() {
    const supabase = await createClient()

    // 1. Get Data
    const { data: PhotocardData, error } = await supabase
        .from(TABLES.PHOTOCARDS)
        .select(`
            *,
            groups(id, name),
            photocards_idol(
                idol:idols(id, stage_name)
            ),
            releases(id, title),
            distribution_types(id, name)
        `)
        .order('created_at', { ascending: false })

    if (error) throw error
    
    return PhotocardData
}