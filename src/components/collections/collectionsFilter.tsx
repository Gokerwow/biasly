'use client'

import { getRarityBorder, getRarityText, getShadow } from '@/helper'
import { CardRarity } from '@/types/database.helper'
import { Check, Filter, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { SimpleDistribution, SimpleGroup, SimpleIdol, SimpleRelease } from '@/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CARD_RARITY } from '@/constants'
import { updateParam } from '@/helper/params'

export interface FilterProps {
    sort_by: string,
    distribution_type: SimpleDistribution | null,
    rarity: CardRarity[] | null
    groups: SimpleGroup[] | null
    idols?: SimpleIdol[] | null
    releases?: SimpleRelease[] | null
}

interface CollectionFilterMenuProps {
    currentFilters: FilterProps
    groups: SimpleGroup[]
    idols: SimpleIdol[]
    releases: SimpleRelease[]
    distributionTypes: SimpleDistribution[]
}

export default function CollectionFilterMenu({
    currentFilters,
    groups,
    idols,
    releases,
    distributionTypes
}: CollectionFilterMenuProps) {
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const router = useRouter()

    const [selectedSort, setSelectedSort] = useState(currentFilters.sort_by || 'newest');
    const [selectedGroups, setSelectedGroups] = useState<SimpleGroup[]>(currentFilters.groups || []);
    const [selectedIdols, setSelectedIdols] = useState<SimpleIdol[]>(currentFilters.idols || []);
    const [selectedReleases, setSelectedReleases] = useState<SimpleRelease[]>(currentFilters.releases || []);
    const [selectedDistType, setSelectedDistType] = useState(currentFilters.distribution_type || null);
    const [selectedRarity, setSelectedRarity] = useState<CardRarity[]>(currentFilters.rarity || []);

    const [groupSearch, setGroupSearch] = useState('');
    const [idolSearch, setIdolSearch] = useState('');
    const [releaseSearch, setReleaseSearch] = useState('');

    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        sort: true,
        groups: true,
        idols: false,
        releases: false,
        rarity: false,
        cardType: false
    });

    // Filter the lists locally based on what user types
    const filteredGroups = groups.filter(g =>
        g.name.toLowerCase().includes(groupSearch.toLowerCase())
    );

    const filteredIdols = idols.filter(i =>
        i.stage_name?.toLowerCase().includes(idolSearch.toLowerCase())
    );

    const filteredReleases = releases.filter(r =>
        r.title?.toLowerCase().includes(releaseSearch.toLowerCase())
    );

    // Define the exact pairings allowed
    type SelectAction =
        | { type: 'rarity', item: CardRarity }
        | { type: 'distributionType', item: SimpleDistribution }
        | { type: 'groups', item: SimpleGroup }
        | { type: 'idols', item: SimpleIdol }
        | { type: 'releases', item: SimpleRelease }

    // The function only takes one argument: the action object
    const handleSelect = (action: SelectAction) => {

        if (action.type === 'rarity') {
            setSelectedRarity(prev => {
                if (prev.includes(action.item)) {
                    return prev.filter(r => action.item != r)
                } else {
                    return [...prev, action.item]
                }
            })
        }

        if (action.type === 'groups') {
            setSelectedGroups(prev => {
                // 1. Check by ID
                const exists = prev.some(g => g.id === action.item.id);

                if (exists) {
                    // 2. Remove by ID (Don't compare the whole object!)
                    return prev.filter(g => g.id !== action.item.id);
                } else {
                    // 3. Add the object
                    return [...prev, action.item];
                }
            });
        }

        if (action.type === 'idols') {
            setSelectedIdols(prev => {
                const exists = prev.some(i => i.id === action.item.id);

                if (exists) {
                    return prev.filter(i => i.id !== action.item.id)
                } else {
                    return [...prev, action.item]
                }
            })
        }

        if (action.type === 'releases') {
            setSelectedReleases(prev => {
                const exists = prev.some(g => g.id === action.item.id);

                if (exists) {
                    return prev.filter(r => r.id !== action.item.id)
                } else {
                    return [...prev, action.item]
                }
            })
        }

        if (action.type === 'distributionType') {
            setSelectedDistType(action.item)
        }
    }

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    }

    const resetFilters = () => {
        setSelectedSort('newest')
        setSelectedGroups([])
        setSelectedIdols([])
        setSelectedReleases([])
        setSelectedDistType(null)
        setSelectedRarity([])
    }

    const hasActiveFilters =
        selectedGroups.length > 0 ||
        selectedIdols.length > 0 ||
        selectedReleases.length > 0 ||
        selectedRarity.length > 0 ||
        selectedDistType !== null;

    // Auto-apply filters on change
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString())

        const filters = {
            sort_by: selectedSort,
            distribution_type: selectedDistType?.name,
            rarity: selectedRarity,
            groups: selectedGroups?.map(g => g.name),
            idols:   selectedIdols?.map(i => i.stage_name),
            releases: selectedReleases?.map(r => r.title)
        }

        Object.entries(filters).forEach(([key, value]) => {
            updateParam(params, key, value)
        });

        const paramString = params.toString()
        const url = paramString ? `${pathName}?${paramString}` : pathName

        router.push(url, { scroll: false })
    }, [selectedSort, selectedGroups, selectedIdols, selectedReleases, selectedDistType, selectedRarity])

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2 text-white">
                    <Filter className="h-4 w-4 text-pink-500" />
                    <span className="font-bold">Filters</span>
                </div>
                {hasActiveFilters && (
                    <button
                        onClick={resetFilters}
                        className="text-xs text-pink-500 hover:text-pink-400 font-medium transition-colors"
                    >
                        Clear all
                    </button>
                )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">

                {/* -- SORT SECTION -- */}
                <section>
                    <button
                        onClick={() => toggleSection('sort')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                            Sort By
                        </h4>
                        {expandedSections.sort ? (
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                    </button>
                    {expandedSections.sort && (
                        <div className="space-y-2">
                            <button
                                onClick={() => setSelectedSort('newest')}
                                className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all ${selectedSort === 'newest'
                                        ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                        : 'border-gray-800 bg-gray-800/30 text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                    }`}
                            >
                                Newest First
                            </button>
                            <button
                                onClick={() => setSelectedSort('oldest')}
                                className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all ${selectedSort === 'oldest'
                                        ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                        : 'border-gray-800 bg-gray-800/30 text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                    }`}
                            >
                                Oldest First
                            </button>
                            <button
                                onClick={() => setSelectedSort('name')}
                                className={`w-full cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium transition-all ${selectedSort === 'name'
                                        ? 'border-pink-500 bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg'
                                        : 'border-gray-800 bg-gray-800/30 text-gray-400 hover:bg-gray-800/50 hover:text-white'
                                    }`}
                            >
                                Name (A-Z)
                            </button>
                        </div>
                    )}
                </section>

                {/* -- GROUPS SECTION -- */}
                <section>
                    <button
                        onClick={() => toggleSection('groups')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                                Groups
                            </h4>
                            {selectedGroups.length > 0 && (
                                <span className="text-xs text-pink-500 font-medium bg-pink-500/10 px-2 py-0.5 rounded-full">
                                    {selectedGroups.length}
                                </span>
                            )}
                        </div>
                        {expandedSections.groups ? (
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                    </button>
                    {expandedSections.groups && (
                        <>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={groupSearch}
                                    onChange={(e) => setGroupSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-gray-800/30 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                {filteredGroups.map((group) => (
                                    <label
                                        key={group.id}
                                        className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 rounded-lg p-2 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedGroups.some(g => g.id === group.id)}
                                            onChange={() => handleSelect({ type: 'groups', item: group })}
                                            className="sr-only"
                                        />
                                        <div className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${selectedGroups.some(g => g.id === group.id)
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-transparent'
                                                : 'border-gray-600 bg-transparent group-hover:border-pink-500'
                                            }`}>
                                            {selectedGroups.some(g => g.id === group.id) && (
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors flex-1">
                                            {group.name}
                                        </span>
                                    </label>
                                ))}
                                {filteredGroups.length === 0 && (
                                    <span className="text-xs text-gray-500 block text-center py-4">No groups found</span>
                                )}
                            </div>
                        </>
                    )}
                </section>

                {/* -- IDOLS SECTION -- */}
                <section>
                    <button
                        onClick={() => toggleSection('idols')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                                Idols
                            </h4>
                            {selectedIdols.length > 0 && (
                                <span className="text-xs text-purple-500 font-medium bg-purple-500/10 px-2 py-0.5 rounded-full">
                                    {selectedIdols.length}
                                </span>
                            )}
                        </div>
                        {expandedSections.idols ? (
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                    </button>
                    {expandedSections.idols && (
                        <>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={idolSearch}
                                    onChange={(e) => setIdolSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-gray-800/30 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                {filteredIdols.map((idol) => (
                                    <label
                                        key={idol.id}
                                        className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 rounded-lg p-2 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIdols.some(i => i.id === idol.id)}
                                            onChange={() => handleSelect({ type: 'idols', item: idol })}
                                            className="sr-only"
                                        />
                                        <div className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${selectedIdols.some(i => i.id === idol.id)
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-transparent'
                                                : 'border-gray-600 bg-transparent group-hover:border-pink-500'
                                            }`}>
                                            {selectedIdols.some(i => i.id === idol.id) && (
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors flex-1">
                                            {idol.stage_name}
                                        </span>
                                    </label>
                                ))}
                                {filteredIdols.length === 0 && (
                                    <span className="text-xs text-gray-500 block text-center py-4">No idols found</span>
                                )}
                            </div>
                        </>
                    )}
                </section>

                {/* -- RELEASES SECTION -- */}
                <section>
                    <button
                        onClick={() => toggleSection('releases')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                                Releases
                            </h4>
                            {selectedReleases.length > 0 && (
                                <span className="text-xs text-blue-500 font-medium bg-blue-500/10 px-2 py-0.5 rounded-full">
                                    {selectedReleases.length}
                                </span>
                            )}
                        </div>
                        {expandedSections.releases ? (
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                    </button>
                    {expandedSections.releases && (
                        <>
                            <div className="relative mb-3">
                                <Search className="absolute left-3 top-1/2 h-3 w-3 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    value={releaseSearch}
                                    onChange={(e) => setReleaseSearch(e.target.value)}
                                    className="w-full rounded-lg border border-gray-800 bg-gray-800/30 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-gray-500 focus:border-pink-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div className="max-h-40 overflow-y-auto space-y-1 custom-scrollbar">
                                {filteredReleases.map((release) => (
                                    <label
                                        key={release.id}
                                        className="flex items-center gap-2 cursor-pointer group hover:bg-white/5 rounded-lg p-2 transition-colors"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedReleases.some(r => r.id === release.id)}
                                            onChange={() => handleSelect({ type: 'releases', item: release })}
                                            className="sr-only"
                                        />
                                        <div className={`flex h-4 w-4 items-center justify-center rounded border transition-all ${selectedReleases.some(r => r.id === release.id)
                                                ? 'bg-gradient-to-r from-pink-500 to-purple-500 border-transparent'
                                                : 'border-gray-600 bg-transparent group-hover:border-pink-500'
                                            }`}>
                                            {selectedReleases.some(r => r.id === release.id) && (
                                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-300 group-hover:text-white transition-colors flex-1 truncate">
                                            {release.title}
                                        </span>
                                    </label>
                                ))}
                                {filteredReleases.length === 0 && (
                                    <span className="text-xs text-gray-500 block text-center py-4">No releases found</span>
                                )}
                            </div>
                        </>
                    )}
                </section>

                {/* -- RARITY SECTION -- */}
                <section>
                    <button
                        onClick={() => toggleSection('rarity')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                                Rarity
                            </h4>
                            {selectedRarity.length > 0 && (
                                <span className="text-xs text-pink-500 font-medium bg-pink-500/10 px-2 py-0.5 rounded-full">
                                    {selectedRarity.length}
                                </span>
                            )}
                        </div>
                        {expandedSections.rarity ? (
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                    </button>
                    {expandedSections.rarity && (
                        <div className="flex flex-wrap gap-2">
                            {CARD_RARITY.map((item) => {
                                const isSelected = selectedRarity?.includes(item);
                                const borderStyle = getRarityBorder(item)
                                const textStyle = getRarityText(item)
                                const shadowStyle = getShadow(item)
                                return (
                                    <button
                                        key={item}
                                        onClick={() => handleSelect({ type: 'rarity', item: item })}
                                        className={`
                                            relative cursor-pointer overflow-hidden rounded-lg border px-2.5 py-1 text-xs font-bold transition-all
                                            ${isSelected
                                                ? `${borderStyle} ${borderStyle}/10 ${textStyle} ${shadowStyle}`
                                                : 'border-gray-800 bg-gray-800/30 text-gray-400 hover:border-gray-700 hover:text-white'}
                                        `}
                                    >
                                        {item}
                                    </button>
                                )
                            })}
                        </div>
                    )}
                </section>

                {/* -- CARD TYPE SECTION -- */}
                <section>
                    <button
                        onClick={() => toggleSection('cardType')}
                        className="w-full flex items-center justify-between mb-3 group"
                    >
                        <div className="flex items-center gap-2">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 group-hover:text-gray-400 transition-colors">
                                Card Type
                            </h4>
                            {selectedDistType && (
                                <span className="text-xs text-pink-500 font-medium bg-pink-500/10 px-2 py-0.5 rounded-full">
                                    1
                                </span>
                            )}
                        </div>
                        {expandedSections.cardType ? (
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                        ) : (
                            <ChevronDown className="h-3 w-3 text-gray-500" />
                        )}
                    </button>
                    {expandedSections.cardType && (
                        <div className="space-y-1">
                            {distributionTypes.map((item) =>
                                <label
                                    key={item.id}
                                    className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-2 hover:bg-white/5 group"
                                    onClick={() => handleSelect({ type: 'distributionType', item: item })}
                                >
                                    <span className="text-xs text-gray-400 group-hover:text-white transition-colors">
                                        {item.name}
                                    </span>
                                    <div className={`h-4 w-4 rounded border transition-colors ${selectedDistType?.id === item.id
                                            ? 'flex items-center justify-center border-pink-500 bg-pink-500 text-white'
                                            : 'border-gray-700 bg-transparent group-hover:border-gray-600'
                                        }`}>
                                        {selectedDistType?.id === item.id && <Check className="h-2.5 w-2.5" />}
                                    </div>
                                </label>
                            )}
                        </div>
                    )}
                </section>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #4a5568;
                    border-radius: 2px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #718096;
                }
            `}</style>
        </div>
    )
}