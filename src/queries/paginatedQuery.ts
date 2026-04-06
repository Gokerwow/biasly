/* eslint-disable @typescript-eslint/no-explicit-any */
import { handleQueryError } from "@/helper/errorHandling"
import { Database } from "@/types/supabase"
import { createClient } from "@/utils/supabase/server"

interface PaginationParams {
    page: number
    pageSize: number
}

export interface PaginationResult<T> {
    data: T[]
    total: number
    page: number
    pageSize: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}

export async function paginatedQuery<
    TTable extends keyof Database['public']['Tables'],
    TData = Database['public']['Tables'][TTable]['Row']
>(
    tableName: TTable,
    params: PaginationParams,
    selectQuery: string = '*',
    filters?: (query: any) => any
): Promise<PaginationResult<TData>> {
    const supabase = await createClient()

    const from = (params.page - 1) * params.pageSize
    const to = from + params.pageSize - 1

    let query = supabase
        .from(tableName)
        .select(selectQuery, { count: 'exact' })
        .range(from, to)

    if (filters) {
        query = filters(query)
    }

    const { data, count, error } = await query

    if (error) handleQueryError(error, `Error at fetching paginations results for ${tableName}`)

    return {
        data: (data as TData[]) ?? [],
        total: count ?? 0,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil((count ?? 0) / params.pageSize),
        hasNextPage: to < (count ?? 0) - 1,
        hasPreviousPage: params.page > 1
    }

}