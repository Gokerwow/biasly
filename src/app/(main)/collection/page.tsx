'use client'

import CardItem from '@/components/cards/cards'
import { Filter, SlidersHorizontal, Search, LayoutGrid, List } from 'lucide-react'
import Image from 'next/image'

// Dummy Data to match the "Lamumu" Grid vibe
const CARDS = [
    { id: 1, name: 'Yeji Checkmate', status: 'Owned', rarity: 'Rare', price: '$12', image: 'https://pbs.twimg.com/media/GD5rsqbaIAAr-x0.jpg' },
    { id: 2, name: 'Ryujin Cheshire', status: 'Wishlist', rarity: 'Common', price: '$5', image: 'https://i.ebayimg.com/images/g/H0IAAOSw~Bpl38~Q/s-l1200.jpg' },
    { id: 3, name: 'Yuna Kill My Doubt', status: 'Owned', rarity: 'Legendary', price: '$45', image: 'https://pbs.twimg.com/media/F_i2-eUbAAAbj3d.jpg' },
    { id: 4, name: 'Chaeryeong Born to Be', status: 'Owned', rarity: 'Rare', price: '$15', image: 'https://upload.wikimedia.org/wikipedia/en/3/36/Itzy_-_Born_to_Be.png' },
    { id: 5, name: 'Lia Not Shy', status: 'Wishlist', rarity: 'Common', price: '$8', image: 'https://upload.wikimedia.org/wikipedia/en/8/86/Twice_-_With_You-th.png' },
    { id: 6, name: 'Yeji Voltage', status: 'Owned', rarity: 'Epic', price: '$25', image: 'https://upload.wikimedia.org/wikipedia/en/e/e3/Red_Velvet_-_Chill_Kill.png' },
]

export default function CollectionPage() {
    return (
        <div className="flex flex-col gap-6">

            {/* --- 1. HERO BANNER (Like the Cows image) --- */}
            <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-gray-800 bg-gray-900">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-40">
                    <Image
                        src="/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg"
                        alt="Yuna Background"
                        fill
                        className="object-cover object-center"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent"></div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 w-full p-8">
                    <div className="flex items-end justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold text-white">My Full Collection</h1>
                            <p className="mt-2 text-gray-400">Manage, track, and filter your inventory.</p>
                        </div>

                        {/* Stats Box (Like "Floor Price" in your image) */}
                        <div className="flex gap-6 rounded-xl border border-gray-700 bg-black/50 px-6 py-3 backdrop-blur-md">
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase">Total Cards</p>
                                <p className="font-mono text-lg font-bold text-white">1,240</p>
                            </div>
                            <div className="h-full w-px bg-gray-700"></div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-gray-500 uppercase">Est. Value</p>
                                <p className="font-mono text-lg font-bold text-green-400">$8,450</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. MAIN CONTENT SPLIT (Filters + Grid) --- */}
            <div className="flex gap-8">

                {/* LEFT: FILTERS SIDEBAR (Sticky) */}
                <aside className="sticky inset-0 h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto rounded-2xl border border-gray-800 bg-[#161B22] p-4 hidden lg:block">
                    <div className="mb-6 flex items-center gap-2 text-white">
                        <Filter className="h-4 w-4 text-pink-500" />
                        <span className="font-bold">Filters</span>
                    </div>

                    {/* Filter Group: Status */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-xs font-bold text-gray-500 uppercase">Status</h3>
                        <div className="flex gap-2 rounded-lg bg-black/30 p-1">
                            <button className="flex-1 rounded-md bg-gray-700 py-1.5 text-xs font-medium text-white shadow">All</button>
                            <button className="flex-1 rounded-md py-1.5 text-xs font-medium text-gray-400 hover:text-white">Owned</button>
                            <button className="flex-1 rounded-md py-1.5 text-xs font-medium text-gray-400 hover:text-white">Wishlist</button>
                        </div>
                    </div>

                    {/* Filter Group: Groups */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-xs font-bold text-gray-500 uppercase">Groups</h3>
                        <div className="space-y-2">
                            {['ITZY', 'aespa', 'TWICE', 'Red Velvet', 'NMIXX'].map((group) => (
                                <label key={group} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-600 bg-transparent transition-colors group-hover:border-pink-500">
                                        {/* Checkbox simulated */}
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white">{group}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* RIGHT: THE GRID */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by card name..."
                                className="w-full rounded-xl border border-gray-800 bg-[#161B22] py-2.5 pl-10 text-sm text-white focus:border-pink-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="rounded-lg bg-[#161B22] p-2 text-white hover:bg-gray-800"><LayoutGrid className="h-5 w-5" /></button>
                            <button className="rounded-lg bg-[#161B22] p-2 text-gray-500 hover:bg-gray-800 hover:text-white"><List className="h-5 w-5" /></button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {CARDS.map((card) => (
                            <CardItem key={card.id} id={card.id} image_url={card.image} name={card.name} price={card.price} rarity={card.rarity} status={card.status} />
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}