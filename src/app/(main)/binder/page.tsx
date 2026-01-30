'use client'

import { useModal } from '@/app/providers/modalProvider';
import { Button } from '@/components/cards/UI/button';
import { Input } from '@/components/cards/UI/input';
import { SearchBar } from '@/components/searchBar';
import { Book, Plus, MoreVertical, Layers, Search, Star } from 'lucide-react'
import Image from 'next/image';

export const dynamic = 'force-dynamic';

// Dummy Data for Binders
const BINDERS = [
    {
        id: 1,
        name: 'Yuna Solo Collection',
        count: 42,
        total: 50,
        cover: 'https://kzcucrksqzdypkmlviex.supabase.co/storage/v1/object/public/Cards/WhatsApp%20Image%202025-12-21%20at%209.57.33%20AM%20(2).jpeg',
        color: 'from-pink-500',
        isPinned: true
    },
    {
        id: 2,
        name: 'ITZY - Born to Be OT5',
        count: 15,
        total: 25,
        cover: 'https://kzcucrksqzdypkmlviex.supabase.co/storage/v1/object/public/Cards/WhatsApp%20Image%202025-12-21%20at%209.57.33%20AM%20(2).jpeghttps://wallpapers.com/images/hd/itzy-born-to-be-concept-photo-0d5w5w5w5w5w5w5.jpg',
        color: 'from-purple-600',
        isPinned: true
    },
    {
        id: 3,
        name: 'Trading Folder',
        count: 8,
        total: 100,
        cover: 'https://kzcucrksqzdypkmlviex.supabase.co/storage/v1/object/public/Cards/WhatsApp%20Image%202025-12-21%20at%209.57.33%20AM%20(2).jpeg',
        color: 'from-blue-500',
        isPinned: true
    },
]

export default function BinderPage() {
    const { setIsOpen } = useModal()

    const handleOpenModal = () => {
        setIsOpen(true)
    }

    return (
        <div className="flex flex-col gap-8 relative">

            {/* --- HEADER --- */}
            <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="flex items-center gap-3 text-4xl font-black text-white italic tracking-tighter">
                        <Book className="h-10 w-10 text-pink-500" />
                        MY BINDERS
                    </h1>
                    <p className="text-gray-400 mt-1">Curate and showcase your collection eras.</p>
                </div>

                <div className="flex items-center gap-4">
                    <Input 
                        isSearch={true}
                        name='searchBinder'
                        placeholder='Search Binder...'
                    />
                    <Button onClick={handleOpenModal}>
                        <Plus className="h-4 w-4" />
                        New Binder
                    </Button>
                </div>
            </header>

            {/* --- BINDERS GRID --- */}
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

                {/* Create New Binder Button */}
                <button className="group relative flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-gray-800 bg-transparent transition-all hover:border-pink-500/50 hover:bg-pink-500/5 overflow-hidden">
                    <div className="relative z-10 rounded-full bg-gray-800 p-5 transition-all group-hover:bg-pink-500/20 group-hover:scale-110">
                        <Plus className="h-10 w-10 text-gray-500 group-hover:text-pink-500" />
                    </div>
                    <span className="relative z-10 font-black text-gray-500 uppercase tracking-widest text-xs group-hover:text-pink-500">Add Collection</span>

                    {/* Ghost Ring Effect for the placeholder */}
                    <div className="absolute left-0 top-0 h-full w-4 bg-white/5 border-r border-white/5" />
                </button>

                {/* Binder Cards */}
                {BINDERS.map((binder) => {
                    const progress = (binder.count / binder.total) * 100;

                    return (
                        <div key={binder.id} className="group relative aspect-[3/4] cursor-pointer overflow-hidden rounded-[2.5rem] border border-gray-800 bg-[#0B0E11] transition-all duration-500 hover:-translate-y-3 hover:border-pink-500/40 shadow-2xl">

                            {/* Binder Cover Image */}
                            <Image
                                src={binder.cover}
                                alt={binder.name}
                                fill
                                className="object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110 group-hover:opacity-60"
                            />

                            {/* Dynamic Glow & Shadow */}
                            <div className={`absolute inset-0 bg-gradient-to-t ${binder.color} via-black/60 to-transparent opacity-80`} />

                            {/* Binder Highlight Star (If Pinned) */}
                            {binder.isPinned && (
                                <div className="absolute top-6 right-6 z-20">
                                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" />
                                </div>
                            )}

                            {/* Content Wrapper */}
                            <div className="absolute inset-0 z-10 flex flex-col justify-end p-8">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-black text-white backdrop-blur-md border border-white/10 tracking-widest uppercase">
                                        <Layers className="h-3 w-3" />
                                        {binder.count}/{binder.total}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-white leading-none uppercase tracking-tighter italic group-hover:text-pink-400 transition-colors">
                                    {binder.name}
                                </h3>

                                {/* Progress Section */}
                                <div className="mt-6 space-y-2">
                                    <div className="flex justify-between text-[10px] font-black text-white/50 uppercase tracking-widest">
                                        <span>Completion</span>
                                        <span className="text-white">{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-black/60 backdrop-blur-sm">
                                        <div
                                            className="h-full bg-white rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_white]"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Binder Spine/Ring Effect */}
                            <div className="absolute left-0 top-0 h-full w-5 bg-gradient-to-r from-black/40 to-transparent backdrop-blur-[2px] border-r border-white/10" />

                            {/* Hover Options Overlay */}
                            <button className="absolute top-6 left-8 z-20 p-2 rounded-full bg-black/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-black/40">
                                <MoreVertical className="h-5 w-5 text-white" />
                            </button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}