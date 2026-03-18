'use client'

import { Search, Filter, ChevronRight, ShoppingCart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const GROUPS = [
    { id: 1, name: "BTS", members: 7, initials: "BT", color: "#FBEAF0", text: "#993556" },
    { id: 2, name: "Blackpink", members: 4, initials: "BP", color: "#FBEAF0", text: "#993556" },
    { id: 3, name: "aespa", members: 4, initials: "ae", color: "#EEEDFE", text: "#534AB7" },
    { id: 4, name: "NewJeans", members: 5, initials: "NJ", color: "#E1F5EE", text: "#0F6E56" },
    { id: 5, name: "ITZY", members: 4, initials: "IZ", color: "#FAEEDA", text: "#854F0B" },
    { id: 6, name: "IVE", members: 6, initials: "IV", color: "#E6F1FB", text: "#185FA5" },
    { id: 7, name: "Stray Kids", members: 8, initials: "SK", color: "#EAF3DE", text: "#3B6D11" },
    { id: 8, name: "TWICE", members: 9, initials: "TW", color: "#FAECE7", text: "#993C1D" },
]

const IDOLS = [
    { id: 1, name: "Karina", group: "aespa", initials: "Ka", color: "#FBEAF0", text: "#993556" },
    { id: 2, name: "Jungkook", group: "BTS", initials: "JK", color: "#FAEEDA", text: "#854F0B" },
    { id: 3, name: "Jennie", group: "Blackpink", initials: "Je", color: "#FBEAF0", text: "#993556" },
    { id: 4, name: "Winter", group: "aespa", initials: "Wi", color: "#EEEDFE", text: "#534AB7" },
    { id: 5, name: "Minji", group: "NewJeans", initials: "Mi", color: "#E1F5EE", text: "#0F6E56" },
    { id: 6, name: "Yeji", group: "ITZY", initials: "Ye", color: "#E6F1FB", text: "#185FA5" },
    { id: 7, name: "Felix", group: "Stray Kids", initials: "Fe", color: "#EAF3DE", text: "#3B6D11" },
    { id: 8, name: "Nayeon", group: "TWICE", initials: "Na", color: "#FAECE7", text: "#993C1D" },
]

const ALBUMS = [
    { id: 1, name: "Whiplash", group: "aespa", date: "Oct 2024", color: "#EEEDFE" },
    { id: 2, name: "Gold", group: "ITZY", date: "Oct 2024", color: "#FAEEDA" },
    { id: 3, name: "How Sweet", group: "NewJeans", date: "May 2024", color: "#E1F5EE" },
    { id: 4, name: "Born Pink", group: "Blackpink", date: "2022", color: "#FBEAF0" },
    { id: 5, name: "Proof", group: "BTS", date: "2022", color: "#E6F1FB" },
]

const RARITY_STYLES = {
    UR: { bg: 'bg-amber-500/20', text: 'text-amber-300', border: 'border-amber-500/30' },
    SSR: { bg: 'bg-pink-500/20', text: 'text-pink-300', border: 'border-pink-500/30' },
    SR: { bg: 'bg-purple-500/20', text: 'text-purple-300', border: 'border-purple-500/30' },
    R: { bg: 'bg-teal-500/20', text: 'text-teal-300', border: 'border-teal-500/30' },
    N: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30' },
}

const ERAS = [
    {
        id: 1,
        group: "ITZY",
        era: "Gold",
        date: "Oct 2024",
        cards: [
            {
                id: 1,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Karina",
                group: "aespa",
                album: "Whiplash",
                name: "Whiplash Karina LD",
                rarity: "UR",
                cardType: "Lucky Draw",
                physicalTypes: ["Holographic", "Signed"],
                marketPrice: 250,
            },
            {
                id: 2,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Yeji",
                group: "ITZY",
                album: "Gold",
                name: "Gold Yeji Fansign",
                rarity: "SSR",
                cardType: "Fansign",
                physicalTypes: ["Numbered"],
                marketPrice: 80,
            },
            {
                id: 3,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Winter",
                group: "aespa",
                album: "Whiplash",
                name: "Whiplash Winter POB",
                rarity: "SR",
                cardType: "POB",
                physicalTypes: ["Lenticular"],
                marketPrice: 35,
            },
            {
                id: 4,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Yuna",
                group: "ITZY",
                album: "Gold",
                name: "Gold Yuna Ver A",
                rarity: "R",
                cardType: "Album PC",
                physicalTypes: [],
                marketPrice: 8,
            },
        ]
    },
    {
        id: 2,
        group: "aespa",
        era: "Whiplash",
        date: "Oct 2024",
        cards: [
            {
                id: 1,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Karina",
                group: "aespa",
                album: "Whiplash",
                name: "Whiplash Karina LD",
                rarity: "UR",
                cardType: "Lucky Draw",
                physicalTypes: ["Holographic", "Signed"],
                marketPrice: 250,
            },
            {
                id: 2,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Yeji",
                group: "ITZY",
                album: "Gold",
                name: "Gold Yeji Fansign",
                rarity: "SSR",
                cardType: "Fansign",
                physicalTypes: ["Numbered"],
                marketPrice: 80,
            },
            {
                id: 3,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Winter",
                group: "aespa",
                album: "Whiplash",
                name: "Whiplash Winter POB",
                rarity: "SR",
                cardType: "POB",
                physicalTypes: ["Lenticular"],
                marketPrice: 35,
            },
            {
                id: 4,
                image: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg",
                idol: "Yuna",
                group: "ITZY",
                album: "Gold",
                name: "Gold Yuna Ver A",
                rarity: "R",
                cardType: "Album PC",
                physicalTypes: [],
                marketPrice: 8,
            },
        ]
    }
]

export default function BrowsePage() {
    return (
        <div className="flex flex-col gap-8">

            {/* --- HEADER --- */}
            <header className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-white">Browse</h1>
                    <p className="text-sm text-gray-400 mt-1">Explore groups, idols, albums and photocards</p>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search..."
                            className="bg-[#161B22] border border-gray-800 rounded-lg pl-9 pr-3 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-gray-600 transition-colors w-48"
                        />
                    </div>
                    <select className="bg-[#161B22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 focus:outline-none cursor-pointer">
                        <option>All groups</option>
                        <option>Boy groups</option>
                        <option>Girl groups</option>
                    </select>
                    <button className="flex items-center gap-2 bg-[#161B22] border border-gray-800 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors">
                        <Filter className="h-3.5 w-3.5" />
                        Filters
                    </button>
                </div>
            </header>

            {/* --- HERO --- */}
            <section className="relative rounded-2xl overflow-hidden min-h-[200px] flex items-end p-6 border border-gray-800">
                <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #1a0a2e 0%, #2d1155 50%, #1a0a2e 100%)" }} />
                <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 20% 50%, rgba(212,83,126,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(127,119,221,0.15) 0%, transparent 40%)" }} />

                <div className="relative z-10 flex flex-col gap-2">
                    <div className="flex items-center gap-2 bg-pink-500/10 border border-pink-500/20 rounded-full px-3 py-1 w-fit">
                        <div className="h-1.5 w-1.5 rounded-full bg-pink-400" />
                        <span className="text-xs text-pink-300 font-medium">Featured release</span>
                    </div>
                    <h2 className="text-3xl font-semibold text-white leading-tight">
                        Gold Era <span className="text-pink-400">/ ITZY</span>
                    </h2>
                    <p className="text-sm text-white/50 max-w-sm">Complete 45-card set. Chase the UR Lucky Draw series.</p>
                    <div className="flex gap-2 mt-1">
                        <button className="bg-pink-600 hover:bg-pink-500 text-white text-xs font-medium px-5 py-2 rounded-full transition-colors">
                            Explore set
                        </button>
                        <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-xs font-medium px-5 py-2 rounded-full transition-colors">
                            Album info
                        </button>
                    </div>
                </div>

                <div className="absolute right-6 bottom-6 flex gap-2">
                    {[
                        { from: "#D4537E", to: "#EF9F27", active: true },
                        { from: "#7F77DD", to: "#D4537E", active: false },
                        { from: "#1D9E75", to: "#7F77DD", active: false },
                    ].map((card, i) => (
                        <div
                            key={i}
                            className={`w-12 h-16 rounded-lg border overflow-hidden ${card.active ? "border-pink-500" : "border-white/10"}`}
                        >
                            <div className="w-full h-full opacity-70" style={{ background: `linear-gradient(135deg, ${card.from}, ${card.to})` }} />
                        </div>
                    ))}
                </div>
            </section>

            {/* --- GROUPS --- */}
            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-medium text-white">Popular groups</h2>
                        <span className="text-xs text-gray-500 bg-[#161B22] border border-gray-800 rounded-full px-2 py-0.5">2,000+</span>
                    </div>
                    <Link href="/browse/groups" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        See all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {GROUPS.map((group) => (
                        <div key={group.id} className="flex-shrink-0 snap-start w-28 bg-[#161B22] border border-gray-800 hover:border-gray-600 rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer transition-colors">
                            <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium" style={{ background: group.color, color: group.text }}>
                                {group.initials}
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-medium text-white">{group.name}</div>
                                <div className="text-xs text-gray-500">{group.members} members</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- IDOLS --- */}
            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h2 className="text-base font-medium text-white">Popular idols</h2>
                        <span className="text-xs text-gray-500 bg-[#161B22] border border-gray-800 rounded-full px-2 py-0.5">8,200+</span>
                    </div>
                    <Link href="/browse/idols" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        See all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {IDOLS.map((idol) => (
                        <div key={idol.id} className="flex-shrink-0 snap-start w-20 flex flex-col items-center gap-1.5 cursor-pointer group">
                            <div className="w-14 h-14 rounded-full border-2 border-gray-800 group-hover:border-gray-600 flex items-center justify-center text-base font-medium transition-colors" style={{ background: idol.color, color: idol.text }}>
                                {idol.initials}
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-medium text-white">{idol.name}</div>
                                <div className="text-xs text-gray-500">{idol.group}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ALBUMS --- */}
            <section className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-white">Recent albums</h2>
                    <Link href="/browse/albums" className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                        See all <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                    {ALBUMS.map((album) => (
                        <div key={album.id} className="flex-shrink-0 snap-start w-32 bg-[#161B22] border border-gray-800 hover:border-gray-600 rounded-xl overflow-hidden cursor-pointer transition-colors">
                            <div className="w-full h-24 flex items-center justify-center text-2xl" style={{ background: album.color }}>
                                💿
                            </div>
                            <div className="p-2">
                                <div className="text-xs font-medium text-white truncate">{album.name}</div>
                                <div className="text-xs text-gray-500">{album.group} · {album.date}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- ERAS / PHOTOCARDS --- */}
            {ERAS.map((era) => (
                <section key={era.id} className="flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                        <div className="flex items-center gap-2">
                            <h2 className="text-base font-medium text-white">{era.group}</h2>
                            <span className="text-gray-600">/</span>
                            <span className="text-sm text-gray-400">{era.era}</span>
                            <span className="text-xs text-gray-600 bg-[#161B22] border border-gray-800 rounded px-2 py-0.5">{era.date}</span>
                        </div>
                        <Link href={`/browse/${era.era.toLowerCase()}`} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-300 transition-colors">
                            See full collection <ChevronRight className="h-3.5 w-3.5" />
                        </Link>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide snap-x">
                        {era.cards.map((card) => {
                            const rarity = RARITY_STYLES[card.rarity]
                            return (
                                <Link
                                    key={card.id}
                                    href={`/photocards/${card.id}`}
                                    className="group relative w-60 flex-shrink-0 aspect-[2/3] overflow-hidden rounded-[2rem] border border-gray-800 bg-[#161B22] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10"
                                >
                                    {/* Image */}
                                    <div className="absolute inset-0">
                                        <Image
                                            src={card.image}
                                            className="object-cover opacity-70 grayscale-[20%] transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                                            alt={card.name}
                                            fill
                                        />
                                    </div>
                                    {/* Rarity Badge - top left */}
                                    <div className="absolute top-3 left-3">
                                        <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border ${rarity.bg} ${rarity.text} ${rarity.border}`}>
                                            {card.rarity}
                                        </span>
                                    </div>

                                    {/* Card Type Badge - top right */}
                                    <div className="absolute top-3 right-3">
                                        <span className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border bg-gray-900/60 text-gray-300 border-white/10">
                                            {card.cardType}
                                        </span>
                                    </div>

                                    {/* Physical type badges - shown on hover only */}
                                    {card.physicalTypes.length > 0 && (
                                        <div className="absolute top-10 left-3 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {card.physicalTypes.map((type) => (
                                                <span
                                                    key={type}
                                                    className="text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border bg-white/10 text-white/70 border-white/10 w-fit"
                                                >
                                                    {type}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Overlay */}
                                    <div className="absolute inset-x-0 bottom-0 p-4 pt-16">
                                        {/* Default dark gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                                        {/* Hover pink gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-pink-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                                        <div className="relative z-10 flex flex-col gap-2">
                                            {/* Group + Album */}
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[10px] font-bold text-pink-400 uppercase tracking-widest group-hover:text-pink-300 transition-colors duration-300">
                                                    {card.group}
                                                </span>
                                                <span className="text-gray-600 text-[10px]">/</span>
                                                <span className="text-[10px] text-gray-500 truncate">
                                                    {card.album}
                                                </span>
                                            </div>

                                            {/* Card name */}
                                            <h3 className="text-sm font-bold text-white truncate leading-tight">
                                                {card.name}
                                            </h3>

                                            {/* Idol name */}
                                            <p className="text-xs text-gray-400 -mt-1">{card.idol}</p>

                                            {/* Price + action */}
                                            <div className="flex items-center justify-between border-t border-white/10 pt-2.5 mt-1">
                                                <div>
                                                    <span className="text-[9px] text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors duration-300">
                                                        Market est.
                                                    </span>
                                                    <div className="text-sm font-bold text-white">
                                                        ${card.marketPrice}
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault() // prevent Link navigation
                                                        // add to wishlist logic here
                                                    }}
                                                    className="h-9 w-9 flex items-center justify-center rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg shadow-pink-900/30"
                                                >
                                                    <ShoppingCart className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                </section>
            ))}

        </div>
    )
}