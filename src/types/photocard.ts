import { CardDistributionType, CardPhysicalType, CardRarity, Group, Photocard, Release } from './database.helper'
import { SimpleDistribution } from './distribution_type'
import { SimpleGroup } from './group'
import { SimpleIdol } from './idols'
import { SimpleRelease } from './release'

// Artist/subject type for form and card display
export type ArtistType = 'group' | 'unit' | 'solo'

// Full photocard with all relations joined
export type FullPhotocard = Photocard & {
    group: Group
    releases: Release
    distribution_type: CardDistributionType
    physical_types: CardPhysicalType[]
    idols: { stage_name: string }[]
}

// photocard data for list view with all relations joined
export type ListPhotocard = Photocard & {
    groups: SimpleGroup | null
    releases: SimpleRelease | null
    distribution_types: SimpleDistribution | null
    photocards_idol: {
        idol: SimpleIdol | null
    }[]
}

// What gets stored in Supabase jsonb — raw IDs only
export interface PhotocardDataPayload {
    name: string                        
    rarity: CardRarity                  
    front_image_url: string             
    release_id: string | null
    primary_group_id: string            
    distribution_type_id: string | null
    idol_ids: string[]
    subject_type: ArtistType
}

// What gets used in the UI — resolved names added at fetch time
export interface PhotocardData extends PhotocardDataPayload {
    group_name: string | null
    idol_names: string[]
}

export interface CardReviewPayload {
    submissionId: string
    data?: PhotocardDataPayload
}