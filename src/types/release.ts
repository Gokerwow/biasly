import { SimpleGroup } from "./group"
import { CleanPhotocard } from "./photocard"

export interface SimpleRelease {
    id: string
    title: string | null
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