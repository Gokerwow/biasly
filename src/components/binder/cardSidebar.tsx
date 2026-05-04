'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { Filter, Globe2, Heart, Layers, Package, Search, Sparkles, X } from 'lucide-react'
import CardItem from '../cards/cards'
import { useEffect, useState } from 'react'
import { Button } from '../UI/button'
import { getUserCollections } from '@/queries/userCollections'
import { BinderCard, SimpleDistribution, SimpleGroup } from '@/types'
import { InferQueryType } from '@/helper/queryType'
import { getApprovedCards, getUserWishlist } from '@/queries/photocards'
import FilterMenuUI, { FilterProps } from '../UI/filter'
import Pagination from '../UI/pagination'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebounce } from '@/app/providers/debounce'

type AutoCollectionType = InferQueryType<typeof getUserCollections>
type AutoCardType = InferQueryType<typeof getApprovedCards>
type AutoWishlistType = InferQueryType<typeof getUserWishlist>

interface CardSidebarprops {
    userColletions: AutoCollectionType
    userWishlists: AutoWishlistType
    binderCards: BinderCard[]
    onclose: () => void
    onConfirm: (collectionID: string) => void
    cardsData: AutoCardType
    currentFilters: FilterProps
    groups: SimpleGroup[]
    distributionTypes: SimpleDistribution[]
}
type TabType = 'inventory' | 'wishlist' | 'global'

export function CardSidebar({ userColletions, userWishlists, cardsData, currentFilters, groups, distributionTypes, binderCards, onclose, onConfirm }: CardSidebarprops) {
    const pathName = usePathname()
    const searchParams = useSearchParams()
    const router = useRouter()
    const currentPage = Number(searchParams.get("page")) || 1

    const [selectedCollection, setSelectedCollection] = useState('')
    const [selectedCard, setSelectedCard] = useState('')
    const [searchQuery, setSearchQuery] = useState('')
    const [activeTab, setActiveTab] = useState<TabType>('inventory')
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const collectionsData = userColletions.data
    const wishlistData = userWishlists.data
    const cards = cardsData.data
    const exceptBinderCards = cards.filter(c => !(binderCards.find(b => b.photocard_id === c.id)))
    const totalItems = exceptBinderCards.length
    const itemsPerPage = cardsData.pageSize
    const hasNextPage = cardsData.hasNextPage
    const hasPreviousPage = cardsData.hasPreviousPage
    const totalPages = Math.ceil(totalItems / itemsPerPage)

    const hasInventory = collectionsData.filter(c => !(binderCards.find(b => b.photocard_id === c.photocards.id))).length > 0
    const hasWishlist = wishlistData.filter(w => !(binderCards.find(b => b.photocard_id === w.photocards.id))).length > 0
    console.log("hasInventory ", hasInventory)
    console.log("hasWishlist ", hasWishlist)

    const debouncedQuery = useDebounce(searchQuery, 500)


    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (debouncedQuery) {
            params.set('search', debouncedQuery.trim())
            params.delete('page')
        } else {
            params.delete('search')
        }
        const queryString = params.toString()
        const url = queryString ? `${pathName}?${queryString}` : pathName
        router.push(url, { scroll: false })
    }, [debouncedQuery, pathName, router, searchParams])

    const handleSelect = (photocardID: string, cardID: string) => {
        setSelectedCollection(photocardID)
        setSelectedCard(cardID)
    }
    return (
        <>
            {/* Dark Overlay - Click to close */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onclose}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            {/* Sidebar Panel */}
            <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#0B0E11] border-l border-gray-800 shadow-2xl z-50 flex flex-col"
            >
                {/* Sidebar Header */}
                <div className="p-6 border-b border-gray-800 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase flex items-center gap-2">
                            <Layers className="h-5 w-5 text-pink-500" />
                            Add Card to Binder
                        </h2>
                        <button
                            onClick={onclose}
                            className="p-2 rounded-full bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Tab Navigation */}
                    <div className="flex gap-2 p-1 rounded-xl bg-gray-900/80 border border-gray-800">
                        {/* Inventory Tab */}
                        <button
                            onClick={() => {
                                setActiveTab('inventory')
                                setSelectedCard('')
                                setSelectedCollection('')
                            }}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all relative
                                ${activeTab === 'inventory'
                                    ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg shadow-pink-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                }
                            `}
                        >
                            <Package className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-wider">
                                Inventory
                            </span>
                            {/* {inventoryCount > 0 && (
                                <span className={`
                                    text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                                    ${activeTab === 'inventory'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-800 text-gray-500'
                                    }
                                `}>
                                    {inventoryCount}
                                </span>
                            )} */}
                            {activeTab === 'inventory' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-pink-500 to-pink-600 -z-10"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>

                        {/* Wishlist Tab */}
                        <button
                            onClick={() => {
                                setActiveTab('wishlist')
                                setSelectedCard('')
                                setSelectedCollection('')
                            }}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all relative
                                ${activeTab === 'wishlist'
                                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                }
                            `}
                        >
                            <Heart className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-wider">
                                Wishlist
                            </span>
                            {/* {wishlistCount > 0 && (
                                <span className={`
                                    text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center
                                    ${activeTab === 'wishlist'
                                        ? 'bg-white/20 text-white'
                                        : 'bg-gray-800 text-gray-500'
                                    }
                                `}>
                                    {wishlistCount}
                                </span>
                            )} */}
                            {activeTab === 'wishlist' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600 -z-10"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>

                        {/* Global Tab */}
                        <button
                            onClick={() => {
                                setActiveTab('global')
                                setSelectedCard('')
                                setSelectedCollection('')
                            }}
                            className={`
                                flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg transition-all relative
                                ${activeTab === 'global'
                                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
                                }
                            `}
                        >
                            <Globe2 className="h-4 w-4" />
                            <span className="text-xs font-black uppercase tracking-wider">
                                Global
                            </span>
                            {activeTab === 'global' && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 -z-10"
                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                        </button>
                    </div>

                    {/* Tab Description */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800"
                        >
                            {activeTab === 'inventory' && (
                                <>
                                    <Sparkles className="h-3.5 w-3.5 text-pink-400 flex-shrink-0" />
                                    <p className="text-xs text-gray-400">
                                        Cards you own and can add to your binder
                                    </p>
                                </>
                            )}
                            {activeTab === 'wishlist' && (
                                <>
                                    <Sparkles className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                                    <p className="text-xs text-gray-400">
                                        Cards you&apos;re looking for - mark as placeholder
                                    </p>
                                </>
                            )}
                            {activeTab === 'global' && (
                                <>
                                    <Sparkles className="h-3.5 w-3.5 text-blue-400 flex-shrink-0" />
                                    <p className="text-xs text-gray-400">
                                        Browse all available cards in the database
                                    </p>
                                </>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Search & Filters */}
                    <div className="relative flex gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <input
                                type="text"
                                placeholder={`Search ${activeTab === 'global' ? 'all' : activeTab} cards...`}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-gray-900 border border-gray-800 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/50 transition-all"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => setSearchQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                >
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            )}
                        </div>
                        <button id="filter-toggle-btn" onClick={() => setIsFilterOpen(!isFilterOpen)} className="p-2.5 rounded-xl bg-gray-900 border border-gray-800 text-gray-400 hover:text-white transition-colors">
                            <Filter className="h-4 w-4" />
                        </button>

                        {isFilterOpen &&
                            <FilterMenuUI
                                currentFilters={currentFilters}
                                distributionTypes={distributionTypes}
                                groups={groups}
                                onClose={() => setIsFilterOpen(false)}
                            />
                        }
                    </div>
                </div>

                {/* Scrollable Card Grid */}
                <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {/* INVENTORY TAB */}
                            {activeTab === 'inventory' && (
                                <>
                                    {hasInventory ? (
                                        <div className='grid grid-cols-2 gap-4'>
                                            {collectionsData.map((collection) => {
                                                const card = collection.photocards
                                                const exist = binderCards.find(c => c.photocard_id === card.id)
                                                if (exist) return null
                                                return (
                                                    <CardItem
                                                        key={card.id}
                                                        id={card.id}
                                                        front_image_url={card.front_image_url}
                                                        group_name={card.group.name}
                                                        name={card.name}
                                                        rarity={card.rarity}
                                                        back_image_url={card.back_image_url}
                                                        idols={card.idols}
                                                        distribution_type={card.distribution_type.name}
                                                        isDoubleSided={card.is_double_sided ?? false}
                                                        isHorizontal={card.is_horizontal ?? false}
                                                        type='collection'
                                                        physical_types={card.physical_types_global}
                                                        release_title={card.releases.title}
                                                        onSelect={() => handleSelect(card.id, card.id)}
                                                        isSelected={selectedCard === card.id}
                                                    />
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        // Empty state for Inventory
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative mb-6"
                                            >
                                                <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-pink-500" />
                                                <div className="relative p-6 rounded-2xl border bg-pink-500/5 border-pink-500/20">
                                                    <Package className="h-12 w-12 text-pink-500/60" />
                                                </div>
                                            </motion.div>

                                            <h3 className="text-lg font-black text-gray-300 mb-2">
                                                {searchQuery ? 'No cards found' : 'Your inventory is empty'}
                                            </h3>

                                            <p className="text-sm text-gray-500 max-w-xs mb-6">
                                                {searchQuery
                                                    ? 'Try adjusting your search terms or filters'
                                                    : 'Add cards to your inventory to see them here and place them in binders'
                                                }
                                            </p>

                                            {!searchQuery ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveTab('global')}
                                                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-pink-500 to-pink-600 hover:shadow-lg hover:shadow-pink-500/20 transition-all"
                                                >
                                                    Browse Global Cards
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSearchQuery('')}
                                                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                                                >
                                                    Clear Search
                                                </motion.button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* WISHLIST TAB */}
                            {activeTab === 'wishlist' && (
                                <>
                                    {hasWishlist ? (
                                        <div className='grid grid-cols-2 gap-4'>
                                            {wishlistData.map((wishlist) => {
                                                const card = wishlist.photocards
                                                const exist = binderCards.find(c => c.photocard_id === card.id)
                                                if (exist) return null
                                                return (
                                                    <CardItem
                                                        key={card.id}
                                                        id={card.id}
                                                        front_image_url={card.front_image_url}
                                                        group_name={card.group.name}
                                                        name={card.name}
                                                        rarity={card.rarity}
                                                        back_image_url={card.back_image_url}
                                                        idols={card.idols}
                                                        distribution_type={card.distribution_type.name}
                                                        isDoubleSided={card.is_double_sided ?? false}
                                                        isHorizontal={card.is_horizontal ?? false}
                                                        type='collection'
                                                        physical_types={card.physical_types_global}
                                                        release_title={card.releases.title}
                                                        onSelect={() => handleSelect(card.id, card.id)}
                                                        isSelected={selectedCard === card.id}
                                                    />
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        // Empty state for Wishlist
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative mb-6"
                                            >
                                                <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-purple-500" />
                                                <div className="relative p-6 rounded-2xl border bg-purple-500/5 border-purple-500/20">
                                                    <Heart className="h-12 w-12 text-purple-500/60" />
                                                </div>
                                            </motion.div>

                                            <h3 className="text-lg font-black text-gray-300 mb-2">
                                                {searchQuery ? 'No cards found' : 'Your wishlist is empty'}
                                            </h3>

                                            <p className="text-sm text-gray-500 max-w-xs mb-6">
                                                {searchQuery
                                                    ? 'Try adjusting your search terms or filters'
                                                    : 'Add cards to your wishlist to track what you\'re looking for'
                                                }
                                            </p>

                                            {!searchQuery ? (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setActiveTab('global')}
                                                    className="px-6 py-2.5 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-500 to-purple-600 hover:shadow-lg hover:shadow-purple-500/20 transition-all"
                                                >
                                                    Explore Cards to Add
                                                </motion.button>
                                            ) : (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSearchQuery('')}
                                                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                                                >
                                                    Clear Search
                                                </motion.button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* GLOBAL TAB */}
                            {activeTab === 'global' && (
                                <>
                                    {totalItems > 0 ? (
                                        <div className='grid grid-cols-2 gap-4'>
                                            {cards.map((card) => {
                                                const exist = binderCards.find(c => c.photocard_id === card.id)
                                                if (exist) return null
                                                return (
                                                    <CardItem
                                                        key={card.id}
                                                        id={card.id}
                                                        front_image_url={card.front_image_url}
                                                        group_name={card.group.name}
                                                        name={card.name}
                                                        rarity={card.rarity}
                                                        back_image_url={card.back_image_url}
                                                        idols={card.idols}
                                                        distribution_type={card.distribution_type.name}
                                                        isDoubleSided={card.is_double_sided ?? false}
                                                        isHorizontal={card.is_horizontal ?? false}
                                                        type='browse'
                                                        physical_types={card.physical_types_global}
                                                        release_title={card.releases.title}
                                                        onSelect={() => handleSelect(card.id, card.id)}
                                                        isSelected={selectedCard === card.id}
                                                    />
                                                )
                                            })}
                                        </div>
                                    ) : (
                                        // Empty state for Global
                                        <div className="flex flex-col items-center justify-center py-16 text-center">
                                            <motion.div
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.3 }}
                                                className="relative mb-6"
                                            >
                                                <div className="absolute inset-0 rounded-full blur-2xl opacity-20 bg-blue-500" />
                                                <div className="relative p-6 rounded-2xl border bg-blue-500/5 border-blue-500/20">
                                                    <Globe2 className="h-12 w-12 text-blue-500/60" />
                                                </div>
                                            </motion.div>

                                            <h3 className="text-lg font-black text-gray-300 mb-2">
                                                {searchQuery ? 'No cards found' : 'No cards available'}
                                            </h3>

                                            <p className="text-sm text-gray-500 max-w-xs mb-6">
                                                {searchQuery
                                                    ? 'Try adjusting your search terms or filters'
                                                    : 'All available cards have been added to your binder'
                                                }
                                            </p>

                                            {searchQuery && (
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => setSearchQuery('')}
                                                    className="px-6 py-2.5 rounded-xl font-bold text-sm bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-all"
                                                >
                                                    Clear Search
                                                </motion.button>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.div>

                        {/* --- PAGINATION (only show when there are results) --- */}
                        {totalPages > 1 && (
                            <Pagination
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                hasNextPage={hasNextPage}
                                hasPreviousPage={hasPreviousPage}
                                totalPages={totalPages}
                            />
                        )}
                    </AnimatePresence>
                </div>

                {/* Sidebar Footer */}
                <div className="p-6 border-t border-gray-800 bg-gray-900/50">
                    {selectedCollection ? (
                        <div className="space-y-3">
                            {/* Selected card indicator */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-900/50 border border-gray-800">
                                <div className={`w-2 h-2 rounded-full ${activeTab === 'inventory' ? 'bg-pink-500' :
                                    activeTab === 'wishlist' ? 'bg-purple-500' :
                                        'bg-blue-500'
                                    }`} />
                                <span className="text-xs text-gray-400">
                                    1 card selected from {activeTab}
                                </span>
                            </div>

                            <Button
                                variant='default'
                                onClick={() => onConfirm(selectedCollection)}
                                className="w-full"
                            >
                                <span>Add Card to Binder</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <p className="text-sm text-gray-500 font-medium">
                                Select a card to place it in the binder slot
                            </p>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    )
}