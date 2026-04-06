import { TABLES } from "@/constants"
import { handleQueryError } from "@/helper/errorHandling"
import { createClient } from "@/utils/supabase/server"

export async function getDistributionTypes() {
    const supabase = await createClient()
    
    const { data, error } = await supabase
        .from(TABLES.DISTRIBUTION_TYPES)
        .select('id, name')

    if (error) handleQueryError(error, 'Error at fetching distribution types')

    return data
}

export async function getCardTypes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.DISTRIBUTION_TYPES)
        .select('id, name, rarity_weight, description');

    if (error) handleQueryError(error, 'getting card types data');
    return data;
}