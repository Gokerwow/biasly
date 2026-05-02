'use client'

import { motion } from 'framer-motion'
import { Input } from '@/components/UI/input'
import { Book, Palette, Lock, Globe, Sparkles, Upload, NotebookPen, Grid3x3, Grid2x2, Square } from 'lucide-react'
import Image from 'next/image'
import { Binder } from '@/types'
import { COLOR_THEMES } from '@/constants'
import { BinderState } from './createClient'
import { useEffect, useState } from 'react'
import { getOptimizedImageUrl } from '@/helper/cloudinary'

export const dynamic = 'force-dynamic'

interface BinderConfigStepProps {
    binderData: Binder
    updateBinderData: (updates: Partial<BinderState>) => void
}

// Grid layout presets
const GRID_LAYOUTS = [
    {
        id: '3',
        value: 3,
        label: '3×3',
        description: '9 cards per page',
        icon: Grid3x3,
        recommended: true
    },
    {
        id: '2',
        value: 2,
        label: '2×2',
        description: '4 cards per page',
        icon: Grid2x2,
        recommended: false
    },
    {
        id: '1',
        value: 1,
        label: '1×1',
        description: '1 card per page',
        icon: Square,
        recommended: false
    },
]

export default function BinderConfigStep({ binderData, updateBinderData }: BinderConfigStepProps) {
    const selectedTheme = COLOR_THEMES.find(theme => theme.id === binderData.theme_color) || COLOR_THEMES[0]
    const [isCustomGrid, setIsCustomGrid] = useState(false)
    const [customGridValue, setCustomGridValue] = useState('')
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)

    const currentGridValue = Number(binderData.grid_layout) || 3
    const currentGridLayout = GRID_LAYOUTS.find(layout => layout.value === currentGridValue)

    useEffect(() => {
        console.log('BINDERDATA: ', binderData.origin_template_id)
    }, [binderData.origin_template_id])

    const handleGridSelect = (value: number) => {
        setIsCustomGrid(false)
        updateBinderData({ grid_layout: value })
    }

    const handleCustomGridToggle = () => {
        setIsCustomGrid(true)
        setCustomGridValue(String(currentGridValue))
    }

    const handleCustomGridChange = (value: string) => {
        setCustomGridValue(value)
        const numValue = parseInt(value)
        if (!isNaN(numValue) && numValue >= 1 && numValue <= 6) {
            updateBinderData({ grid_layout: numValue })
        }
    }

    return (
        <div className="flex flex-col gap-8">

            {/* --- STEP HEADER --- */}
            <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
                    <Book className="h-4 w-4 text-purple-500" />
                    <span className="text-xs font-black text-purple-400 uppercase tracking-wider">
                        Step 2 of 3
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tighter italic">
                    Customize Your Binder
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                    Personalize your collection with a name, theme, layout, and cover image
                </p>
            </div>

            {/* --- MAIN LAYOUT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                {/* LEFT: LIVE PREVIEW */}
                <div className="order-2 lg:order-1 lg:sticky lg:top-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Preview Label */}
                        <div className="flex items-center justify-center gap-2 mb-4">
                            <div className="h-px w-12 bg-gradient-to-r from-transparent to-gray-700"></div>
                            <span className="text-xs font-black text-gray-500 uppercase tracking-widest">
                                Live Preview
                            </span>
                            <div className="h-px w-12 bg-gradient-to-l from-transparent to-gray-700"></div>
                        </div>

                        {/* Binder Mockup */}
                        <div className="relative aspect-[3/4] max-w-md mx-auto">
                            {/* Shadow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-[3rem] blur-2xl opacity-60 scale-105" />

                            {/* Binder Body */}
                            <div className="relative h-full rounded-[2.5rem] overflow-hidden border-2 border-gray-800 bg-[#0B0E11] shadow-2xl">
                                {/* Cover Image */}
                                <div className="absolute inset-0">
                                    {binderData.cover_url ? (
                                        <Image
                                            src={previewUrl ?? getOptimizedImageUrl(binderData.cover_url)}
                                            alt="Binder Cover"
                                            fill
                                            className="object-cover opacity-40"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                    )}
                                </div>

                                {/* Theme Overlay */}
                                <div
                                    className={`absolute inset-0 bg-gradient-to-t ${selectedTheme.gradient} via-black/60 to-transparent opacity-80`}
                                    style={{
                                        background: `linear-gradient(to top, ${selectedTheme.color}80, rgba(0,0,0,0.6) 50%, transparent)`
                                    }}
                                />

                                {/* Ring Holes */}
                                <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-[2px] border-r border-white/10">
                                    {[...Array(6)].map((_, i) => (
                                        <div
                                            key={i}
                                            className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black/80 border border-white/20 shadow-inner"
                                            style={{ top: `${15 + i * 14}%` }}
                                        />
                                    ))}
                                </div>

                                {/* Content */}
                                <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                                    {/* Privacy Badge */}
                                    <div className="flex justify-end">
                                        {binderData.is_public ? (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                                                <Globe className="h-3 w-3 text-emerald-400" />
                                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                                    Public
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/80 backdrop-blur-md border border-gray-700">
                                                <Lock className="h-3 w-3 text-gray-400" />
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                    Private
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <div className="mb-3 flex items-center gap-2 flex-wrap">
                                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                                <Sparkles className="h-3 w-3 text-white" />
                                                <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                    {selectedTheme.name}
                                                </span>
                                            </div>

                                            {/* Grid Layout Badge */}
                                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-500/20 backdrop-blur-md border border-pink-500/30">
                                                {currentGridLayout ? (
                                                    <currentGridLayout.icon className="h-3 w-3 text-pink-400" />
                                                ) : (
                                                    <Grid3x3 className="h-3 w-3 text-pink-400" />
                                                )}
                                                <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">
                                                    {currentGridValue}×{currentGridValue} Grid
                                                </span>
                                            </div>
                                        </div>

                                        <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-3 drop-shadow-lg">
                                            {binderData.name || 'My Collection'}
                                        </h2>

                                        {binderData.description && (
                                            <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-3 drop-shadow-md">
                                                {binderData.description}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Spine Highlight */}
                                <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
                            </div>

                            {/* 3D Edge */}
                            <div className="absolute right-0 top-4 bottom-4 w-3 bg-gradient-to-l from-black/40 to-transparent rounded-r-3xl -mr-3 -z-10" />
                        </div>
                    </motion.div>
                </div>

                {/* RIGHT: CONFIGURATION FORM */}
                <div className="order-1 lg:order-2 space-y-6">

                    {/* Binder Details */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-pink-500/10">
                                <Book className="h-5 w-5 text-pink-500" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                Basic Information
                            </h3>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Binder Name *
                                </label>
                                <Input
                                    type="text"
                                    icon={NotebookPen}
                                    placeholder="e.g., Yuna Solo Collection"
                                    value={binderData.name}
                                    onChange={(e) => updateBinderData({ name: e.target.value })}
                                    name='name'
                                    className="w-full"
                                />
                                <p className="text-[10px] text-gray-600 mt-1.5">
                                    {binderData.name.length}/50 characters
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                    Description
                                </label>
                                <textarea
                                    placeholder="What makes this collection special?"
                                    value={binderData.description ?? ''}
                                    onChange={(e) => updateBinderData({ description: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-[#161B22] border border-gray-800 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all resize-none text-sm"
                                    rows={3}
                                    maxLength={200}
                                />
                                <p className="text-[10px] text-gray-600 mt-1.5">
                                    {binderData.description?.length || 0}/200 characters
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Grid Layout Selection */}
                    {!binderData.origin_template_id &&
                        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 rounded-xl bg-pink-500/10">
                                    <Grid3x3 className="h-5 w-5 text-pink-500" />
                                </div>
                                <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                    Page Layout
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {/* Preset Layouts */}
                                {GRID_LAYOUTS.map((layout) => {
                                    const isSelected = !isCustomGrid && currentGridValue === layout.value
                                    const Icon = layout.icon

                                    return (
                                        <button
                                            key={layout.id}
                                            onClick={() => handleGridSelect(layout.value)}
                                            className={`
                                            w-full p-4 rounded-xl border-2 transition-all text-left
                                            ${isSelected
                                                    ? 'border-pink-500 bg-pink-500/10'
                                                    : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50'
                                                }
                                        `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={`
                                                    p-2 rounded-lg transition-colors
                                                    ${isSelected ? 'bg-pink-500/20' : 'bg-gray-800'}
                                                `}>
                                                        <Icon className={`h-5 w-5 ${isSelected ? 'text-pink-400' : 'text-gray-400'}`} />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className={`text-sm font-black uppercase tracking-tight ${isSelected ? 'text-white' : 'text-gray-300'}`}>
                                                                {layout.label} Layout
                                                            </span>
                                                            {layout.recommended && (
                                                                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[9px] font-black text-emerald-400 uppercase tracking-wider">
                                                                    Popular
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className={`text-xs mt-0.5 ${isSelected ? 'text-gray-400' : 'text-gray-600'}`}>
                                                            {layout.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Selection Indicator */}
                                                <div className={`
                                                w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                                ${isSelected
                                                        ? 'border-pink-500 bg-pink-500'
                                                        : 'border-gray-700'
                                                    }
                                            `}>
                                                    {isSelected && (
                                                        <div className="w-2 h-2 rounded-full bg-white" />
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    )
                                })}

                                {/* Custom Layout Option */}
                                <button
                                    onClick={handleCustomGridToggle}
                                    className={`
                                    w-full p-4 rounded-xl border-2 transition-all text-left
                                    ${isCustomGrid
                                            ? 'border-pink-500 bg-pink-500/10'
                                            : 'border-gray-800 bg-gray-900/50 hover:border-gray-700 hover:bg-gray-800/50'
                                        }
                                `}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`
                                            p-2 rounded-lg transition-colors
                                            ${isCustomGrid ? 'bg-pink-500/20' : 'bg-gray-800'}
                                        `}>
                                                <Sparkles className={`h-5 w-5 ${isCustomGrid ? 'text-pink-400' : 'text-gray-400'}`} />
                                            </div>
                                            <div>
                                                <span className={`text-sm font-black uppercase tracking-tight ${isCustomGrid ? 'text-white' : 'text-gray-300'}`}>
                                                    Custom Layout
                                                </span>
                                                <p className={`text-xs mt-0.5 ${isCustomGrid ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    Choose your own grid size
                                                </p>
                                            </div>
                                        </div>

                                        {/* Selection Indicator */}
                                        <div className={`
                                        w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all
                                        ${isCustomGrid
                                                ? 'border-pink-500 bg-pink-500'
                                                : 'border-gray-700'
                                            }
                                    `}>
                                            {isCustomGrid && (
                                                <div className="w-2 h-2 rounded-full bg-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Custom Input (shown when selected) */}
                                    {isCustomGrid && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="pt-3 border-t border-pink-500/20"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                                                Grid Size (1-6)
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                max="6"
                                                value={customGridValue}
                                                onChange={(e) => handleCustomGridChange(e.target.value)}
                                                placeholder="Enter grid size"
                                                className="w-full px-4 py-2.5 rounded-lg bg-gray-900 border border-gray-700 text-white placeholder:text-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 outline-none transition-all text-sm"
                                            />
                                            <p className="text-[10px] text-gray-600 mt-1.5">
                                                A {customGridValue || '?'}×{customGridValue || '?'} grid will have {(parseInt(customGridValue) || 0) ** 2} cards per page
                                            </p>
                                        </motion.div>
                                    )}
                                </button>
                            </div>
                        </div>
                    }

                    {/* Color Theme */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-purple-500/10">
                                <Palette className="h-5 w-5 text-purple-500" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                Color Theme
                            </h3>
                        </div>

                        <div className="grid grid-cols-4 gap-3">
                            {COLOR_THEMES.map((theme) => (
                                <button
                                    key={theme.id}
                                    onClick={() => updateBinderData({ theme_color: theme.id })}
                                    className={`
                                        relative aspect-square rounded-xl border-2 transition-all
                                        ${selectedTheme.id === theme.id
                                            ? 'border-white scale-105 shadow-lg'
                                            : 'border-gray-800 hover:border-gray-600 hover:scale-105'
                                        }
                                    `}
                                    style={{ backgroundColor: theme.color }}
                                >
                                    {selectedTheme.id === theme.id && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center shadow-lg">
                                                <div className="w-2.5 h-2.5 rounded-full bg-black" />
                                            </div>
                                        </div>
                                    )}
                                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[9px] font-bold text-gray-500 whitespace-nowrap">
                                        {theme.name}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Cover Image */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 rounded-xl bg-blue-500/10">
                                <Sparkles className="h-5 w-5 text-blue-500" />
                            </div>
                            <h3 className="text-lg font-black text-white uppercase tracking-tighter">
                                Cover Image
                            </h3>
                        </div>

                        <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-dashed border-gray-700 bg-gray-900/50 group hover:border-pink-500/50 transition-all cursor-pointer">
                            {binderData.cover_url ? (
                                <Image
                                    src={previewUrl ?? getOptimizedImageUrl(binderData.cover_url)}
                                    alt="Cover preview"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <div className="p-4 rounded-full bg-gray-800 group-hover:bg-pink-500/20 transition-colors">
                                        <Upload className="h-6 w-6 text-gray-600 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-500 group-hover:text-gray-400 transition-colors">
                                        Click to upload
                                    </p>
                                </div>
                            )}

                            <input
                                type="file"
                                accept="image/*"
                                title="Upload cover image"
                                placeholder="Choose image"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) {
                                        const url = URL.createObjectURL(file)
                                        updateBinderData({ cover_url: url, cover_file: file })
                                        setPreviewUrl(url)
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-gray-600 mt-2">
                            Recommended: 800x600px or larger
                        </p>
                    </div>

                    {/* Privacy */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-gray-800/40 border border-gray-800">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-xl ${binderData.is_public ? 'bg-emerald-500/10' : 'bg-gray-500/10'}`}>
                                    {binderData.is_public ? (
                                        <Globe className="h-5 w-5 text-emerald-500" />
                                    ) : (
                                        <Lock className="h-5 w-5 text-gray-500" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-base font-black text-white uppercase tracking-tighter">
                                        {binderData.is_public ? 'Public Binder' : 'Private Binder'}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-0.5">
                                        {binderData.is_public ? 'Anyone can view your collection' : 'Only visible to you'}
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={() => updateBinderData({ is_public: !binderData.is_public })}
                                className={`
                                    relative inline-flex h-7 w-12 items-center rounded-full transition-colors
                                    ${binderData.is_public ? 'bg-emerald-500' : 'bg-gray-700'}
                                `}
                            >
                                <span
                                    className={`
                                        inline-block h-5 w-5 transform rounded-full bg-white transition-transform shadow-lg
                                        ${binderData.is_public ? 'translate-x-6' : 'translate-x-1'}
                                    `}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}