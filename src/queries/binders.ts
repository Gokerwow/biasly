'use server'

import { TABLES } from "@/constants"
import { handleQueryError } from "@/helper/errorHandling"
import { createClient } from "@/utils/supabase/server"

export async function getUserBinders(userID: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from(TABLES.BINDERS)
        .select(`
            *
        `)
        .eq('user_id', userID)
    
    if (error) handleQueryError(error, 'Error at fetching users binders ')
    
    return data
}

export async function getBinderDetail(binderID: string) {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from(TABLES.BINDERS)
        .select(`
            *,
            binder_pages(
                *,
                binder_cards(
                    *,
                    photocards(
                        *,
                        user_collection(
                            id,
                            condition
                        ),
                        user_wishlist(
                            id
                        ),
                        photocards_idol(
                            idol:idols(
                                stage_name
                            )
                        )
                    )
                )
            )
        `)
        .eq('id', binderID)
        .single()

    if (error) handleQueryError(error, 'Error at fetching binder Details')

    return data
}