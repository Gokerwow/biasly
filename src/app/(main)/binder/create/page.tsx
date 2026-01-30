'use client'

import { motion } from 'framer-motion'
import { Plus, MoreVertical, Share2, Edit3, Filter } from 'lucide-react'
import { useModal } from '@/app/providers/modalProvider' // Your custom hook
import { Button } from '@/components/cards/UI/button' // Your custom button
import Image from 'next/image'

// --- MOCK DATA (Ideally this comes from Supabase) ---
const mockBinder = {
    title: "Yuna: ITZ ME Era",
    description: "Collecting all version A and pre-order benefits.",
    total_slots: 9, // A standard 9-pocket page
    cards: [
        { id: '1', name: 'Wannabe Ver. A', type: 'Album PC', image: '/mock-card-1.jpg', status: 'owned' },
        { id: '2', name: 'Soundwave R1', type: 'POB', image: '/mock-card-2.jpg', status: 'owned' },
        { id: '3', name: 'Makestar Holo', type: 'Lucky Draw', image: '', status: 'wishlist' },
    ]
}

// --- SUB-COMPONENT: The Card Itself ---
const PhotoCard = ({ card, onClick }: { card: any, onClick: () => void }) => (
    <motion.div
        layoutId={card.id}
        whileHover={{ y: -5, scale: 1.02 }}
        onClick={onClick}
        className="group relative w-full aspect-[2.5/3.5] cursor-pointer"
    >
        {/* The Card Container */}
        <div className={`relative h-full w-full overflow-hidden rounded-xl border ${card.status === 'owned' ? 'border-gray-800' : 'border-dashed border-gray-700 bg-gray-900/50'}`}>
            
            {/* Image (If owned) */}
            {card.status === 'owned' ? (
                <>
                    {/* Placeholder color for demo - replace src with card.image */}
                    <div className="absolute inset-0 bg-gray-800" /> 
                    <img 
                        src="https://i.pinimg.com/736x/8e/bc/33/8ebc339fa76a47320b987515db811df6.jpg" // Demo Image
                        alt={card.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Glossy Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </>
            ) : (
                /* Wishlist State */
                <div className="flex h-full flex-col items-center justify-center p-4 text-center opacity-50">
                    <div className="rounded-full bg-gray-800 p-3 mb-2">
                        <span className="text-xl">👻</span>
                    </div>
                    <p className="text-xs font-bold text-gray-500 uppercase">{card.type}</p>
                </div>
            )}

            {/* Labels (Visible on Hover) */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <p className="text-sm font-bold text-white truncate">{card.name}</p>
                <p className="text-[10px] text-pink-500 font-bold uppercase tracking-wider">{card.type}</p>
            </div>
        </div>

        {/* Status Badge */}
        {card.status === 'wishlist' && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-md backdrop-blur-md">
                <p className="text-[10px] font-bold text-yellow-500 uppercase tracking-widest">ISO</p>
            </div>
        )}
    </motion.div>
)

// --- SUB-COMPONENT: Empty Slot (Add New) ---
const EmptySlot = ({ onClick }: { onClick: () => void }) => (
    <motion.button
        whileHover={{ scale: 1.02, borderColor: '#ec4899' }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative flex w-full aspect-[2.5/3.5] flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-800 bg-[#161B22]/50 transition-colors hover:bg-[#161B22]"
    >
        <div className="rounded-full bg-gray-800 p-4 text-gray-400 group-hover:text-pink-500 transition-colors">
            <Plus className="h-6 w-6" />
        </div>
        <p className="mt-3 text-xs font-bold text-gray-500 uppercase tracking-widest">Add Card</p>
    </motion.button>
)

// --- MAIN PAGE COMPONENT ---
export default function BinderDetailPage({ params }: { params: { id: string } }) {
    const { onOpen } = useModal()

    // Animation Variants for "Staggered" entrance
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    }

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    }

    return (
        <div className="min-h-screen pb-20">
            {/* 1. Binder Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 border-b border-gray-800 pb-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-2 py-1 rounded bg-pink-500/10 text-pink-500 text-[10px] font-black uppercase tracking-widest">
                            Public Binder
                        </span>
                        <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                            {mockBinder.cards.filter(c => c.status === 'owned').length} / {mockBinder.total_slots} Collected
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black italic text-white uppercase tracking-tighter">
                        {mockBinder.title}
                    </h1>
                    <p className="text-gray-400 mt-2 max-w-lg text-sm leading-relaxed">
                        {mockBinder.description}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="p-3 rounded-xl bg-[#161B22] border border-gray-800 text-gray-400 hover:text-white transition-colors">
                        <Edit3 className="h-4 w-4" />
                    </button>
                    <button className="p-3 rounded-xl bg-[#161B22] border border-gray-800 text-gray-400 hover:text-white transition-colors">
                        <Share2 className="h-4 w-4" />
                    </button>
                    <Button onClick={() => onOpen('Add New Card', <div>Form goes here</div>)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Card
                    </Button>
                </div>
            </div>

            {/* 2. Controls / Filters */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex gap-2">
                    {/* Fake Filter Pills */}
                    {['All', 'Owned', 'Missing', 'Holo'].map((filter, i) => (
                        <button 
                            key={filter}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide border transition-all ${i === 0 ? 'bg-white text-black border-white' : 'bg-transparent text-gray-500 border-gray-800 hover:border-gray-600'}`}
                        >
                            {filter}
                        </button>
                    ))}
                </div>
                <button className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest hover:text-white">
                    <Filter className="h-3 w-3" /> Sort By
                </button>
            </div>

            {/* 3. The Grid (Binder Sleeve View) */}
            <motion.div 
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
            >
                {/* Render Existing Cards */}
                {mockBinder.cards.map((card) => (
                    <motion.div key={card.id} variants={item}>
                        <PhotoCard 
                            card={card} 
                            onClick={() => onOpen(`Card Details: ${card.name}`, <div>Details for {card.name}</div>)} 
                        />
                    </motion.div>
                ))}

                {/* Render Empty Slots to fill the grid (Optional Logic) */}
                <motion.div variants={item}>
                    <EmptySlot onClick={() => onOpen('Add Card', <div>Search Database Form</div>)} />
                </motion.div>
            </motion.div>
        </div>
    )
}