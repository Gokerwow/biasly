import { toSlug } from "./slug";

export const updateParam = (params: URLSearchParams, key: string, value: string | undefined | null) => {
    if (value) {
        params.set(key, toSlug(value));
    } else {
        params.delete(key);
    }
};