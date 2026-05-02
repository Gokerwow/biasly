import { UserCollection } from "./database.helper";
import { CleanPhotocard } from "./photocard";

export type FullUserCollections = UserCollection & {
    photocards: CleanPhotocard | null
}