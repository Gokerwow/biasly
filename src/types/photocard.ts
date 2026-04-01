import { CardRarity, Photocard } from './database.helper'
import { SimpleDistribution } from './distribution_type'
import { SimpleGlobalModifier } from './globalModifier'
import { SimpleGroup } from './group'
import { SimpleIdol } from './idols'
import { SimpleRelease } from './release'

// Artist/subject type for form and card display
export type ArtistType = 'group' | 'unit' | 'solo'

export type CleanPhotocard = Photocard & {
    group: SimpleGroup
    idols: SimpleIdol[]
    distribution_type: SimpleDistribution
    physical_types_global: SimpleGlobalModifier[]
    releases: SimpleRelease
}

// photocard data for list view with all relations joined
export type ListPhotocard = Photocard & {
    groups: SimpleGroup | null
    releases: SimpleRelease | null
    distribution_types: SimpleDistribution | null
    photocards_modifiers_global : {
        global_modifier: SimpleGlobalModifier | null
    }[]
    photocards_idol: {
        idol: SimpleIdol | null
    }[]
}

// What gets stored in Supabase jsonb — raw IDs only
export interface PhotocardDataPayload {
    name: string
    rarity: CardRarity
    front_image_url: string
    back_image_url: string
    release_id: string | null
    primary_group_id: string
    distribution_type_id: string
    physical_type_ids: number[]
    idol_ids: string[]
    subject_type: ArtistType
    is_double_sided: boolean
    is_horizontal: boolean
}

// What gets used in the UI — resolved names added at fetch time
export interface PhotocardData extends PhotocardDataPayload {
    group_name: string | null
    idol_names: string[]
    modifier_names?: string[]
    distribution_name: string | null
}

export interface CardReviewPayload {
    submissionId: string
    data?: PhotocardDataPayload
}