'use client'

import { Compass, Sparkles, ChevronRight, Filter, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

// Dummy Data grouped by Release
const RELEASES = [
    {
        era: "Gold",
        group: "ITZY",
        releaseDate: "Oct 2024",
        banner: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
        cards: [
            { id: 1, name: "Gold Yeji R1", rarity: "Super Rare", image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
            { id: 2, name: "Gold Yuna R1", rarity: "Rare", image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
            { id: 3, name: "Gold Ryujin POB", rarity: "Epic", image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
            { id: 4, name: "Gold Lia R1", rarity: "Common", image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
        ]
    },
    {
        era: "Whiplash",
        group: "aespa",
        releaseDate: "Oct 2024",
        banner: "https://wallpapers.com/images/hd/aespa-whiplash-concept-photo.jpg",
        cards: [
            { id: 5, name: "Whiplash Karina", rarity: "Legendary", image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
            { id: 6, name: "Whiplash Winter", rarity: "Super Rare", image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
        ]
    }
]

export default function BrowsePage() {
    return (
        <div className="flex flex-col gap-10 relative">

            {/* --- 1. HEADER & SEARCH --- */}
            <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-4xl font-black text-white italic tracking-tighter">
                        <Compass className="h-10 w-10 text-pink-500" />
                        BROWSE RELEASES
                    </h1>
                    <p className="text-gray-400 mt-1">Explore the latest drops and complete your eras.</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search era or group..."
                            className="bg-[#161B22] border border-gray-800 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-pink-500/50 transition-all w-64"
                        />
                    </div>
                    <button className="flex items-center gap-2 rounded-xl border border-gray-800 bg-[#161B22] px-4 py-2 text-sm font-bold text-gray-400 hover:text-white hover:bg-gray-800 transition-all">
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                </div>
            </header>

            {/* --- 2. FEATURED DROP (HERO) --- */}
            <section className="group relative h-96 w-full overflow-hidden rounded-[2.5rem] border border-pink-500/20 shadow-2xl transition-all duration-500 hover:border-pink-500/40">
                <div className="
                        absolute right-0 top-0 h-full w-2/3 
                        bg-[url('/assets/images/yeji-2.jpg')] 
                        bg-cover bg-[center_30%]
                        
                        /* THE MAGIC PART */
                        [mask-image:linear-gradient(to_right,transparent,black_20%)]
                    "></div>
                    
                {/* Layered Gradients for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E11] via-transparent to-transparent md:bg-gradient-to-r md:from-[#0B0E11] md:via-[#0B0E11]/60 md:to-transparent" />

                <div className="relative z-10 flex h-full flex-col justify-center p-8 md:p-16">
                    <div className="mb-4 flex items-center gap-2 rounded-full bg-pink-500/20 px-4 py-1.5 text-[10px] font-black text-pink-400 backdrop-blur-md border border-pink-500/30 w-fit uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" />
                        Featured Release
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase leading-none">
                        Gold <span className="text-pink-500">Era</span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-300 max-w-md leading-relaxed">
                        ITZY is back. Discover the full 45-card set and chase the legendary Gold R1 series.
                    </p>
                    <div className="mt-8 flex items-center gap-4">
                        <button className="rounded-full bg-pink-600 px-8 py-4 text-xs font-black text-white transition-all hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-95 uppercase tracking-widest">
                            Explore Set
                        </button>
                        <button className="rounded-full bg-white/5 border border-white/10 backdrop-blur-md px-8 py-4 text-xs font-black text-white transition-all hover:bg-white/10 active:scale-95 uppercase tracking-widest">
                            View Album Info
                        </button>
                    </div>
                </div>
            </section>

            {/* --- 3. BROWSE BY ERA (GROUPS) --- */}
            {RELEASES.map((release, index) => (
                <section key={index} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-gray-800/50 pb-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                {release.group} <span className="text-gray-600 mx-1">/</span> {release.era}
                            </h3>
                            <span className="rounded-md bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-500">
                                {release.releaseDate}
                            </span>
                        </div>
                        <Link href={`/browse/${release.era.toLowerCase()}`} className="group flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-pink-500 transition-colors">
                            See Full Collection <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Horizontal Scroll for Cards */}
                    <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
                        {release.cards.map((card) => (
                            <div
                                key={card.id}
                                className="group relative w-60 shrink-0 snap-start cursor-pointer transition-all duration-300"
                            >
                                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-3xl bg-[#161B22] border border-gray-800 transition-all duration-500 group-hover:border-pink-500/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                                    <Image
                                        src={card.image}
                                        alt={card.name}
                                        fill
                                        sizes="240px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Subtle Gradient Overlay on Card */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                </div>
                                <div className="mt-4 px-1">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">{card.rarity}</span>
                                        <div className="h-1.5 w-1.5 rounded-full bg-pink-500 animate-pulse opacity-0 group-hover:opacity-100" />
                                    </div>
                                    <h4 className="font-bold text-gray-200 truncate text-lg tracking-tight group-hover:text-white transition-colors">{card.name}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}