import { TABLES } from "@/constants";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";

export async function getIdolsByGroup(groupID: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.IDOL_GROUPS)
        .select('id, idols(id, stage_name)')
        .eq('group_id', groupID);

    if (error) handleQueryError(error, 'getting idol data for forms');
    return data;
}