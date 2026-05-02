'use server'

import { ActionResponse, BinderGrids, templateStatus } from "@/types"
import { createClient } from "@/utils/supabase/server"

export type CardWithPages = {
    photocard_id: string
    position: number
    page_number: number
}

export type Templatespayload = {
    author_id: string,
    cover_url: string,
    description: string,
    grid_layout: number,
    is_official: boolean,
    name: string,
    status: templateStatus,
    theme_color: string,
    total_cards: number,
    total_pages: number,
    category: string,
    breakdown: string[],
    cardWithPages: CardWithPages[]
}

export async function CreateTemplate(templateData: Templatespayload): Promise<ActionResponse> {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .rpc('create_templates', {
                templates_payload: templateData
            })

        if (error) {
            console.error('Error at creating template to DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true, data: null }
    } catch (error) {
        console.error('Error at creating template to DB', error)
        return { success: false, error: error as Error }
    }
} 