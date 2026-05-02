import { toSlug } from "./slug";

export const updateParam = (params: URLSearchParams, key: string, value: string | string[] | undefined | null) => {
    let effectiveValue: string | null = null;

    if (Array.isArray(value)) {
        if (value.length) effectiveValue = value.map(toSlug).join(',');
    } else if (value) {
        effectiveValue = toSlug(value);
    }

    if (effectiveValue !== null) {
        params.set(key, effectiveValue);
    } else {
        params.delete(key);
    }
};