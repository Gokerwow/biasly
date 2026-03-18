import { PhotocardSubmission } from './database.helper'
import { PhotocardData } from './photocard'

// Submission with typed data jsonb + joined submitter profile
export type CardWithDetail = Omit<PhotocardSubmission, 'data'> & {
    data: PhotocardData
    submitted_by_profile: {
        id: string
        email: string | null
        username: string | null
        avatar_url: string | null
    } | null
}