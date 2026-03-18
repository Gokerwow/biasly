'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

const WISHLIST_DATA = [
    { id: 1, name: 'Checkmate Yeji', idol: "Yuna", group: 'ITZY', priority: 'High', image: 'https://pbs.twimg.com/media/GD5rsqbaIAAr-x0.jpg', price: 15, rarity: 'UR' },
    { id: 2, name: 'Savage Karina', idol: "Yuna", group: 'aespa', priority: 'Medium', image: 'https://pbs.twimg.com/media/F_i2-eUbAAAbj3d.jpg', price: 15, rarity: 'SSR' },
    // ... more items
]

export default function Wishlist() {
    return (
        <div className="flex flex-col gap-8 pb-10">
            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">My Wishlist</h1>
                    <p className="text-gray-400">Photocards you are currently hunting for.</p>
                </div>
                <div className="flex items-center gap-2 rounded-2xl bg-[#161B22] border border-gray-800 p-2 px-5 text-pink-500 font-bold shadow-lg shadow-pink-500/5">
                    <Heart className="h-5 w-5 fill-current" />
                    <span className="text-sm tracking-tight">{WISHLIST_DATA.length} Items</span>
                </div>
            </div>

            {/* Grid Section */}
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {WISHLIST_DATA.map((item) => (
                    <div
                        key={item.id}
                        className="group relative aspect-[2/3] overflow-hidden rounded-[2rem] border border-gray-800 bg-[#161B22] cursor-pointer transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/30 hover:shadow-xl hover:shadow-pink-500/10"
                    >
                        {/* Image */}
                        <div className="relative h-full w-full">
                            <Image
                                src="/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg"
                                className="object-cover opacity-70 grayscale-[20%] transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-105"
                                alt={item.name}
                                fill
                            />
                        </div>

                        {/* Priority Badge */}
                        <div className="absolute top-3 right-3">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border transition-all duration-300
            ${item.priority === 'High'
                                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                                    : item.priority === 'Medium'
                                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                        : 'bg-gray-500/20 text-gray-300 border-gray-500/30'
                                }`}
                            >
                                {item.priority}
                            </span>
                        </div>

                        {/* Rarity Badge - top left */}
                        <div className="absolute top-3 left-3">
                            <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-widest backdrop-blur-md border transition-all duration-300
            ${item.rarity === 'UR'
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                    : item.rarity === 'SSR'
                                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/30'
                                        : item.rarity === 'SR'
                                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                            : item.rarity === 'R'
                                                ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
                                                : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                                }`}
                            >
                                {item.rarity}
                            </span>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 pt-16">
                            {/* Default dark gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-0" />
                            {/* Hover pink gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-950/80 via-pink-900/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                            <div className="relative z-10 flex flex-col gap-3">
                                <div>
                                    <p className="text-[10px] font-bold text-pink-400 uppercase tracking-widest mb-1 group-hover:text-pink-300 transition-colors duration-300">
                                        {item.group}
                                    </p>
                                    <h3 className="text-sm font-bold text-white truncate leading-tight">
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-gray-400 mt-0.5">{item.idol}</p>
                                </div>

                                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                    <div>
                                        <span className="text-[9px] text-gray-500 uppercase tracking-wider group-hover:text-gray-300 transition-colors duration-300">
                                            Market est.
                                        </span>
                                        <div className="text-sm font-bold text-white">
                                            ${item.price || '15'}
                                        </div>
                                    </div>
                                    <button className="h-9 w-9 flex items-center justify-center rounded-xl bg-pink-600 hover:bg-pink-500 text-white transition-all duration-200 hover:scale-110 active:scale-95 shadow-lg shadow-pink-900/30">
                                        <ShoppingCart className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}