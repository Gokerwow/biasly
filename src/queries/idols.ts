import { TABLES } from "@/constants";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";
import { applyGenericFilters, FilterRule, SortRule } from "./appylyFilters";
import { paginatedQuery } from "./paginatedQuery";

export async function getIdolsByGroup(groupID: string) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from(TABLES.IDOL_GROUPS)
        .select('id, idols(id, stage_name)')
        .eq('group_id', groupID);

    if (error) handleQueryError(error, 'getting idol data for forms');
    return data;
}

export async function getAllIdols(
    search?: string,
    page: number = 1,
    pageSize: number = 10,
    filters: FilterRule[] = [],
    sort?: SortRule
) {
    const SELECT_QUERY = `
        *,
        idol_groups(
            groups(
                id,
                name
            )
        )   
    `

    const finalRules = [...filters]

    if (search) {
        finalRules.push({ column: 'stage_name', operator: 'ilike', value: `%${search}%` })
    }

    const results = await paginatedQuery(
        TABLES.IDOLS,
        { page, pageSize },
        SELECT_QUERY,
        (q) => applyGenericFilters(q, finalRules, sort)
    )

    console.log('Idols Data: ', results)

    return results

}