import { getProfile } from '@/app/lib/userServer'
import CardItem from '@/components/cards/cards'
import { GetUserWishlist } from '@/queries/photocards'
import { SimpleIdol } from '@/types'
import { Heart, Flame, Users } from 'lucide-react'

export default async function Wishlist() {
    const profile = (await getProfile())!
    const wishlists = await GetUserWishlist(profile.id)

    const highPriority = wishlists.filter(w => w.priority === 'high').length
    const uniqueGroups = new Set(wishlists.map(w => w.photocards?.groups?.name).filter(Boolean)).size

    return (
        <div className="flex flex-col gap-8 pb-10">

            {/* --- HEADER --- */}
            <div className="flex flex-col gap-6">
                {/* Title row */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="flex items-center gap-3 text-4xl font-black text-white italic tracking-tighter uppercase">
                            <Heart className="h-8 w-8 text-pink-500" fill="currentColor" />
                            My Wishlist
                        </h1>
                        <p className="text-gray-500 mt-1 text-sm">
                            Photocards you are currently hunting for.
                        </p>
                    </div>
                </div>

                {/* Stats row — full width, consistent styling */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <Heart className="h-5 w-5 text-pink-400" fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Wishlisted</p>
                            <p className="font-mono text-xl font-black text-white">{wishlists.length}</p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
                            <Flame className="h-5 w-5 text-red-400" fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">High Priority</p>
                            <p className="font-mono text-xl font-black text-red-400">{highPriority}</p>
                        </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
                            <Users className="h-5 w-5 text-pink-400" />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Groups</p>
                            <p className="font-mono text-xl font-black text-pink-400">{uniqueGroups}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- EMPTY STATE --- */}
            {wishlists.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="h-20 w-20 rounded-full bg-pink-500/10 flex items-center justify-center mb-4">
                        <Heart className="h-10 w-10 text-pink-500/50" />
                    </div>
                    <h3 className="text-xl font-bold text-white">No cards wishlisted yet</h3>
                    <p className="text-gray-500 text-sm mt-1 max-w-sm">
                        Browse the catalog and hit the wishlist button on cards you want to hunt.
                    </p>
                </div>
            )}

            {/* --- GRID --- */}
            {wishlists.length > 0 && (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {wishlists.map((item) => {
                        if (!item.photocards) return null

                        const idols = item.photocards.photocards_idol
                            .map(pi => pi.idol)
                            .filter((i) => i !== null) as SimpleIdol[]

                        return (
                            <div key={item.id} className="relative">
                                <CardItem
                                    id={item.photocards.id}
                                    front_image_url={item.photocards.front_image_url}
                                    group_name={item.photocards.groups?.name ?? null}
                                    name={item.photocards.name}
                                    rarity={item.photocards.rarity ?? 'N'}
                                    distribution_type={item.photocards.distribution_types?.name}
                                    idols={idols}
                                    release_title={item.photocards.releases?.title}
                                    type='collection'
                                    priority={item.priority ?? 'high'}
                                />
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}