/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronLeft, ChevronRight, Share2, Download,
    Book, BookOpen, Monitor, LayoutGrid, Layers, Palette,
    Printer,
    Code,
    List,
    FileText,
    Image,
    Link,
    Loader2
} from 'lucide-react'
import { CardSlot } from '@/components/binder/cardSlot'
import { CardSidebar } from '@/components/binder/cardSidebar'
import { getBinderDetail } from '@/queries/binders'
import { FillBinderCard, RemoveBinderCard } from '@/actions/binder_actions'
import { useToast } from '@/app/providers/toastProvider'
import { usePathname } from 'next/navigation'
import { BinderFilledSlot } from '@/components/binder/filledCardSlot'
import { getUserCollections } from '@/queries/userCollections'
import { useUser } from '@/app/providers/authProvider'
import { CreateTemplate, Templatespayload } from '@/actions/template_actions'
import { InferQueryType } from '@/helper/queryType'
import { getApprovedCards, getUserWishlist } from '@/queries/photocards'
import { FilterProps } from '@/components/UI/filter'
import { SimpleDistribution, SimpleGroup } from '@/types'

export const dynamic = 'force-dynamic'

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

type AutoBinderType = InferQueryType<typeof getBinderDetail>
type AutoCollectionType = InferQueryType<typeof getUserCollections>
type AutoWishlistType = InferQueryType<typeof getUserWishlist>
type AutoCardsType = InferQueryType<typeof getApprovedCards>

interface CreateBinderClientProps {
    userCollections: AutoCollectionType
    userWishlists: AutoWishlistType
    binderData: AutoBinderType
    cardsData: AutoCardsType
    currentFilters: FilterProps
    groups: SimpleGroup[]
    distributionTypes: SimpleDistribution[]
}

type ViewMode = 'classic' | 'board' | 'grid'

export default function BinderDetailClient({ userCollections, userWishlists, binderData, cardsData, currentFilters, groups, distributionTypes }: CreateBinderClientProps) {
    const { profile } = useUser()
    const { showToast } = useToast()
    const pathName = usePathname()

    // UI States
    const [viewMode, setViewMode] = useState<ViewMode>('classic')
    const [activeTheme, setActiveTheme] = useState(COLOR_THEMES[0])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [currentTarget, setCurrentTarget] = useState({
        page_number: 0,
        card_slot: 0,
    })

    // OPEN STATE
    const [isThemePickerOpen, setIsThemePickerOpen] = useState(false)
    const [isShareMenuOpen, setIsShareMenuOpen] = useState(false)
    const [isExportMenuOpen, setIsExportMenuOpen] = useState(false)

    // LOADING STATE
    const [isTemplateShareLoading, setIsTemplateShareLoading] = useState(false)

    // Derived Data
    const binderPages = binderData.binder_pages
    const totalPages = binderPages.length
    const totalClassicPairs = Math.ceil(totalPages / 2)
    const slotsPerPage = Number(binderData.grid_layout) * Number(binderData.grid_layout)
    const binderCards = binderPages.flatMap(p => p.binder_cards)

    // Handlers
    const handleAddCard = (pageIndex: number, slotIndex: number) => {
        setCurrentTarget({ page_number: pageIndex, card_slot: slotIndex })
        setIsSidebarOpen(true)
    }

    const handleConfirmCard = async (photocardID: string) => {
        const result = await FillBinderCard(currentTarget.page_number, photocardID, currentTarget.card_slot, pathName)
        if (result.error) {
            showToast('Failed to fill card slot', 'error')
        } else {
            showToast('Slot Filled Successfully', 'success')
            setIsSidebarOpen(false)
        }
    }

    const handleRemoveCard = async (binderCardID: number) => {
        const result = await RemoveBinderCard(binderCardID, pathName)
        if (result.error) {
            showToast('Failed to remove card slot', 'error')
        } else {
            showToast('Slot removed Successfully', 'success')
        }
    }

    const handleTemplateShare = async () => {
        setIsTemplateShareLoading(true)

        const payload: Templatespayload = {
            author_id: profile!.id,
            cover_url: binderData.cover_url,
            description: binderData.description ?? '',
            grid_layout: binderData.grid_layout ?? 3,
            is_official: false,
            name: binderData.name,
            status: 'pending',
            theme_color: binderData.theme_color,
            total_cards: binderCards.length,
            category: binderData.category ?? '',
            breakdown: binderData.breakdown ?? [],
            total_pages: binderPages.length,
            cardWithPages: binderPages.flatMap(p => p.binder_cards.flatMap(c => ({
                photocard_id: c.photocard_id,
                position: c.position,
                page_number: p.page_number
            })))
        }

        const result = await CreateTemplate(payload)

        if (!result?.error) {
            showToast('Successfully shared as a template', 'success')
        } else {
            console.error('Error at creating template payload: ', result?.error)
            showToast('Failed to create template', 'error')
        }

        setIsTemplateShareLoading(false)
        setIsShareMenuOpen(false)
    }

    const switchView = (mode: ViewMode) => {
        setViewMode(mode)
        setCurrentIndex(0)
    }

    // --- RENDERERS ---

    const renderClassicView = () => {
        const leftPage = binderPages[currentIndex * 2]
        const rightPage = binderPages[currentIndex * 2 + 1]

        return (
            <div className="relative w-full max-w-[95rem] mx-auto px-8 md:px-16 flex-1 flex items-center justify-center py-8">

                {/* Floating Nav */}
                <button
                    onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className={`absolute cursor-pointer left-2 md:left-8 z-30 p-4 rounded-full backdrop-blur-md transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-gray-900/80 hover:scale-110 hover:shadow-lg'}`}
                >
                    <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                    onClick={() => currentIndex < totalClassicPairs - 1 && setCurrentIndex(currentIndex + 1)}
                    disabled={currentIndex === totalClassicPairs - 1}
                    className={`absolute cursor-pointer right-2 md:right-8 z-30 p-4 rounded-full backdrop-blur-md transition-all ${currentIndex === totalClassicPairs - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-gray-900/80 hover:scale-110 hover:shadow-lg'}`}
                >
                    <ChevronRight className="h-8 w-8" />
                </button>

                {/* PHYSICAL BINDER CONTAINER */}
                <div className="relative w-full max-w-[85rem] mx-auto">

                    {/* The Outer Binder Cover (Themed) */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${activeTheme.gradient} to-gray-900 rounded-[2rem] md:rounded-[3rem] border-4 border-black/40 shadow-2xl overflow-hidden transition-colors duration-500`}>
                        {/* Faux leather/plastic texture overlay */}
                        <div
                            className="absolute inset-0 opacity-[0.15] mix-blend-overlay"
                            style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'100\' height=\'100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100\' height=\'100\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")' }}
                        />

                        {/* Inner Cover Shadow for depth */}
                        <div className="absolute inset-2 md:inset-4 rounded-[1.5rem] md:rounded-[2.5rem] shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
                    </div>

                    {/* The Inner Pocket Pages */}
                    <div className="relative p-4 md:p-8 z-10 flex">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={`classic-${currentIndex}`}
                                initial={{ opacity: 0, rotateY: 10 }}
                                animate={{ opacity: 1, rotateY: 0 }}
                                exit={{ opacity: 0, rotateY: -10 }}
                                transition={{ duration: 0.4 }}
                                className="w-full flex rounded-[3rem] bg-gray-900/60 backdrop-blur-sm border border-white/10"
                                style={{ transformStyle: 'preserve-3d', perspective: '1000px' }}
                            >
                                {/* LEFT PAGE */}
                                <div className="flex-1 relative border-r border-black/50 p-6 md:p-10 bg-gradient-to-r from-transparent to-black/20">
                                    {leftPage ? (
                                        <div className={`grid grid-cols-${binderData.grid_layout} gap-3 md:gap-5 h-full content-start`}>
                                            {[...Array(slotsPerPage)].map((_, i) => renderSlot(leftPage, i))}
                                        </div>
                                    ) : <div className="h-full flex items-center justify-center text-gray-600 font-bold tracking-widest uppercase">Empty Page</div>}
                                </div>

                                {/* RIGHT PAGE */}
                                <div className="flex-1 relative border-l border-white/5 p-6 md:p-10 bg-gradient-to-l from-transparent to-black/20">
                                    {rightPage ? (
                                        <div className={`grid grid-cols-${binderData.grid_layout} gap-3 md:gap-5 h-full content-start`}>
                                            {[...Array(slotsPerPage)].map((_, i) => renderSlot(rightPage, i))}
                                        </div>
                                    ) : <div className="h-full flex items-center justify-center text-gray-600 font-bold tracking-widest uppercase">Empty Slot</div>}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* THE HOLE THINGY (Center Spine & Metal Rings) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-12 -translate-x-1/2 flex flex-col justify-evenly items-center py-16 z-20 pointer-events-none">
                        {/* Center Spine Crease */}
                        <div className="absolute inset-y-0 left-1/2 w-16 -translate-x-1/2 bg-gradient-to-r from-black/0 via-black/60 to-black/0 blur-md" />
                        <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-black/80" />

                        {/* 6 Binder Rings */}
                        {[...Array(6)].map((_, i) => (
                            <div key={`ring-${i}`} className="relative flex items-center justify-center w-full">
                                {/* Left Page Hole */}
                                <div className="absolute -left-3 w-4 h-4 rounded-full bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/10" />
                                {/* Right Page Hole */}
                                <div className="absolute -right-3 w-4 h-4 rounded-full bg-black shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/10" />

                                {/* Metallic Ring */}
                                <div className="w-20 h-4 rounded-full bg-gradient-to-b from-gray-300 via-white to-gray-400 shadow-[0_5px_10px_rgba(0,0,0,0.6)] border-b-2 border-gray-500 z-10">
                                    <div className="absolute inset-x-0 top-0.5 h-1 bg-white/60 rounded-full blur-[1px]" /> {/* Highlight */}
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        )
    }

    const renderBoardView = () => {
        const exactPage = binderPages[currentIndex]

        return (
            <div className="relative w-full max-w-7xl mx-auto flex-1 flex items-center justify-center px-6 md:px-20 py-8">
                <button
                    onClick={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
                    disabled={currentIndex === 0}
                    className={`absolute left-0 z-30 p-4 rounded-full backdrop-blur-md transition-all ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'bg-gray-900/80 hover:scale-110'}`}
                >
                    <ChevronLeft className="h-8 w-8" />
                </button>
                <button
                    onClick={() => currentIndex < totalPages - 1 && setCurrentIndex(currentIndex + 1)}
                    disabled={currentIndex === totalPages - 1}
                    className={`absolute right-0 z-30 p-4 rounded-full backdrop-blur-md transition-all ${currentIndex === totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'bg-gray-900/80 hover:scale-110'}`}
                >
                    <ChevronRight className="h-8 w-8" />
                </button>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={`board-${currentIndex}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full bg-gray-900/40 border border-gray-800/50 rounded-[2rem] p-6 md:p-12 shadow-2xl backdrop-blur-sm relative overflow-hidden"
                    >
                        {/* Theme Accent Glow */}
                        <div className={`absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br ${activeTheme.gradient} to-transparent rounded-full blur-[100px] opacity-20 pointer-events-none`} />

                        <div className="mb-8 flex items-center justify-between border-b border-gray-800 pb-4 relative z-10">
                            <div className="flex items-center gap-3">
                                <Layers className="h-5 w-5 text-gray-400" />
                                <h3 className="text-xl font-bold text-gray-200">Board {currentIndex + 1}</h3>
                            </div>
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 md:gap-6 relative z-10">
                            {[...Array(slotsPerPage)].map((_, i) => renderSlot(exactPage, i))}
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        )
    }

    const renderGridView = () => {
        return (
            <div className="w-full max-w-[1400px] mx-auto px-6 py-8 space-y-16">
                {binderPages.map((page, pageIndex) => (
                    <section key={page.id} className="w-full relative">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray-900 border border-gray-800">
                                <Layers className="h-4 w-4 text-gray-400" style={{ color: activeTheme.color }} />
                                <span className="text-sm font-bold text-gray-300 uppercase tracking-widest">Section {pageIndex + 1}</span>
                            </div>
                            <div className={`h-px flex-1 bg-gradient-to-r ${activeTheme.gradient} to-transparent opacity-30`} />
                        </div>
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 md:gap-6">
                            {[...Array(slotsPerPage)].map((_, slotIndex) => renderSlot(page, slotIndex))}
                        </div>
                    </section>
                ))}
            </div>
        )
    }

    const renderSlot = (page: AutoBinderType['binder_pages'][number], slotIndex: number) => {
        const cardsOnThisPage = page?.binder_cards || []
        const cardSlot = cardsOnThisPage.find((c: any) => c.position === slotIndex)
        const cards = cardSlot?.photocards
        const isOwned = !!cards?.user_collection?.length
        const isWishlist = !!cards?.user_wishlist?.length
        const condition = cards?.user_collection?.[0]?.condition

        return (
            <div key={`${page?.id}-${slotIndex}`} className="w-full aspect-[2/3] hover:scale-[1.02] transition-transform">
                {cardSlot && cards ? (
                    <BinderFilledSlot
                        collectionId={cards.id}
                        frontImage={cards.front_image_url}
                        rarity={cards.rarity}
                        backImage={cards.back_image_url}
                        isDoubleSided={cards.is_double_sided ?? false}
                        onClick={() => console.log('OPEN LIGHTBOX', cards.id)}
                        cardName={cards.name}
                        condition={condition}
                        idolName={cards.photocards_idol.map((p: any) => p.idol.stage_name)}
                        status={isOwned ? 'OWNED' : isWishlist ? 'WISHLIST' : 'UNACQUIRED'}
                        onRemove={() => handleRemoveCard(cardSlot.id)}
                    />
                ) : (
                    <CardSlot onClick={() => handleAddCard(page?.id, slotIndex)} />
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col relative min-h-screen text-white selection:bg-white/20">

            {/* --- HEADER & CONTROLS --- */}
            <header className="sticky top-0 z-40  backdrop-blur-xl px-4 md:px-6 py-4">
                <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">

                    {/* Title & Theme Indicator */}
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Book className="h-8 w-8 transition-colors duration-300" style={{ color: activeTheme.color }} />
                        <div>
                            <h1 className="text-xl md:text-2xl font-black italic tracking-tighter uppercase">{binderData.name}</h1>
                            <p className="text-[10px] md:text-xs text-gray-400 font-bold">{binderCards.length} Cards • {activeTheme.name} Edition</p>
                        </div>
                    </div>

                    {/* Middle Controls: View Switcher */}
                    <div className="flex items-center p-1 bg-gray-900 border border-gray-800 rounded-xl overflow-x-auto w-full md:w-auto">
                        <button
                            onClick={() => switchView('classic')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'classic' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <BookOpen className="h-4 w-4" /> <span className="hidden sm:inline">Classic</span>
                        </button>
                        <button
                            onClick={() => switchView('board')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'board' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <Monitor className="h-4 w-4" /> <span className="hidden sm:inline">Board</span>
                        </button>
                        <button
                            onClick={() => switchView('grid')}
                            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'grid' ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                        >
                            <LayoutGrid className="h-4 w-4" /> <span className="hidden sm:inline">Grid</span>
                        </button>
                    </div>

                    {/* Actions & Theme Picker */}
                    <div className="flex items-center gap-2 w-full md:w-auto justify-end relative">
                        {/* Theme Toggle Button */}
                        <button
                            onClick={() => {
                                setIsThemePickerOpen(!isThemePickerOpen)
                                setIsShareMenuOpen(false)
                                setIsExportMenuOpen(false)
                            }}
                            className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-300 hover:text-white transition-all group"
                        >
                            <Palette className="h-4 w-4 group-hover:rotate-12 transition-transform" style={{ color: activeTheme.color }} />
                        </button>

                        {/* Theme Dropdown Menu */}
                        <AnimatePresence>
                            {isThemePickerOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-14 right-0 md:right-auto bg-gray-900 border border-gray-700 rounded-2xl p-4 shadow-2xl z-50 w-64"
                                >
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Binder Color</h4>
                                    <div className="grid grid-cols-4 gap-2">
                                        {COLOR_THEMES.map(theme => (
                                            <button
                                                key={theme.id}
                                                onClick={() => {
                                                    setActiveTheme(theme);
                                                    setIsThemePickerOpen(false);
                                                }}
                                                className={`w-full aspect-square rounded-full bg-gradient-to-br ${theme.gradient} to-black/50 border-2 transition-transform hover:scale-110 ${activeTheme.id === theme.id ? 'border-white scale-110 shadow-lg' : 'border-transparent'}`}
                                                title={theme.name}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="h-6 w-px bg-gray-800 mx-1" />

                        {/* Share Button with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsShareMenuOpen(!isShareMenuOpen)
                                    setIsThemePickerOpen(false)
                                    setIsExportMenuOpen(false)
                                }}
                                className={`p-2.5 rounded-xl border transition-all ${isShareMenuOpen
                                    ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white'
                                    }`}
                            >
                                <Share2 className="h-4 w-4" />
                            </button>

                            {/* Share Dropdown Menu */}
                            <AnimatePresence>
                                {isShareMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-14 right-0 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-50 w-64"
                                    >
                                        <div className="p-4 border-b border-gray-800 flex flex-col gap-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Share Binder</h4>

                                            {/* Copy Link */}
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText(window.location.href)
                                                    showToast('Link copied to clipboard!', 'success')
                                                    setIsShareMenuOpen(false)
                                                }}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group"
                                            >
                                                <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-pink-500/20 transition-colors">
                                                    <Link className="h-4 w-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-bold text-white">Copy Link</p>
                                                    <p className="text-xs text-gray-500">Share with anyone</p>
                                                </div>
                                            </button>
                                            {/* Template Share */}
                                            <button
                                                onClick={handleTemplateShare}
                                                disabled={isTemplateShareLoading}
                                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-800/50 border border-gray-700 hover:border-pink-500/50 hover:bg-pink-500/10 transition-all group disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:border-gray-700 disabled:hover:bg-gray-800/50"
                                            >
                                                <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-pink-500/20 transition-colors group-disabled:bg-gray-800">
                                                    {isTemplateShareLoading ? (
                                                        <Loader2 className="h-4 w-4 text-pink-400 animate-spin" />
                                                    ) : (
                                                        <Book className="h-4 w-4 text-gray-400 group-hover:text-pink-400 transition-colors group-disabled:text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-bold text-white">
                                                        {isTemplateShareLoading ? "Creating Template..." : "Share as Template"}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {isTemplateShareLoading ? "Please wait a moment" : "Anyone can use your binder as a template"}
                                                    </p>
                                                </div>
                                            </button>
                                        </div>

                                        <div className="p-3">
                                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 px-1">Share on Social</p>

                                            {/* Social Media Options */}
                                            <div className="space-y-1">
                                                {/* Twitter/X */}
                                                <button
                                                    onClick={() => {
                                                        const text = `Check out my ${binderData.name || 'photocard'} collection!`
                                                        const url = window.location.href
                                                        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank')
                                                        setIsShareMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-blue-500/20 transition-colors">
                                                        <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Twitter / X</span>
                                                </button>

                                                {/* Facebook */}
                                                <button
                                                    onClick={() => {
                                                        const url = window.location.href
                                                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank')
                                                        setIsShareMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-blue-600/20 transition-colors">
                                                        <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Facebook</span>
                                                </button>

                                                {/* WhatsApp */}
                                                <button
                                                    onClick={() => {
                                                        const text = `Check out my ${binderData.name || 'photocard'} collection!`
                                                        const url = window.location.href
                                                        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank')
                                                        setIsShareMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-green-500/20 transition-colors">
                                                        <svg className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">WhatsApp</span>
                                                </button>

                                                {/* Telegram */}
                                                <button
                                                    onClick={() => {
                                                        const text = `Check out my ${binderData.name || 'photocard'} collection!`
                                                        const url = window.location.href
                                                        window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank')
                                                        setIsShareMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-blue-400/20 transition-colors">
                                                        <svg className="h-4 w-4 text-gray-400 group-hover:text-blue-400 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Telegram</span>
                                                </button>

                                                {/* Reddit */}
                                                <button
                                                    onClick={() => {
                                                        const title = `My ${binderData.name || 'photocard'} collection!`
                                                        const url = window.location.href
                                                        window.open(`https://reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, '_blank')
                                                        setIsShareMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-all group"
                                                >
                                                    <div className="p-1.5 rounded-lg bg-gray-800 group-hover:bg-orange-500/20 transition-colors">
                                                        <svg className="h-4 w-4 text-gray-400 group-hover:text-orange-500 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                                                            <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">Reddit</span>
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Export Button with Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => {
                                    setIsExportMenuOpen(!isExportMenuOpen)
                                    setIsThemePickerOpen(false)
                                    setIsShareMenuOpen(false)
                                }}
                                className={`p-2.5 rounded-xl border transition-all ${isExportMenuOpen
                                    ? 'bg-purple-500/20 border-purple-500/50 text-purple-400'
                                    : 'bg-gray-900 border-gray-800 text-gray-300 hover:text-white'
                                    }`}
                            >
                                <Download className="h-4 w-4" />
                            </button>

                            {/* Export Dropdown Menu */}
                            <AnimatePresence>
                                {isExportMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute top-14 right-0 bg-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-2xl z-50 w-72"
                                    >
                                        <div className="p-4">
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Export Binder</h4>

                                            <div className="space-y-2">
                                                {/* Export as Image */}
                                                <button
                                                    onClick={() => {
                                                        // handleExportAsImage()
                                                        setIsExportMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gradient-to-r from-pink-500/10 to-purple-500/10 border border-pink-500/30 hover:border-pink-500/50 hover:from-pink-500/20 hover:to-purple-500/20 transition-all group"
                                                >
                                                    <div className="p-2 rounded-lg bg-pink-500/20 group-hover:bg-pink-500/30 transition-colors">
                                                        <Image className="h-5 w-5 text-pink-400" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-bold text-white">Export as Image</p>
                                                        <p className="text-xs text-gray-400">High-quality PNG format</p>
                                                    </div>
                                                </button>

                                                {/* Export as PDF */}
                                                <button
                                                    onClick={() => {
                                                        // handleExportAsPDF()
                                                        // setIsExportMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/10 transition-all group"
                                                >
                                                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-purple-500/20 transition-colors">
                                                        <FileText className="h-5 w-5 text-gray-400 group-hover:text-purple-400 transition-colors" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-bold text-white">Export as PDF</p>
                                                        <p className="text-xs text-gray-400">Print-ready document</p>
                                                    </div>
                                                </button>

                                                {/* Export Inventory List */}
                                                <button
                                                    onClick={() => {
                                                        // handleExportInventory()
                                                        // setIsExportMenuOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all group"
                                                >
                                                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-blue-500/20 transition-colors">
                                                        <List className="h-5 w-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-bold text-white">Export Inventory</p>
                                                        <p className="text-xs text-gray-400">CSV spreadsheet format</p>
                                                    </div>
                                                </button>

                                                {/* Export as JSON */}
                                                <button
                                                    // onClick={() => {
                                                    //     handleExportJSON()
                                                    //     setIsExportMenuOpen(false)
                                                    // }}
                                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all group"
                                                >
                                                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-emerald-500/20 transition-colors">
                                                        <Code className="h-5 w-5 text-gray-400 group-hover:text-emerald-400 transition-colors" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-bold text-white">Export Data</p>
                                                        <p className="text-xs text-gray-400">JSON backup file</p>
                                                    </div>
                                                </button>

                                                {/* Print Binder */}
                                                <button
                                                    // onClick={() => {
                                                    //     handlePrintBinder()
                                                    //     setIsExportMenuOpen(false)
                                                    // }}
                                                    className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-gray-800/50 border border-gray-700 hover:border-gray-500 hover:bg-gray-800 transition-all group"
                                                >
                                                    <div className="p-2 rounded-lg bg-gray-700 group-hover:bg-gray-600 transition-colors">
                                                        <Printer className="h-5 w-5 text-gray-400 group-hover:text-white transition-colors" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <p className="text-sm font-bold text-white">Print Binder</p>
                                                        <p className="text-xs text-gray-400">Physical copy</p>
                                                    </div>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="px-4 py-3 bg-gray-800/50 border-t border-gray-800">
                                            <p className="text-[10px] text-gray-500 leading-relaxed">
                                                💡 Tip: Use PDF for printing or sharing, CSV for tracking your collection
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </header>

            {/* --- MAIN CONTENT AREA --- */}
            {viewMode === 'classic' && renderClassicView()}
            {viewMode === 'board' && renderBoardView()}
            {viewMode === 'grid' && renderGridView()}

            {/* --- PAGINATION DOTS --- */}
            {viewMode !== 'grid' && (
                <div className="flex justify-center gap-2 mt-auto pb-8 pt-4">
                    {[...Array(viewMode === 'classic' ? totalClassicPairs : totalPages)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`transition-all rounded-full duration-300 ${i === currentIndex ? `w-10 h-2 bg-gradient-to-r ${activeTheme.gradient} to-white` : 'w-2 h-2 bg-gray-800 hover:bg-gray-600'}`}
                        />
                    ))}
                </div>
            )}

            {/* INVENTORY SIDEBAR */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <CardSidebar
                        onclose={() => setIsSidebarOpen(false)}
                        onConfirm={handleConfirmCard}
                        userColletions={userCollections}
                        binderCards={binderCards}
                        cardsData={cardsData}
                        currentFilters={currentFilters}
                        distributionTypes={distributionTypes}
                        groups={groups}
                        userWishlists={userWishlists}
                    />
                )}
            </AnimatePresence>

        </div>
    )
}