'use client'

import { Button } from '@/components/UI/button'
import { Sparkles, Plus, Layers, Grid3x3 } from 'lucide-react'
import { useState } from 'react'
import { BinderTemplateCard } from '@/components/binder/binderTemplateCard'
import { Templates } from '@/types'
import { InferQueryType } from '@/helper/queryType'
import { getAllTemplates } from '@/queries/templates'
import { TemplatesWithAuthor } from '@/types/templates'

export const dynamic = 'force-dynamic'

const FILTERS = ['All', 'Official', 'Community', 'Full Group', 'Solo Member']
type AutoTemplateType = InferQueryType<typeof getAllTemplates>

interface BinderTemplatesStepProps {
    templatesData: AutoTemplateType
    onTemplate: (template: Templates) => void
    onBlank: () => void
}


export default function BinderTemplatesStep({ templatesData, onTemplate, onBlank }: BinderTemplatesStepProps) {
    const [activeFilter, setActiveFilter] = useState('All')

    const filteredTemplates = templatesData.filter(t => {
        if (activeFilter === 'All') return true
        if (activeFilter === 'Official') return t.is_official === true
        if (activeFilter === 'Community') return t.is_official === false
        return t.category === activeFilter
    })

    const handleSelectTemplate = (template: TemplatesWithAuthor) => {
        onTemplate(template)
    }

    const handleCreateBlank = () => {
        onBlank()
    }

    return (
        <div className="flex flex-col gap-8">

            {/* --- STEP HEADER --- */}
            <div className="text-center max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 mb-4">
                    <Sparkles className="h-4 w-4 text-pink-500" />
                    <span className="text-xs font-black text-pink-400 uppercase tracking-wider">
                        Step 1 of 3
                    </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white mb-3 uppercase tracking-tighter italic">
                    Choose Your Starting Point
                </h2>
                <p className="text-gray-400 text-sm md:text-base">
                    Start with a pre-designed template or build from scratch. Templates include pre-configured sections and layouts.
                </p>
            </div>

            {/* --- STATS CARDS --- */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-pink-500/10 to-pink-500/5 border border-pink-500/20">
                    <div className="p-2 rounded-xl bg-pink-500/20">
                        <Grid3x3 className="h-5 w-5 text-pink-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">{templatesData.length}</p>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Templates</p>
                    </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-purple-500/5 border border-purple-500/20">
                    <div className="p-2 rounded-xl bg-purple-500/20">
                        <Layers className="h-5 w-5 text-purple-400" />
                    </div>
                    <div>
                        <p className="text-2xl font-black text-white">{FILTERS.length - 2}</p>
                        <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Categories</p>
                    </div>
                </div>
            </div>

            {/* --- BLANK CANVAS (FEATURED OPTION) --- */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-700 bg-gradient-to-br from-gray-900/60 to-gray-800/40 group hover:border-pink-500/50 hover:from-pink-500/5 hover:to-purple-500/5 transition-all duration-300">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 md:p-8">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-500 to-purple-500 group-hover:scale-110 transition-transform">
                            <Plus className="h-8 w-8 text-white" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter italic mb-1 group-hover:text-pink-400 transition-colors">
                                Start from Scratch
                            </h3>
                            <p className="text-sm text-gray-400">
                                Build your own custom binder with complete creative control
                            </p>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={handleCreateBlank}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Create Blank
                    </Button>
                </div>
            </div>

            {/* --- DIVIDER --- */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-800"></div>
                </div>
                <div className="relative flex justify-center">
                    <span className="px-4 text-sm font-black text-gray-600 bg-[#0B0E11] uppercase tracking-wider">
                        Or choose a template
                    </span>
                </div>
            </div>

            {/* --- TEMPLATES SECTION --- */}
            <div className="flex flex-col gap-6">
                {/* FILTER TABS */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {FILTERS.map(filter => (
                        <button
                            key={filter}
                            onClick={() => setActiveFilter(filter)}
                            className={`
                                px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300
                                ${activeFilter === filter 
                                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-lg scale-105' 
                                    : 'bg-gray-800/50 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700/50 hover:border-gray-600'
                                }
                            `}
                        >
                            {filter}
                        </button>
                    ))}
                </div>

                {/* Results Count */}
                <p className="text-center text-sm text-gray-500">
                    Showing <span className="font-black text-white">{filteredTemplates.length}</span> {filteredTemplates.length === 1 ? 'template' : 'templates'}
                </p>

                {/* TEMPLATES GRID */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {filteredTemplates.map(template => (
                        <BinderTemplateCard
                            key={template.id}
                            template={template}
                            onSelect={handleSelectTemplate}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-gray-800 rounded-2xl">
                        <div className="p-4 rounded-full bg-gray-800/50 mb-4">
                            <Sparkles className="h-10 w-10 text-gray-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-300 mb-2">No Templates Found</h3>
                        <p className="text-sm text-gray-500 mb-6 max-w-sm">
                            No templates match this filter. Try a different category or start from scratch.
                        </p>
                        <Button variant="outline" onClick={() => setActiveFilter('All')}>
                            Show All Templates
                        </Button>
                    </div>
                )}
            </div>
        </div>
    )
}