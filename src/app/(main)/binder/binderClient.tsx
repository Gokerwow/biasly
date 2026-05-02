'use client'

import { useModal } from '@/app/providers/modalProvider';
import { BinderFolder } from '@/components/binder/binderFolder';
import { Button } from '@/components/UI/button';
import { Input } from '@/components/UI/input';
import { ROUTES } from '@/constants';
import { Binder } from '@/types';
import { Book, Plus } from 'lucide-react'
import Link from 'next/link';

interface BinderClientProps {
    bindersData: Binder[]
}

export default function BinderClient({ bindersData }: BinderClientProps) {
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
                <Link href={ROUTES.BINDER.CREATE} className="group relative flex aspect-[3/4] flex-col items-center justify-center gap-4 rounded-[2.5rem] border-2 border-dashed border-gray-800 bg-transparent transition-all hover:border-pink-500/50 hover:bg-pink-500/5 overflow-hidden">
                    <div className="relative z-10 rounded-full bg-gray-800 p-5 transition-all group-hover:bg-pink-500/20 group-hover:scale-110">
                        <Plus className="h-10 w-10 text-gray-500 group-hover:text-pink-500" />
                    </div>
                    <span className="relative z-10 font-black text-gray-500 uppercase tracking-widest text-xs group-hover:text-pink-500">Add Collection</span>

                    {/* Ghost Ring Effect for the placeholder */}
                    <div className="absolute left-0 top-0 h-full w-4 bg-white/5 border-r border-white/5" />
                </Link>

                {/* Binder Cards */}
                {bindersData.map(binder => {
                    return <BinderFolder
                        key={binder.id}
                        binder={binder}
                    />
                })}
            </div>
        </div>
    )
}