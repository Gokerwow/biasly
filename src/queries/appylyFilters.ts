/* eslint-disable @typescript-eslint/no-explicit-any */
export type FilterOperator = 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like' | 'ilike' | 'is' | 'in';

export interface FilterRule {
    column: string;
    operator: FilterOperator;
    value: any;
}

export interface SortRule {
    column: string;
    ascending?: boolean;
}

export const applyGenericFilters = (query: any, filters: FilterRule[] = [], sort?: SortRule) => {
    let q = query

    for (const filter of filters) {
        q = q[filter.operator](filter.column, filter.value)
    }

    if (sort) {
        q = q.order(sort.column, {
            ascending: sort.ascending ?? false
        })
    }

    return q
}