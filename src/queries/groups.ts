'use server'

import { TABLES } from "@/constants";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";
import { applyGenericFilters, FilterRule, SortRule } from "./appylyFilters";
import { paginatedQuery } from "./paginatedQuery";

export async function getGroups(search?: string) {
    const supabase = await createClient();
    const query = supabase.from(TABLES.GROUPS).select('id, name');

    if (search) query.ilike('name', `%${search}%`);

    const { data, error } = await query;
    if (error) handleQueryError(error, 'getting group data for forms');
    return data;
}

export async function getAllGroups(
    search?: string,
    page: number = 1,
    pageSize: number = 12,
    filters: FilterRule[] = [],
    sort?: SortRule
) {
    const SELECT_QUERY = `
            *
        `

    const finalRules = [...filters]

    if (search) {
        finalRules.push({ column: 'name', operator: 'ilike', value: `%${search}%` })
    }

    const results = await paginatedQuery(
        'group_with_member_counts',
        { page, pageSize },
        SELECT_QUERY,
        (q) => applyGenericFilters(q, finalRules, sort)
    )

    console.log('Groups Data: ', results)

    return results
}
