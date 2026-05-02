import { UserWishlist } from "./database.helper";
import { CleanPhotocard } from "./photocard";

export type FullWishlists = UserWishlist & {
    photocards: CleanPhotocard | null
}