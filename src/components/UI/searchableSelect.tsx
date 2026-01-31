'use client'

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Loader2, LucideIcon, X } from "lucide-react";

interface Item {
    id: string;
    name: string;
    [key: string]: any;
}

interface BaseProps {
    items: Item[];
    label: string;
    placeholder?: string;
    icon?: LucideIcon;
    onQueryChange?: (value: string) => void;
    disabled?: boolean;
    isLoading?: boolean;
    name: string;
}

type SearchableSelectProps = BaseProps & (
    | { mode?: 'normal'; onSelect: (item: Item) => void }
    | { mode: 'tag'; onSelect: (items: Item[]) => void }
);

export default function SearchableSelect({
    items,
    label,
    placeholder = "Select...",
    icon: Icon,
    onSelect,
    onQueryChange,
    isLoading = false,
    disabled = false,
    name,
    mode = 'normal'
}: SearchableSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [selectedName, setSelectedName] = useState("");
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [chipItems, setChipItems] = useState<Item[]>([])

    // Filter logic
    const filteredItems = query === ""
        ? items
        : items.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                // If user typed something but didn't select, revert to the valid selection
                if (query !== selectedName) {
                    setQuery(selectedName);
                }
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [query, selectedName]);

    // ✅ FIXED: Only call onSelect in tag mode, and skip initial empty render
    useEffect(() => {
        if (mode === 'tag' && chipItems.length > 0) {
            onSelect(chipItems);
        }
    }, [chipItems, mode])

    const handleSelect = (item: Item) => {
        if (mode === 'tag') {
            setChipItems(prev => {
                const isExisted = prev.find(i => i.id === item.id)

                return isExisted ? prev.filter((chip) => chip.id !== item.id) : [...prev, item];
            })
            setQuery('');
        } else {
            if (selectedName === item.name) {
                setSelectedName('');
                setQuery('');
                // ✅ Pass the item even when deselecting (parent can handle it)
                onSelect(item);
            } else {
                setSelectedName(item.name);
                setQuery(item.name);
                onSelect(item);
            }
            setIsOpen(false);
        }
    };

    return (
        <div
            ref={dropdownRef}
            className={`space-y-2 relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
            <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>

            <div onClick={() => setIsOpen(true)} className="relative">
                <div className="
                    h-11 flex items-center gap-2 w-full rounded-xl border border-gray-700 bg-[#0B0E11] px-4 
                    transition-all focus-within:border-purple-500 focus-within:ring-1 focus-within:ring-purple-500
                ">
                    {/* Icon */}
                    {Icon && <Icon className="h-4 w-4 shrink-0 text-gray-500" />}

                    {/* Scrollable Container */}
                    <div className={`flex flex-1 items-center ${chipItems.length > 0 ? 'gap-2' : ''} overflow-x-auto no-scrollbar h-full`}>

                        {/* Tags */}
                        {mode === 'tag' && chipItems.length > 0 && (
                            <div className="flex gap-2 shrink-0 items-center">
                                {chipItems.map((chip, index) => (
                                    <div key={index} className="
                                        group inline-flex items-center gap-2 shrink-0
                                        rounded-full border border-purple-500/20 bg-purple-500/10
                                        px-3 py-1 text-xs font-bold text-purple-200 tracking-wide
                                        transition-all hover:border-purple-500/50 hover:bg-purple-500/20
                                    ">
                                        <span className="leading-none">{chip.name}</span>
                                        <button 
                                            type="button" 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setChipItems(prev => prev.filter(c => c.id !== chip.id));
                                            }}
                                            className="text-purple-400 hover:text-white flex items-center"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Input */}
                        <input
                            name={name}
                            type="text"
                            value={query}
                            placeholder={placeholder}
                            disabled={disabled}
                            autoComplete="off"
                            onChange={(e) => {
                                const val = e.target.value;
                                setQuery(val);
                                setIsOpen(true);
                                if (onQueryChange) onQueryChange(val);
                            }}
                            className="
                                flex-1 min-w-[80px] bg-transparent border-none outline-none 
                                text-sm text-white placeholder-gray-500 h-full
                            "
                        />
                    </div>

                    {/* Arrow/Loader */}
                    <div className="shrink-0">
                        {isLoading ? (
                            <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                        ) : (
                            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                        )}
                    </div>
                </div>

                {/* Dropdown Menu */}
                {isOpen && (
                    <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-gray-700 bg-[#0B0E11] shadow-xl animate-in fade-in zoom-in-95 duration-100">
                        <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">

                            {/* 1. CHECK LOADING FIRST */}
                            {isLoading ? (
                                <div className="px-4 py-3 text-sm text-gray-400 flex items-center justify-center gap-2">
                                    <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                    <span>Searching...</span>
                                </div>
                            ) : filteredItems.length === 0 ? (

                                /* 2. Then check if empty */
                                <div className="px-4 py-3 text-sm text-gray-500">
                                    No results found.
                                </div>

                            ) : (

                                /* 3. Finally show results */
                                filteredItems.slice(0, 50).map((item) => {
                                    const isSelected = selectedName === item.name || chipItems.some(c => c.id === item.id);

                                    return (
                                        <button
                                            key={item.id}
                                            type="button"
                                            onClick={() => handleSelect(item)}
                                            className="flex w-full items-center justify-between px-4 py-2.5 text-left text-sm text-gray-300 hover:bg-[#2A2D35] hover:text-white transition-colors"
                                        >
                                            <span>{item.name}</span>
                                            {isSelected && (
                                                <Check className="h-4 w-4 text-purple-500" />
                                            )}
                                        </button>
                                    )
                                })
                            )}

                            {/* Pagination / More items hint */}
                            {!isLoading && filteredItems.length > 50 && (
                                <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-800">
                                    Keep typing to see more results...
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}