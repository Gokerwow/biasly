import { TABLES } from "@/constants";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";
// import { paginatedQuery } from "./paginatedQuery";

export async function getAllTemplates() {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from(TABLES.TEMPLATES)
        .select(`
            *,
            author:profiles(
                *
            )
        `)
        .order('created_at')
    
    if (error) handleQueryError(error, 'Error at fetching templates ')
    
    return data
}