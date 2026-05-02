"use server"

import { TABLES } from "@/constants"
import { ActionResponse, CardReviewPayload } from "@/types"
import { CardStatus, wishlistPriority } from "@/types/database.helper"
import { Json } from "@/types/supabase"
import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

interface AddCardPayload {
    submitted_by: string,
    data: Json,
    status: CardStatus
}

// add card to the submissions table
export async function AddCard(payload: AddCardPayload): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.PHOTOCARD_SUBMISSIONS)
            .insert(payload)

        if (error) {
            console.error('Error at adding card to DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true }

    } catch (error) {
        console.error('Error at adding card to DB', error)
        return { success: false, error: error as Error }
    }
}

// Review card, accepted or rejected
export async function ReviewCard(
    type: 'accepted' | 'rejected',
    cardsData: CardReviewPayload | CardReviewPayload[],
    reasoning?: string,
): Promise<ActionResponse> {
    const supabase = await createClient()

    const cardArray = Array.isArray(cardsData) ? cardsData : [cardsData]
    const idArray = cardArray.map(c => c.submissionId)

    try {
        // 1. Update submission statuses
        const { error: statusError } = await supabase
            .from(TABLES.PHOTOCARD_SUBMISSIONS)
            .update({
                status: type,
                ...(reasoning && { rejection_reason: reasoning })
            })
            .in('id', idArray)

        if (statusError) return { success: false, error: statusError as Error }

        // 2. On accept — insert photocards + idol relationships
        if (type === 'accepted') {
            const approveCards = cardArray.filter((i): i is Required<CardReviewPayload> => !!i.data)

            // Insert photocards
            const { data: newCards, error: cardError } = await supabase
                .from(TABLES.PHOTOCARDS)
                .upsert(approveCards.map(i => ({
                    submission_id: i.submissionId,
                    name: i.data.name,
                    rarity: i.data.rarity,
                    front_image_url: i.data.front_image_url,
                    back_image_url: i.data.back_image_url,
                    release_id: i.data.release_id,
                    primary_group_id: i.data.primary_group_id,
                    distribution_type_id: i.data.distribution_type_id,
                    is_double_sided: i.data.is_double_sided,
                    is_horizontal: i.data.is_horizontal
                })), {
                    onConflict: 'submission_id',
                    ignoreDuplicates: true
                })
                .select()

            if (cardError) return { success: false, error: cardError as Error }

            // Insert idol relationships
            const idolRows = newCards.flatMap(newCard => {
                const match = approveCards.find(c => c.submissionId === newCard.submission_id)
                return (match?.data.idol_ids ?? []).map(idol_id => ({
                    card_id: newCard.id,
                    idol_id
                }))
            })

            if (idolRows.length > 0) {
                const { error: idolError } = await supabase
                    .from(TABLES.PHOTOCARDS_IDOL)
                    .upsert(idolRows, {
                        onConflict: 'card_id,idol_id',
                        ignoreDuplicates: true
                    })

                if (idolError) return { success: false, error: idolError as Error }
            }

            // Insert physical types relations
            const physicalrows = newCards.flatMap(newCard => {
                const card = approveCards.find(c => c.submissionId === newCard.submission_id)
                return (card?.data.physical_type_ids ?? []).map(physical_id => ({
                    card_id: newCard.id,
                    modifier_id: physical_id
                }))
            })

            if (physicalrows.length > 0) {
                const { error: modifierError } = await supabase
                    .from(TABLES.PHOTOCARD_MODIFIERS_GLOBAL)
                    .upsert(physicalrows, {
                        onConflict: 'card_id,modifier_id',
                        ignoreDuplicates: true
                    })

                if (modifierError) return { success: false, error: modifierError as Error }
            }
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error as Error }
    }
}

export async function AddCardToWishlist(userID: string, cardID: string, priority?: wishlistPriority): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.USER_WISHLIST)
            .insert({
                user_id: userID,
                card_id: cardID,
                priority: priority
            })

        if (error) {
            console.error('Error at adding user wishlist to DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true }
    } catch (error) {
        console.error('Error at adding user wishlist to DB', error)
        return { success: false, error: error as Error }
    }
}

export async function RemoveCardFromWishlist(userID: string, cardID: string): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.USER_WISHLIST)
            .delete()
            .eq('card_id', cardID)
            .eq('user_id', userID)

        if (error) {
            console.error('Error at removing user wishlist from DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true }
    } catch (error) {
        console.error('Error at removing user wishlist from DB', error)
        return { success: false, error: error as Error }
    }
}

export async function UpdateWishlistPriority(wishlistID: number, priority: wishlistPriority): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.USER_WISHLIST)
            .update({ priority: priority })
            .eq('id', wishlistID)

        if (error) {
            console.error('Error at updating user wishlist priority from DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true }
    } catch (error) {
        console.error('Error at updating user wishlist priority from DB', error)
        return { success: false, error: error as Error }
    }
}

export async function AddCardToCollection(userID: string, cardID: string): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.USER_COLLECTION)
            .upsert({
                user_id: userID,
                card_id: cardID,
                deleted_at: null
            }, {
                onConflict: 'user_id, card_id',
            })

        if (error) {
            console.error('Error at adding card to user collection to DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true }
    } catch (error) {
        console.error('Error at adding card to user collection to DB', error)
        return { success: false, error: error as Error }
    }
}

export async function RemoveCardFromCollection(userID: string, cardID: string): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.USER_COLLECTION)
            .update({ deleted_at: new Date().toISOString() })
            .eq('card_id', cardID)
            .eq('user_id', userID)

        if (error) {
            console.error('Error at removing card from user collection', error)
            return { success: false, error: error as Error }
        }

        return { success: true }
    } catch (error) {
        console.error('Error at removing card from user collection', error)
        return { success: false, error: error as Error }
    }
}

export async function MarkCard(collectionID: string, type: 'sale' | 'trade', pathName: string) {
    const supabase = await createClient()

    try {
        let error;

        if (type == 'sale') {
            const { error: saleError } = await supabase
                .from(TABLES.USER_COLLECTION)
                .update({ is_for_sale: true })
                .eq('id', collectionID)

            error = saleError
        } else {
            const { error: tradeError } = await supabase
                .from(TABLES.USER_COLLECTION)
                .update({ is_for_trade: true })
                .eq('id', collectionID)

            error = tradeError
        }

        if (error) {
            console.error('Error at marking card from user collection', error)
            return { success: false, error: error as Error }
        }

        revalidatePath(pathName)

        return { success: true }

    } catch (error) {
        console.error('Error at marking card from user collection', error)
        return { success: false, error: error as Error }
    }
}