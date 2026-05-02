import { Binder, BinderCard, BinderPage, Photocard, UserCollection } from "./database.helper";

export type FullBinderDetail = Binder & {
    binder_pages: BinderPage & {
        binder_cards: BinderCard & {
            user_collection: UserCollection & {
                photocards: Photocard
            }
        }
    }
}