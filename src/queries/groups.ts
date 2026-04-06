'use server'

import { TABLES } from "@/constants";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";

export async function getGroups(search?: string) {
    const supabase = await createClient();
    const query = supabase.from(TABLES.GROUPS).select('id, name');
    
    if (search) query.ilike('name', `%${search}%`);
    
    const { data, error } = await query;
    if (error) handleQueryError(error, 'getting group data for forms');
    return data;
}