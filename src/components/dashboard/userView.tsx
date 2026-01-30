'use client'
import { Plus, Sparkles, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ROUTES } from '@/constants'

// 1. DUMMY DATA (To make the UI look good instantly)
const RECENT_DROPS = [
    { id: 1, title: 'Born to Be', group: 'ITZY', type: 'Album', image: 'https://upload.wikimedia.org/wikipedia/en/3/36/Itzy_-_Born_to_Be.png' },
    { id: 2, title: 'Drama', group: 'aespa', type: 'Merch', image: 'https://upload.wikimedia.org/wikipedia/en/f/f6/Aespa_-_Drama.png' },
    { id: 3, title: 'With YOU-th', group: 'TWICE', type: 'Album', image: 'https://upload.wikimedia.org/wikipedia/en/8/86/Twice_-_With_You-th.png' },
    { id: 4, title: 'Chill Kill', group: 'Red Velvet', type: 'Event', image: 'https://upload.wikimedia.org/wikipedia/en/e/e3/Red_Velvet_-_Chill_Kill.png' },
]

const MY_RECENT_ADDS = [
    { id: 1, name: 'Soundwave R2', member: 'Yeji', group: 'ITZY', rarity: 'POB', image: 'https://pbs.twimg.com/media/GD5rsqbaIAAr-x0.jpg' },
    { id: 2, name: 'Withmuu Lucky Draw', member: 'Karina', group: 'aespa', rarity: 'Lucky Draw', image: 'https://pbs.twimg.com/media/F_i2-eUbAAAbj3d.jpg' },
    { id: 3, name: 'Target Exclusive', member: 'Momo', group: 'TWICE', rarity: 'Album PC', image: 'https://i.ebayimg.com/images/g/H0IAAOSw~Bpl38~Q/s-l1200.jpg' },
]

export default function UserView({ displayName }: { displayName: string }) {
    return (
        <div className="flex flex-col gap-10">

            {/* --- 1. WELCOME & HERO SECTION --- */}
            <section>
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white">
                            Welcome back, <span className="text-pink-500">{displayName}</span> 👋
                        </h1>
                        <p className="mt-1 text-gray-400">Here is what’s happening in your collection today.</p>
                    </div>
                    <Link href={ROUTES.DASHBOARD.CARDS.CREATE} className="flex items-center gap-2 rounded-xl bg-pink-600 px-5 py-2.5 text-sm font-semibold text-white transition-hover hover:bg-pink-700">
                        <Plus className="h-4 w-4" />
                        Add New Card
                    </Link>
                </div>

                {/* Hero Card (The "Bias Progress" Banner) */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl border-2 animate-border">
                    {/* Background Pattern */}
                    <div className='absolute inset 0 h-full z-10 w-full bg-gradient-to-r from-black/100 from-30% to-transparent'></div>

                    <div className="
                        absolute right-0 top-0 h-full w-2/3 
                        bg-[url('/assets/images/yeji-2.jpg')] 
                        bg-cover bg-[center_30%]
                        
                        /* THE MAGIC PART */
                        [mask-image:linear-gradient(to_right,transparent,black_20%)]
                    "></div>

                    <div className="relative z-10 max-w-lg p-8">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-pink-200 backdrop-blur-sm">
                            <Sparkles className="h-3 w-3" />
                            <span>Main Goal</span>
                        </div>
                        <h2 className="text-4xl font-extrabold text-white">Complete the <br /> &quot;Born to Be&quot; Era</h2>
                        <p className="mt-4 text-purple-200">
                            You are currently <strong>84%</strong> of the way there! Only 3 more Yeji cards to go to finish this album set.
                        </p>

                        {/* Progress Bar */}
                        <div className="mt-8 ">
                            <div className="mb-2 flex justify-between text-sm font-semibold text-white">
                                <span>12 / 15 Cards</span>
                                <span>84%</span>
                            </div>
                            <div className="h-3 w-full rounded-full bg-white/30">
                                <div className="h-3 w-[84%] rounded-full bg-gradient-to-r from-pink-500 to-purple-400 shadow-[0_0_10px_rgba(236,72,153,0.5)]"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- 2. TRENDING / NEW DROPS (Horizontal Scroll) --- */}
            <section>
                <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-pink-500" />
                        <h3 className="text-xl font-bold text-white">Recent Comebacks</h3>
                    </div>
                    <a href="#" className="flex items-center text-sm font-medium text-gray-500 hover:text-white">
                        View All <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                </div>

                {/* Horizontal Scroll Container */}
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    {RECENT_DROPS.map((item) => (
                        <div key={item.id} className="group relative cursor-pointer overflow-hidden rounded-2xl bg-[#161B22] border border-gray-800 transition-all hover:-translate-y-1 hover:border-gray-700 hover:shadow-xl">
                            <div className="aspect-square w-full overflow-hidden">
                                <img src='/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg' alt={item.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                            </div>
                            <div className="p-4">
                                <p className="text-xs font-semibold text-pink-500 uppercase">{item.group}</p>
                                <h4 className="mt-1 font-bold text-white truncate">{item.title}</h4>
                                <p className="text-xs text-gray-500">{item.type}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- 3. RECENTLY ADDED (The Grid) --- */}
            <section>
                <h3 className="mb-6 text-xl font-bold text-white">Your Recent Pulls</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {MY_RECENT_ADDS.map((card) => (
                        <div key={card.id} className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-[#161B22] p-3 transition-colors hover:bg-[#1c222b]">
                            {/* Mini Card Image */}
                            <div className="relative h-16 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-800">
                                <Image src='/assets/images/yeji-2.jpg' alt={card.name} fill className="object-cover" />
                            </div>

                            {/* Card Info */}
                            <div className="flex-1 min-w-0">
                                <h4 className="truncate font-bold text-white">{card.name}</h4>
                                <p className="text-sm text-gray-400">{card.member} • {card.group}</p>
                            </div>

                            {/* Rarity Badge */}
                            <span className="rounded-lg bg-gray-800 px-3 py-1 text-xs font-medium text-gray-300">
                                {card.rarity}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

        </div>
    )
}