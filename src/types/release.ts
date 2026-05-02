import { SimpleGroup } from "./group"
import { CleanPhotocard, SimplePhotocard } from "./photocard"

export interface SimpleRelease {
    id: string
    title: string
}

export type BrowseRelease = {
    id: string
    title: string
    category: string
    release_date: string | null
    created_at: string | null
    group_id: string | null
    group: SimpleGroup | null
    photocards: CleanPhotocard[]
}
export type BrowseFeaturedRelease = {
    id: string
    title: string
    category: string
    release_date: string | null
    created_at: string | null
    group_id: string | null
    groups: SimpleGroup | null
    photocards: SimplePhotocard[]
}