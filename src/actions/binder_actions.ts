'use server'

import { createClient } from "@/utils/supabase/server";
import { TABLES } from "@/constants";
import { revalidatePath } from "next/cache";

export type BinderPayload = {
    user_id: string
    origin_template_id: string | null,
    name: string,
    cover_url: string,
    theme_color: string,
    breakdown: string[] | null,
    category: string | null,
    description: string | null,
    is_public: boolean
}

export async function CreateBinder(binderData: BinderPayload) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .rpc('create_binder_from_blank', {
                binder_payload: binderData
            })

        if (error) {
            console.error('Error at creating binder to DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true, data: data }
    } catch (error) {
        console.error('Error at creating binder to DB', error)
        return { success: false, error: error as Error }
    }
}

export async function CreateBinderFromTemplate(binderData: BinderPayload) {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .rpc('create_binder_from_template', {
                binder_payload: binderData
            })

        if (error) {
            console.error('Error at creating binder from template to DB', error)
            return { success: false, error: error as Error }
        }

        return { success: true, data: data }
    } catch (error) {
        console.error('Error at creating binder to DB', error)
        return { success: false, error: error as Error }
    }
}

export async function FillBinderCard(pageID: number, photocardID: string, position: number, pathName: string) {
    const supabase = await createClient()

    try {
        const payload = {
            page_id: pageID,
            photocard_id: photocardID,
            position: position
        }
        const { error } = await supabase
            .from(TABLES.BINDER_CARDS)
            .insert(payload)

        if (error) {
            console.error('Error at Filling in binder cards to DB', error)
            return { success: false, error: error as Error }
        }

        revalidatePath(pathName)

        return { success: true, data: null }
    } catch (error) {
        console.error('Error at Filling in binder cards to DB', error)
        return { success: false, error: error as Error }
    }
}

export async function pinUserBinder(isPinned: boolean, binderID: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.BINDERS)
            .update({ is_pinned: isPinned })
            .eq('id', binderID)

        if (error) {
            console.error('Error at pinning binder to DB', error)
            return { success: false, error: error as Error }
        }

        console.error('Error at pinning binder to DB', error)
        return { success: true, data: null }

    } catch (error) {
        console.error('Error at pinning binder to DB', error)
        return { success: false, error: error as Error }
    }
}


export async function RemoveBinderCard(binderCardID: number, pathName: string) {
    const supabase = await createClient()

    try {
        const { error } = await supabase
            .from(TABLES.BINDER_CARDS)
            .delete()
            .eq("id", binderCardID)

        if (error) {
            console.error('Error at Removing binder cards to DB', error)
            return { success: false, error: error as Error }
        }

        revalidatePath(pathName)

        return { success: true, data: null }
    } catch (error) {
        console.error('Error at Removing binder cards to DB', error)
        return { success: false, error: error as Error }
    }
}