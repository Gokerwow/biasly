import { CardRarity } from "@/types";

export const BaseFandomURL = 'https://kpop.fandom.com/api.php';

const withDashboard = (path = '') => `/dashboard${path}`

export const ROUTES = {
    DASHBOARD: {
        INDEX: withDashboard(),
        CARDS: {
            INDEX: withDashboard('/cards'),
            CREATE: withDashboard('/cards/add'),
            UPDATE: withDashboard('/cards/update/:id'),
            APPROVE: withDashboard('/cards/approve')
        },
        USERMGMT: withDashboard('/manage-user'),
        REPORTS: withDashboard('/reports'),
        ANALYTICS: withDashboard('/system-analytics')
    },
    COLLECTION: {
        INDEX: '/collection',
        DETAIL: '/collection/detail/:id'
    },
    BROWSE: {
        INDEX: '/browse',
        DETAIL: '/browse/detail/:id'
    },
    WISHLIST: {
        INDEX: '/wishlist',
        DETAIL: '/wishlist/detail/:id'
    },
    BINDER: {
        INDEX: '/binder',
        TEMPLATES: '/binder/templates',
        DETAIL: '/binder/:id',
        CREATE: '/binder/create'
    }
}

export const ADMIN_ROUTES = [
    ROUTES.DASHBOARD.CARDS.APPROVE,
    ROUTES.DASHBOARD.CARDS.CREATE,
    ROUTES.DASHBOARD.CARDS.INDEX,
    ROUTES.DASHBOARD.CARDS.UPDATE,
    ROUTES.DASHBOARD.ANALYTICS,
    ROUTES.DASHBOARD.USERMGMT,
    ROUTES.DASHBOARD.REPORTS,
] as const

export const GroupsCategories = {
    // GROUPS
    CO_ED: 'Co-ed_groups',
    // CREWS: 'Crews',
    FEMALE_GROUPS: 'Female_groups',
    MALE_GROUPS: 'Male_groups',
    FICTIONAL: 'Fictional_groups',
    // PRE_DEBUT: 'Pre-debut_groups',
    PROJECT_GROUPS: 'Project_groups',
    SUPER_GROUPS: 'Supergroups',
    // TRAINEE_GROUPS: 'Trainee_groups',

    // BANDS
    CO_ED_BANDS: 'Co-ed_bands',
    FEMALE_BANDS: 'Female_bands',
    MALE_BANDS: 'Male_bands',

    // SUBUNITS
    CO_ED_SUBUNITS: 'Co-ed_subunits',
    FEMALE_SUBUNITS: 'Female_subunits',
    MALE_SUBUNITS: 'Male_subunits',

    // DUOS
    CO_ED_DUOS: 'Co-ed_duos',
    FEMALE_DUOS: 'Female_duos',
    MALE_DUOS: 'Male_duos',

    // VIRTUAL
    VIRTUAL_GROUPS: 'Virtual_groups',
}

export const IndividualCategories = {
    // INDIVIDUALS (MALE)
    MALE_SOLOISTS: 'Male_soloists',
    MALE_SINGERS: 'Male_singers',
    MALE_RAPPERS: 'Male_rappers',
    MALE_TRAINEES: 'Male_trainees',
    MALE_COMPOSERS: 'Male_composers',
    MALE_LYRICISTS: 'Male_lyricists',
    MALE_PRODUCERS: 'Male_producers',
    MALE_SONGWRITERS: 'Male_songwriters',

    // INDIVIDUALS (FEMALE)
    FEMALE_SOLOISTS: 'Female_soloists',
    FEMALE_SINGERS: 'Female_singers',
    FEMALE_RAPPERS: 'Female_rappers',
    FEMALE_TRAINEES: 'Female_trainees',
    FEMALE_COMPOSERS: 'Female_composers',
    FEMALE_LYRICISTS: 'Female_lyricists',
    FEMALE_PRODUCERS: 'Female_producers',
    FEMALE_SONGWRITERS: 'Female_songwriters',

    // VIRTUAL
    VIRTUAL_SINGERS: 'Virtual_singers'
}

export const TABLES = {
    PHOTOCARDS: 'photocards',
    PHOTOCARDS_IDOL: 'photocards_idol',
    GLOBAL_CARDS_MODIFIERS: 'global_card_modifiers',
    LOCAL_COLLECTION_MODIFIERS: 'local_collection_modifiers',
    PHOTOCARD_MODIFIERS_GLOBAL: 'photocards_modifiers_global',
    RELEASES: 'releases',
    RELEASES_IDOL: 'releases_idol',
    GROUPS: 'groups',
    IDOLS: 'idols',
    IDOL_GROUPS: 'idol_groups',
    DISTRIBUTION_TYPES: 'distribution_types',
    CARD_MODIFIERS: 'card_modifiers',
    USER_COLLECTION: 'user_collection',
    USER_WISHLIST: 'user_wishlist',
    BINDERS: 'binders',
    BINDER_PAGES: 'binder_pages',
    BINDER_CARDS: 'binder_cards',
    TEMPLATES: 'templates',
    TEMPLATE_PAGES: 'template_pages',
    TEMPLATE_SLOTS: 'template_slots',
    PROFILES: 'profiles',
    BAN_LOGS: 'ban_logs',
    BAN_APPEALS: 'ban_appeals',
    PHOTOCARD_SUBMISSIONS: 'photocard_submissions',
} as const

export const rarityConfig: Record<string, {
    badge: string
    border: string
    glow: string
    label: string
}> = {
    UR:  { badge: 'text-yellow-300 border-yellow-400/50 bg-yellow-400/15',    border: 'group-hover:border-yellow-400/60',  glow: 'group-hover:shadow-yellow-400/25',  label: 'text-yellow-300'  },
    SSR: { badge: 'text-purple-300 border-purple-400/50 bg-purple-400/15',    border: 'group-hover:border-purple-400/60',  glow: 'group-hover:shadow-purple-400/25',  label: 'text-purple-300'  },
    SR:  { badge: 'text-blue-300 border-blue-400/50 bg-blue-400/15',          border: 'group-hover:border-blue-400/60',    glow: 'group-hover:shadow-blue-400/25',    label: 'text-blue-300'    },
    R:   { badge: 'text-emerald-300 border-emerald-400/50 bg-emerald-400/15', border: 'group-hover:border-emerald-400/60', glow: 'group-hover:shadow-emerald-400/25', label: 'text-emerald-300' },
    N:   { badge: 'text-gray-400 border-gray-500/50 bg-gray-500/15',          border: 'group-hover:border-gray-500/40',    glow: 'group-hover:shadow-gray-500/10',    label: 'text-gray-400'    },
}

export const priorityConfig: Record<'high' | 'medium' | 'low', string> = {
    high: 'bg-gradient-to-r from-red-600 to-rose-500 shadow-red-500/50',
    medium: 'bg-gradient-to-r from-amber-500 to-orange-400 shadow-amber-500/50',
    low: 'bg-gradient-to-r from-gray-600 to-gray-500 shadow-gray-500/30',
}

export const CARD_RARITY: readonly CardRarity[] = ['N', 'R', 'SR', 'SSR', 'UR'] as const;

export const COLOR_THEMES = [
    { id: 'pink', name: 'Bubblegum', gradient: 'from-pink-500', color: '#ec4899' },
    { id: 'purple', name: 'Lavender', gradient: 'from-purple-600', color: '#9333ea' },
    { id: 'blue', name: 'Ocean', gradient: 'from-blue-500', color: '#3b82f6' },
    { id: 'emerald', name: 'Mint', gradient: 'from-emerald-500', color: '#10b981' },
    { id: 'amber', name: 'Honey', gradient: 'from-amber-500', color: '#f59e0b' },
    { id: 'rose', name: 'Rose', gradient: 'from-rose-500', color: '#f43f5e' },
    { id: 'cyan', name: 'Sky', gradient: 'from-cyan-500', color: '#06b6d4' },
    { id: 'violet', name: 'Grape', gradient: 'from-violet-600', color: '#7c3aed' },
]