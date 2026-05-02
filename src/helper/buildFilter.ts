import { FilterRule } from "@/queries/appylyFilters"
import { CardRarity } from "@/types"

interface photocardFilterState {
    searchQuery?: string
    selectedGroups?: string[]
    selectedIdols?: string[]
    selectedRarities?: CardRarity[]
    selectedDistributions?: string
    selectedPhysical?: string[]
    selectedReleases?: string
}

interface ReleaseFilterState {
    groupIds?: string[]
    rarities?: string[]
    distributionTypeId?: string | null
}

export const buildPhotocardFilterRules = (uiState: photocardFilterState): FilterRule[] => {
    const rules: FilterRule[] = []

    // If the user typed something, add a search rule
    if (uiState.searchQuery) {
        rules.push({ 
            column: 'name',
            operator: 'ilike', 
            value: `%${uiState.searchQuery}%` 
        })
    }

    // If they checked group boxes, add an 'in' rule
    if (uiState.selectedGroups && uiState.selectedGroups.length > 0) {
        rules.push({ 
            column: 'primary_group_id', 
            operator: 'in', 
            value: uiState.selectedGroups 
        })
    }

    if (uiState.selectedDistributions) {
        rules.push({ 
            column: 'distribution_type_id', 
            operator: 'eq', 
            value: uiState.selectedDistributions 
        })
    }

    if (uiState.selectedIdols && uiState.selectedIdols.length > 0) {
        rules.push({ 
            column: 'photocards_idol.idol_id', 
            operator: 'in', 
            value: uiState.selectedIdols 
        })
    }

    if (uiState.selectedRarities && uiState.selectedRarities.length > 0) {
        rules.push({ 
            column: 'rarity', 
            operator: 'in', 
            value: uiState.selectedRarities 
        })
    }

    if (uiState.selectedPhysical && uiState.selectedPhysical.length > 0) {
        rules.push({ 
            column: 'photocards_modifiers_global.modifier_id', 
            operator: 'in', 
            value: uiState.selectedPhysical 
        })
    }

    if (uiState.selectedReleases) {
        rules.push({ 
            column: 'release_id', 
            operator: 'eq', 
            value: uiState.selectedReleases 
        })
    }

    return rules
}

export const buildReleasesFilterRules = (state: ReleaseFilterState): FilterRule[] => {
    const rules: FilterRule[] = []

    // 1. Group Filter (Master Table - Releases)
    if (state.groupIds && state.groupIds.length > 0) {
        rules.push({ 
            column: 'group_id', 
            operator: 'in', 
            value: state.groupIds 
        })
    }

    // 2. Rarity Filter (Nested Table - Photocards)
    if (state.rarities && state.rarities.length > 0) {
        rules.push({ 
            column: 'photocards.rarity', 
            operator: 'in', 
            value: state.rarities 
        })
    }

    // 3. Distribution Filter (Nested Table - Photocards)
    if (state.distributionTypeId) {
        rules.push({ 
            column: 'photocards.distribution_type_id', 
            operator: 'eq', 
            value: state.distributionTypeId 
        })
    }

    return rules
}