import { GetReleasesWithCards } from '@/queries/releases'
import CardItem from '@/components/cards/cards'
import { Compass, Sparkles, ChevronRight, Filter, Search } from 'lucide-react'
import Link from 'next/link'
import { SimpleIdol } from '@/types'
import { getProfile } from '@/app/lib/userServer'
import { GetUserCollectionIds, GetUserWishlistIds } from '@/queries/photocards'

export default async function BrowsePage() {
    const profile = await getProfile()


    const releaseWithCards = await GetReleasesWithCards()
    const collectionIds = profile ? await GetUserCollectionIds(profile.id) : []
    const wishlistIds = profile ? await GetUserWishlistIds(profile.id) : []

    console.log('INI YGY    ', releaseWithCards)

    const featuredRelease = releaseWithCards[0]
    const bannerImage = featuredRelease.photocards[0]?.front_image_url
    console.log(bannerImage)

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
            <section className="group animate-border relative h-64 w-full overflow-hidden rounded-[2.5rem] border border-pink-500/20 shadow-2xl transition-all duration-500 hover:border-pink-500/40">

                {/* Background image — right side fading left */}
                <div className="absolute right-0 top-0 h-full w-2/3 bg-cover bg-[center_30%] [mask-image:linear-gradient(to_right,transparent,black_20%)]"
                    style={{ backgroundImage: `url(${bannerImage})` }}
                />


                {/* Dark overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0B0E11] via-[#0B0E11]/80 to-transparent" />

                {/* Content */}
                <div className="relative z-10 flex h-full flex-col justify-center gap-3 px-8 md:px-12">
                    {/* Badge */}
                    <div className="flex items-center gap-2 rounded-full bg-pink-500/20 px-3 py-1 text-[10px] font-black text-pink-400 border border-pink-500/30 w-fit uppercase tracking-widest">
                        <Sparkles className="h-3 w-3" />
                        Latest Release
                    </div>

                    {/* Title — smaller to fit h-64 */}
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter italic uppercase leading-none">
                            {featuredRelease.title} <span className="text-pink-500">Era</span>
                        </h2>
                        <p className="text-sm text-gray-400 mt-1 font-medium">
                            {featuredRelease.groups?.name} · Oct 2024
                        </p>
                    </div>

                    {/* Actions — smaller buttons */}
                    <div className="flex items-center gap-3">
                        <button className="rounded-full bg-pink-600 px-5 py-2 text-xs font-black text-white transition-all hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] active:scale-95 uppercase tracking-widest">
                            Explore Set
                        </button>
                        <button className="rounded-full bg-white/5 border border-white/10 px-5 py-2 text-xs font-black text-white/70 transition-all hover:bg-white/10 active:scale-95 uppercase tracking-widest">
                            Album Info
                        </button>
                    </div>
                </div>
            </section>

            {/* --- 3. BROWSE BY ERA (GROUPS) --- */}
            {releaseWithCards.map((release, index) => (
                <section key={index} className="flex flex-col gap-6">
                    <div className="flex items-center justify-between border-b border-gray-800/50 pb-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                {release.groups?.name} <span className="text-gray-600 mx-1">/</span> {release.title}
                            </h3>
                            <span className="rounded-md bg-gray-800 px-2 py-1 text-[10px] font-bold text-gray-500">
                                {release.release_date ?? release.category}
                            </span>
                        </div>
                        <Link href={`/browse/${release.title.toLowerCase()}`} className="group flex items-center gap-1 text-sm font-bold text-gray-500 hover:text-pink-500 transition-colors">
                            See Full Collection <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    {/* Horizontal Scroll for Cards */}
                    <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x">
                        {release.photocards.map((card) => (
                            <div key={card.id} className="shrink-0 w-54 snap-start p-2">
                                <CardItem
                                    asLink
                                    front_image_url={card.front_image_url}
                                    group_name={release.groups?.name ?? null}
                                    id={card.id}
                                    name={card.name}
                                    rarity={card.rarity ?? 'N'}
                                    distribution_type={card.distribution_types?.name}
                                    idols={card.photocards_idol.map(pi => pi.idol).filter((i) => i !== null) as SimpleIdol[]}
                                    release_title={release.title}
                                    type='browse'
                                    isInCollection={collectionIds.includes(card.id)}
                                    isInWishlist={wishlistIds.includes(card.id)}
                                />
                            </div>
                        ))}
                    </div>
                </section>
            ))}
        </div>
    )
}