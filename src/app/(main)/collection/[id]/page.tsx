'use client'

import {
    ChevronLeft,
    Share2,
    Heart,
    Info,
    TrendingUp,
    ShieldCheck,
    Calendar
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CardDetailPage() {
    const router = useRouter()

    // For now, we use dummy data. Later, we'll fetch this using the 'id' from the URL.
    const card = {
        name: 'Checkmate Yeji',
        group: 'ITZY',
        era: 'Checkmate',
        rarity: 'Super Rare',
        status: 'Owned',
        price: '$15.00',
        addedDate: 'Dec 21, 2025',
        image: '/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg', // Placeholder
        description: 'Exclusive POB from Soundwave Round 1. Features a matte finish with a special holographic border.'
    }

    return (
        <div className="flex flex-col gap-10 relative">
            {/* 1. BACK BUTTON & ACTIONS */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                >
                    <div className="rounded-full bg-gray-800 p-2 group-hover:bg-gray-700">
                        <ChevronLeft className="h-5 w-5" />
                    </div>
                    <span className="font-bold uppercase tracking-widest text-xs">Back to Vault</span>
                </button>

                <div className="flex gap-4">
                    <button className="rounded-xl border border-gray-800 bg-[#161B22] p-3 text-gray-400 hover:text-white">
                        <Share2 className="h-5 w-5" />
                    </button>
                    <button className="rounded-xl border border-gray-800 bg-[#161B22] p-3 text-pink-500 hover:bg-pink-500/10">
                        <Heart className="h-5 w-5 fill-current" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">

                {/* 2. LEFT SIDE: THE HERO IMAGE */}
                <div className="lg:col-span-5">
                    <div className="group relative aspect-[3/4] w-full overflow-hidden rounded-[2.5rem] border border-gray-800 bg-gray-900 shadow-2xl shadow-pink-500/10">
                        <Image
                            src={card.image}
                            alt={card.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                        {/* Glossy Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
                    </div>
                </div>

                {/* 3. RIGHT SIDE: THE DATA */}
                <div className="lg:col-span-7 flex flex-col gap-8">

                    {/* Title Section */}
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <span className="rounded-md bg-pink-500/20 px-2 py-1 text-[10px] font-black uppercase tracking-widest text-pink-500 border border-pink-500/30">
                                {card.rarity}
                            </span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-tighter">
                                {card.group} • {card.era} Era
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-white italic tracking-tighter uppercase leading-none">
                            {card.name}
                        </h1>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-4">
                            <div className="mb-2 flex items-center gap-2 text-gray-500">
                                <TrendingUp className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase">Value</span>
                            </div>
                            <p className="text-xl font-black text-white">{card.price}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-4">
                            <div className="mb-2 flex items-center gap-2 text-gray-500">
                                <ShieldCheck className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase">Status</span>
                            </div>
                            <p className="text-xl font-black text-green-400">{card.status}</p>
                        </div>
                        <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-4 sm:col-span-1">
                            <div className="mb-2 flex items-center gap-2 text-gray-500">
                                <Calendar className="h-4 w-4" />
                                <span className="text-[10px] font-bold uppercase">Acquired</span>
                            </div>
                            <p className="text-sm font-bold text-white">{card.addedDate}</p>
                        </div>
                    </div>

                    {/* Information Card */}
                    <div className="rounded-3xl border border-gray-800 bg-[#161B22]/50 p-6 backdrop-blur-sm">
                        <div className="mb-4 flex items-center gap-2 text-white">
                            <Info className="h-5 w-5 text-pink-500" />
                            <h3 className="font-bold uppercase tracking-tight">Collector's Notes</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-sm">
                            {card.description}
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 mt-auto">
                        <button className="flex-1 rounded-2xl bg-white py-4 text-sm font-black text-black transition-transform hover:scale-105 active:scale-95">
                            EDIT CARD DETAILS
                        </button>
                        <button className="flex-1 rounded-2xl bg-gray-800 py-4 text-sm font-black text-white transition-transform hover:scale-105 active:scale-95 border border-gray-700">
                            MOVE TO BINDER
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}