'use client'

import React, { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, Loader2, LucideIcon, X } from "lucide-react";

interface Item {
    id: string | number;
    name: string;
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
    | { mode?: 'normal'; onSelect: (item: Item | null) => void }
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
    const [chipItems, setChipItems] = useState<Item[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isMounted = useRef(false);

    // Filter logic
    const filteredItems = query === ""
        ? items
        : items.filter((item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );

    // Focus input when container is clicked
    const handleContainerClick = () => {
        if (!disabled) {
            inputRef.current?.focus();
            setIsOpen(true);
        }
    };

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                if (query !== selectedName) setQuery(selectedName);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [query, selectedName]);

    // Notify parent when chipItems change (tag mode)
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        if (mode === 'tag') (onSelect as (items: Item[]) => void)(chipItems);
    }, [chipItems]);

    const handleSelect = (item: Item) => {
        if (mode === 'tag') {
            setChipItems(prev => {
                const exists = prev.find(i => i.id === item.id);
                return exists ? prev.filter(c => c.id !== item.id) : [...prev, item];
            });
            setQuery('');
            inputRef.current?.focus();
        } else {
            if (selectedName === item.name) {
                setSelectedName('');
                setQuery('');
                (onSelect as (item: Item | null) => void)(null);
            } else {
                setSelectedName(item.name);
                setQuery(item.name);
                (onSelect as (item: Item | null) => void)(item);
            }
            setIsOpen(false);
        }
    };

    const removeChip = (e: React.MouseEvent, id: string | number) => {
        e.stopPropagation();
        setChipItems(prev => prev.filter(c => c.id !== id));
    };

    // Backspace removes last chip when input is empty
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && query === '' && mode === 'tag' && chipItems.length > 0) {
            setChipItems(prev => prev.slice(0, -1));
        }
        if (e.key === 'Escape') {
            setIsOpen(false);
            inputRef.current?.blur();
        }
    };

    const isFocused = isOpen;
    const hasChips = mode === 'tag' && chipItems.length > 0;

    return (
        <div
            ref={dropdownRef}
            className={`space-y-2 relative ${disabled ? "opacity-50 pointer-events-none" : ""}`}
        >
            <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>

            {/* ── INPUT CONTAINER ── */}
            <div
                onClick={handleContainerClick}
                className={`
                    flex flex-wrap items-center gap-1.5 w-full min-h-11
                    rounded-xl border bg-[#0B0E11] px-3 py-2 cursor-text
                    transition-all duration-150
                    ${isFocused
                        ? 'border-purple-500 ring-1 ring-purple-500'
                        : 'border-gray-700 hover:border-gray-600'
                    }
                `}
            >
                {/* Leading icon — only show when no chips */}
                {Icon && !hasChips && (
                    <Icon className="h-4 w-4 shrink-0 text-gray-500" />
                )}

                {/* Chips */}
                {mode === 'tag' && chipItems.map((chip) => (
                    <span
                        key={chip.id}
                        className="
                            inline-flex items-center gap-1.5 shrink-0
                            rounded-md border border-purple-500/25 bg-purple-500/10
                            px-2.5 py-1 text-xs font-semibold text-purple-200
                            transition-colors hover:border-purple-500/50 hover:bg-purple-500/20
                        "
                    >
                        {chip.name}
                        <button
                            type="button"
                            onClick={(e) => removeChip(e, chip.id)}
                            className="flex items-center text-purple-400/70 hover:text-purple-200 transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                {/* Input — always visible, follows chips naturally */}
                <input
                    ref={inputRef}
                    name={name}
                    type="text"
                    value={query}
                    placeholder={hasChips ? '' : placeholder}
                    disabled={disabled}
                    autoComplete="off"
                    onChange={(e) => {
                        const val = e.target.value;
                        setQuery(val);
                        setIsOpen(true);
                        if (onQueryChange) onQueryChange(val);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                    className="
                        flex-1 min-w-[80px] bg-transparent border-none outline-none
                        text-sm text-white placeholder-gray-500 py-0.5
                    "
                />

                {/* Arrow / Loader */}
                <div className="ml-auto shrink-0 pl-1 flex gap-2">
                    {mode === 'tag' && chipItems.length > 1 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                setChipItems([]);
                            }}
                            className="ml-auto cursor-pointer shrink-0 text-[10px] font-bold text-gray-500 hover:text-red-400 transition-colors uppercase tracking-wide"
                        >
                            Clear all
                        </button>
                    )}
                    {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                    ) : (
                        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                    )}
                </div>
            </div>

            {/* ── DROPDOWN ── */}
            {isOpen && (
                <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-gray-700 bg-[#0B0E11] shadow-xl shadow-black/40 animate-in fade-in zoom-in-95 duration-100">
                    <div className="max-h-60 overflow-y-auto py-1 custom-scrollbar">
                        {isLoading ? (
                            <div className="px-4 py-3 text-sm text-gray-400 flex items-center justify-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
                                <span>Searching...</span>
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="px-4 py-3 text-sm text-gray-500">
                                No results found.
                            </div>
                        ) : (
                            filteredItems.slice(0, 50).map((item) => {
                                const isSelected = mode === 'tag'
                                    ? chipItems.some(c => c.id === item.id)
                                    : selectedName === item.name;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleSelect(item)}
                                        className={`
                                            flex w-full items-center justify-between px-4 py-2.5
                                            text-left text-sm transition-colors
                                            ${isSelected
                                                ? 'bg-purple-500/10 text-purple-200'
                                                : 'text-gray-300 hover:bg-[#2A2D35] hover:text-white'
                                            }
                                        `}
                                    >
                                        <span>{item.name}</span>
                                        {isSelected && (
                                            <Check className="h-4 w-4 text-purple-500 shrink-0" />
                                        )}
                                    </button>
                                );
                            })
                        )}

                        {!isLoading && filteredItems.length > 50 && (
                            <div className="px-4 py-2 text-xs text-gray-500 text-center border-t border-gray-800">
                                Keep typing to see more results...
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}