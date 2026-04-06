import { TABLES } from "@/constants";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";

export async function getPhysicalTypes() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.GLOBAL_CARDS_MODIFIERS)
        .select('id, name, modifier, description');

    if (error) handleQueryError(error, 'getting physical types data');
    return data;
}