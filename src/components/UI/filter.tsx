'use client'

import { getRarityBorder, getRarityText, getShadow } from '@/helper'
import { CardRarity } from '@/types/database.helper'
import { Check, X, RotateCcw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Input } from './input'
import { SimpleDistribution, SimpleGroup, SimpleIdol } from '@/types'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { CARD_RARITY } from '@/constants'
import { updateParam } from '@/helper/params'
import { SimpleRelease } from '@/types/release'

export interface FilterProps {
    sort_by: string,
    distribution_type: SimpleDistribution | null,
    rarity: CardRarity[] | null
    groups: SimpleGroup[] | null
    idols?: SimpleIdol[] | null
    releases?: SimpleRelease[] | null
}

export interface FetchFilterProps {
    sort_by: string,
    distribution_type_id: string | null,
    raritys: string[] | null
    groups_ids: string[] | null
    idols_ids?: string[] | null
    releases_ids?: string[] | null
}

interface FilterMenuUIProps {
    onClose: () => void
    currentFilters: FilterProps
    groups?: SimpleGroup[]
    distributionTypes: SimpleDistribution[]
    hideGroupFilter?: boolean
}

export default function FilterMenuUI({ onClose, currentFilters, groups, distributionTypes, hideGroupFilter }: FilterMenuUIProps) {
    const searchParams = useSearchParams()
    const pathName = usePathname()
    const router = useRouter()

    const [selectedSort, setSelectedSort] = useState(currentFilters.sort_by || 'newest');
    const [selectedGroups, setSelectedGroups] = useState(currentFilters.groups || []);
    const [selectedDistType, setSelectedDistType] = useState(currentFilters.distribution_type || null);
    const [selectedRarity, setSelectedRarity] = useState<CardRarity[]>(currentFilters.rarity || []);
    const [groupSearch, setGroupSearch] = useState('');

    // Filter the list locally based on what user types
    const filteredGroups = groups?.filter(g =>
        g.name.toLowerCase().includes(groupSearch.toLowerCase())
    );

    const compRef = useRef<HTMLDivElement>(null)

    // 1. Define the exact pairings allowed
    type SelectAction =
        | { type: 'rarity', item: CardRarity }
        | { type: 'distributionType', item: SimpleDistribution }
        | { type: 'groups', item: SimpleGroup }

    // 2. The function only takes one argument: the action object
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

    const resetFilters = () => {
        setSelectedSort('')
        setSelectedGroups([])
        setSelectedDistType(null)
        setSelectedRarity([])
    }

    const handleConfirm = () => {
        const params = new URLSearchParams(searchParams.toString())

        const currentFilters = {
            sort_by: selectedSort,
            distribution_type: selectedDistType?.id,
            rarity: selectedRarity,
            groups: selectedGroups?.map(g => g.id)
        }

        Object.entries(currentFilters).forEach(([key, value]) => {
            updateParam(params, key, value)
        });

        const paramString = params.toString()
        const url = paramString ? `${pathName}?${paramString}` : pathName

        router.push(url, { scroll: false })
    }

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Element;
            if (target.closest('#filter-toggle-btn')) {
                return;
            }
            if (compRef.current && !compRef.current.contains(event?.target as Node)) {
                onClose();
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    })

    useEffect(() => {
        console.log(selectedDistType)
    }, [selectedDistType])

    return (
        <div ref={compRef} className="absolute top-full right-0 mt-2 w-72 rounded-2xl border border-white/10 bg-[#0d1117]/95 backdrop-blur-xl shadow-2xl z-[99] animate-in fade-in zoom-in-95 duration-200">

            <div className="flex items-center justify-between border-b border-white/5 p-4">
                <h3 className="font-bold text-white">Filters & Sort</h3>
                <button onClick={onClose} className="cursor-pointer rounded-lg p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors">
                    <X className="h-4 w-4" />
                </button>
            </div>

            <div className="max-h-[45vh] overflow-y-auto p-3 space-y-4">

                {/* -- SORT SECTION (Grid Buttons) -- */}
                <section>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Sort By</h4>
                    <div className="grid grid-cols-2 gap-2">
                        {/* Active Item Style */}
                        <button onClick={() => setSelectedSort('newest')} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium  transition-all ${selectedSort === 'newest' ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                            Newest First
                        </button>
                        {/* Inactive Item Style */}
                        <button onClick={() => setSelectedSort('oldest')} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium  transition-all ${selectedSort === 'oldest' ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                            Oldest First
                        </button>
                        <button onClick={() => setSelectedSort('name')} className={`cursor-pointer rounded-lg border px-3 py-2 text-xs font-medium  transition-all ${selectedSort === 'name' ? 'border-pink-500 bg-pink-500/10 text-pink-400' : 'border-white/5 bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'}`}>
                            Name (A-Z)
                        </button>
                    </div>
                </section>

                {/* -- GROUPS SECTION (Pills) -- */}
                {!hideGroupFilter &&
                    <>
                        <Input
                            name='group'
                            placeholder='Find a group...'
                            onChange={(e) => setGroupSearch(e.target.value)}
                            isSearch={true}
                        />
                        <section>
                            <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Groups</h4>
                            <div className="max-h-40 overflow-y-auto grid grid-cols-2 gap-1.5">
                                {filteredGroups?.map((item) =>
                                    <button
                                        onClick={() => handleSelect({ type: 'groups', item: item })}
                                        key={item.id}
                                        className={`cursor-pointer rounded-lg border text-xs font-medium px-2 py-1.5 transition-all
                    ${selectedGroups?.some(g => g.id === item.id)
                                                ? 'border-purple-500 bg-purple-500 text-white'
                                                : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/20'
                                            }`}
                                    >
                                        {item.name}
                                    </button>
                                )}
                            </div>
                        </section>
                    </>
                }



                {/* 4. RARITY SECTION (Using Pills style for compactness) */}
                <section>
                    <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">Rarity</h4>
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
                                        relative cursor-pointer overflow-hidden rounded-lg border px-3 py-1.5 text-xs font-bold transition-all
                                        ${isSelected
                                            ? `${borderStyle} ${borderStyle}/10 ${textStyle} ${shadowStyle}`
                                            : 'border-white/10 bg-black/20 text-gray-400 hover:border-white/20 hover:text-white'}
                                    `}
                                >
                                    {item}
                                </button>
                            )
                        })}
                    </div>
                </section>

                {/* -- CARD TYPE SECTION -- */}
                <section>
                    <h4 className="mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">Card Type</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                        {distributionTypes.map((item) =>
                            <button
                                onClick={() => handleSelect({ type: 'distributionType', item: item })}
                                key={item.id}
                                className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs transition-all
                    ${selectedDistType?.id === item.id
                                        ? 'bg-pink-500/20 border border-pink-500/50 text-pink-400'
                                        : 'bg-white/5 border border-white/5 text-gray-400 hover:bg-white/10'
                                    }`}
                            >
                                <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center flex-shrink-0
                    ${selectedDistType?.id === item.id ? 'border-pink-500 bg-pink-500' : 'border-white/20'}`}>
                                    {selectedDistType?.id === item.id && <Check className="h-2.5 w-2.5 text-white" />}
                                </div>
                                <span className="truncate">{item.name}</span>
                            </button>
                        )}
                    </div>
                </section>
            </div>

            {/* 4. FOOTER ACTIONS */}
            <div className="flex items-center gap-3 border-t border-white/5 p-4 bg-[#0d1117]">
                <button onClick={resetFilters} className="cursor-pointer flex items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-bold text-gray-400 hover:bg-white/10 hover:text-white transition-all w-1/3">
                    <RotateCcw className="h-4 w-4" />
                </button>
                <button onClick={handleConfirm} className="cursor-pointer flex-1 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg hover:shadow-pink-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Apply Filters
                </button>
            </div>
        </div>
    )
}