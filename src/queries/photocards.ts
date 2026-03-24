'use server'

import { TABLES } from "@/constants";
import { ListPhotocard, PhotocardData } from "@/types";
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

export async function GetApprovedCard(): Promise<ListPhotocard[]> {
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

export async function GetUserCollectionIds(userID: string) {
    const supabase = await createClient()

    const { data: collectionData, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`card_id`)
        .eq('user_id', userID)


    if (error) {
        console.log(`Error at getting user collections data for forms ${error}`)
        throw new Error(`Error at getting user collections data for forms: ${error}`)
    }

    return collectionData.map(item => item.card_id) ?? []
}

export async function GetUserCollections(userID: string) {
    const supabase = await createClient()

    const { data: collectionData, error } = await supabase
        .from(TABLES.USER_COLLECTION)
        .select(`
                *,
                photocards(
                    id,
                    name,
                    front_image_url,
                    rarity,
                    distribution_types(name),
                    groups(name),
                    releases(title),
                    photocards_idol(
                        idol:idols(id, stage_name)
                    )
                )
            `)
        .eq('user_id', userID)
        .order('acquired_at', { ascending: false })

    if (error) {
        console.log(`Error at getting user collections data for forms ${error}`)
        throw new Error(`Error at getting user collections data for forms: ${error}`)
    }

    return collectionData ?? []
}

export async function GetUserWishlistIds(userID: string) {
    const supabase = await createClient()

    const { data: wishlistData, error } = await supabase
        .from(TABLES.USER_WISHLIST)
        .select(`card_id`)
        .eq('user_id', userID)

    if (error) {
        console.log(`Error at getting user collections data for forms ${error}`)
        throw new Error(`Error at getting user collections data for forms: ${error}`)
    }

    return wishlistData.map(item => item.card_id) ?? []
}

export async function GetUserWishlist(userID: string) {
    const supabase = await createClient()

    const { data: wishlistData, error } = await supabase
        .from(TABLES.USER_WISHLIST)
        .select(`
                *,
                photocards(
                    id,
                    name,
                    front_image_url,
                    rarity,
                    distribution_types(name),
                    groups(name),
                    releases(title),
                    photocards_idol(
                        idol:idols(id, stage_name)
                    )
                )
            `)
        .eq('user_id', userID)

    if (error) {
        console.log(`Error at getting user wishlist data ${error}`)
        throw new Error(`Error at getting user wishlist data: ${error}`)
    }

    return wishlistData ?? []
}

export async function GetCardByID(id: string) {
    const supabase = await createClient()

    const { data: cardData, error } = await supabase
        .from(TABLES.PHOTOCARDS)
        .select(`
                *,
                groups(id, name, slug),
                photocards_idol(
                    idol:idols(id, stage_name, slug)
                ),
                releases(id, title),
                distribution_types(id, name)
            `)
        .eq('id', id)
        .single()

    if (error) {
        console.log(`Error at getting card details data ${error}`)
        throw new Error(`Error at getting card details data: ${error}`)
    }

    return cardData
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