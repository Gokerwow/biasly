import { Database } from './supabase';

// Helper to access table types easily
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T];

// Raw table types — one-to-one with Supabase schema
export type Profile = Tables<'profiles'>
export type Idol = Tables<'idols'>
export type Group = Tables<'groups'>
export type Photocard = Tables<'photocards'>
export type Release = Tables<'releases'>
export type CardDistributionType = Tables<'distribution_types'>
export type CardPhysicalType = Tables<'global_card_modifiers'>
export type LocalCollectionModifiers = Tables<'local_collection_modifiers'>
export type PhotocardSubmission = Tables<'photocard_submissions'>
export type UserCollection = Tables<'user_collection'>
export type UserWishlist = Tables<'user_wishlist'>
export type Binder = Tables<'binders'>
export type BinderPage = Tables<'binder_pages'>
export type BinderCard = Tables<'binder_cards'>
export type BanLog = Tables<'ban_logs'>
export type BanAppeal = Tables<'ban_appeals'>
export type IdolGroup = Tables<'idol_groups'>
export type ReleaseIdol = Tables<'releases_idol'>
export type PhotocardIdol = Tables<'photocards_idol'>

// Enums
export type CardRarity = Enums<'card_rarity'>
export type CardStatus = Enums<'card_status'>
export type wishlistPriority = Enums<'wishlist_priority'>