'use client'

import { Heart, ShoppingCart } from 'lucide-react'
import Image from 'next/image'

const WISHLIST_DATA = [
    { id: 1, name: 'Checkmate Yeji', group: 'ITZY', priority: 'High', image: 'https://pbs.twimg.com/media/GD5rsqbaIAAr-x0.jpg', price: 15 },
    { id: 2, name: 'Savage Karina', group: 'aespa', priority: 'Medium', image: 'https://pbs.twimg.com/media/F_i2-eUbAAAbj3d.jpg', price: 15 },
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
                        className="group relative aspect-[2/3] overflow-hidden rounded-[2rem] border border-gray-800 bg-[#161B22] transition-all duration-500 hover:-translate-y-2 hover:border-pink-500/50 hover:shadow-2xl hover:shadow-pink-500/10"
                    >
                        {/* Image Container */}
                        <div className='relative h-full w-full'>
                            <div className='h-full w-full relative opacity-60 grayscale-[40%] transition-all duration-700 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110'>
                                <Image
                                    src="/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg"
                                    className="object-cover"
                                    alt={item.name}
                                    fill
                                />
                            </div>

                            {/* Priority Badge (Glassmorphism) */}
                            <div className="absolute top-4 left-4 right-4 flex justify-end pointer-events-none">
                                <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest backdrop-blur-md border transition-all duration-300 ${item.priority === 'High'
                                        ? 'bg-red-500/20 text-red-400 border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
                                        : 'bg-gray-900/60 text-gray-300 border-white/10'
                                    }`}>
                                    {item.priority}
                                </span>
                            </div>
                        </div>

                        {/* Overlay Info (Aggressive Gradient) */}
                        <div className="absolute inset-x-0 bottom-0 to-transparent p-5 pt-16 transition-all duration-300 ">
                            {/* Base Black Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/90 to-transparent transition-opacity duration-300 group-hover:opacity-0 p-5 pt-16" />

                            {/* Hover Pink Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-pink-900/40 via-pink-700/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 p-5 pt-16" />
                            
                            <div className="relative z-10 mb-4">
                                <p className="text-[10px] font-black text-pink-500 uppercase tracking-[0.2em] leading-none mb-1.5 group-hover:text-purple-800 transition-all duration-300">
                                    {item.group}
                                </p>
                                <h3 className="text-base font-bold text-white truncate leading-tight tracking-tight">
                                    {item.name}
                                </h3>
                            </div>

                            <div className="relative z-10 flex items-center justify-between gap-2 border-t border-white/10 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter group-hover:text-white transition-all duration-300">Market Est.</span>
                                    <span className="text-sm font-black text-white">
                                        ${item.price || '15'}
                                    </span>
                                </div>

                                <button className="flex cursor-pointer  h-10 w-10 items-center justify-center rounded-2xl bg-pink-600 text-white shadow-xl shadow-pink-900/40 transition-all duration-300 hover:scale-110 hover:bg-pink-500 active:scale-95">
                                    <ShoppingCart className="h-5 w-5" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}