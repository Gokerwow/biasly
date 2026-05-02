import { Profile, Templates } from "./database.helper";

export type TemplatesWithAuthor = Templates & {
    author: Profile
}