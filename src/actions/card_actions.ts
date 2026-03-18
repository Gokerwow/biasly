"use server"

import { TABLES } from "@/constants"
import { ActionResponse, CardReviewPayload, CardWithDetail, PhotocardDataPayload } from "@/types"
import { CardStatus } from "@/types/database.helper"
import { Json } from "@/types/supabase"
import { createClient } from "@/utils/supabase/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface AddCardPayload {
    submitted_by: string,
    data: Json,
    status: CardStatus
}

// Self expolainable
export async function UploadImageToCloudinary(formData: FormData, filename: string): Promise<ActionResponse<{ url: string }>> {
    try {
        const file = formData.get('file') as File
        const buffer = Buffer.from(await file.arrayBuffer())

        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

        const result = await cloudinary.uploader.upload(base64, {
            public_id: filename,
            folder: 'Biasly/Photocards',
            quality: 'auto',
            fetch_format: 'auto',
        })

        return { success: true, data: { url: result.secure_url } }

    } catch (error) {
        console.error('Error at uploading image to cloudinary', error)
        return { success: false, error: error as Error }
    }
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
                    release_id: i.data.release_id,
                    primary_group_id: i.data.primary_group_id,
                    distribution_type_id: i.data.distribution_type_id,
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
        }

        return { success: true }
    } catch (error) {
        return { success: false, error: error as Error }
    }
}