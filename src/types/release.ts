import { Photocard } from "./database.helper"
import { SimpleDistribution } from "./distribution_type"
import { SimpleGroup } from "./group"
import { SimpleIdol } from "./idols"

export interface SimpleRelease {
    id: string
    title: string | null
}

export type BrowsePhotocard = Photocard & {
    photocards_idol: {
        idol: SimpleIdol | null
    }[]
    distribution_types: SimpleDistribution | null
}

export type BrowseRelease = {
    id: string
    title: string
    category: string
    release_date: string | null
    created_at: string | null
    group_id: string | null
    groups: SimpleGroup | null
    photocards: BrowsePhotocard[]
}