import { getProfile } from '@/app/lib/userServer'
import CardItem from '@/components/cards/cards'
import { getUserCollections } from '@/queries/photocards'
import { SimpleIdol } from '@/types'
import { Filter, Search, LayoutGrid, List } from 'lucide-react'


export default async function CollectionPage() {
    const profile = await getProfile()

    const userCollections = profile ? await getUserCollections(profile?.id) : []
    const recentCollectedCard = userCollections.slice(0, 6)

    return (
        <div className="flex flex-col gap-6">

            {/* --- 1. HERO BANNER --- */}
            <div className="relative w-full overflow-hidden rounded-3xl border border-gray-800 bg-[#161B22]">

                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
                />

                {/* Pink glow */}
                <div className="absolute -top-20 -right-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl" />

                <div className="relative z-10 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">

                    {/* Left — title */}
                    <div>
                        <p className="text-xs font-black text-pink-500 uppercase tracking-widest mb-2">
                            Your Vault
                        </p>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase">
                            My Collection
                        </h1>
                        <p className="mt-1 text-gray-400 text-sm">
                            Manage, track, and flex your inventory.
                        </p>
                    </div>

                    {/* Right — stats */}
                    <div className="flex gap-4 shrink-0">
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total Cards</p>
                            <p className="font-mono text-2xl font-black text-white mt-1">
                                {userCollections.length}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Groups</p>
                            <p className="font-mono text-2xl font-black text-pink-400 mt-1">
                                {new Set(userCollections.map(c => c.photocards?.group?.name).filter(Boolean)).size}
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-center">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Idols</p>
                            <p className="font-mono text-2xl font-black text-purple-400 mt-1">
                                {new Set(userCollections.flatMap(c => c.photocards?.idols.map(pi => pi.id) ?? []).filter(Boolean)).size}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* --- 2. MAIN CONTENT SPLIT (Filters + Grid) --- */}
            <div className="flex gap-8">

                {/* LEFT: FILTERS SIDEBAR (Sticky) */}
                <aside className="sticky inset-0 h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto rounded-2xl border border-gray-800 bg-[#161B22] p-4 hidden lg:block">
                    <div className="mb-6 flex items-center gap-2 text-white">
                        <Filter className="h-4 w-4 text-pink-500" />
                        <span className="font-bold">Filters</span>
                    </div>

                    {/* Filter Group: Status */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-xs font-bold text-gray-500 uppercase">Status</h3>
                        <div className="flex gap-2 rounded-lg bg-black/30 p-1">
                            <button className="flex-1 rounded-md bg-gray-700 py-1.5 text-xs font-medium text-white shadow">All</button>
                            <button className="flex-1 rounded-md py-1.5 text-xs font-medium text-gray-400 hover:text-white">Owned</button>
                            <button className="flex-1 rounded-md py-1.5 text-xs font-medium text-gray-400 hover:text-white">Wishlist</button>
                        </div>
                    </div>

                    {/* Filter Group: Groups */}
                    <div className="mb-6">
                        <h3 className="mb-3 text-xs font-bold text-gray-500 uppercase">Groups</h3>
                        <div className="space-y-2">
                            {['ITZY', 'aespa', 'TWICE', 'Red Velvet', 'NMIXX'].map((group) => (
                                <label key={group} className="flex items-center gap-3 cursor-pointer group">
                                    <div className="flex h-4 w-4 items-center justify-center rounded border border-gray-600 bg-transparent transition-colors group-hover:border-pink-500">
                                        {/* Checkbox simulated */}
                                    </div>
                                    <span className="text-sm text-gray-300 group-hover:text-white">{group}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* RIGHT: THE GRID */}
                <div className="flex-1">
                    {/* Toolbar */}
                    <div className="mb-6 flex items-center justify-between">
                        <div className="relative w-full max-w-md">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search by card name..."
                                className="w-full rounded-xl border border-gray-800 bg-[#161B22] py-2.5 pl-10 text-sm text-white focus:border-pink-500 focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button className="rounded-lg bg-[#161B22] p-2 text-white hover:bg-gray-800"><LayoutGrid className="h-5 w-5" /></button>
                            <button className="rounded-lg bg-[#161B22] p-2 text-gray-500 hover:bg-gray-800 hover:text-white"><List className="h-5 w-5" /></button>
                        </div>
                    </div>

                    {/* Cards Grid */}
                    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
                        {userCollections.map((card) => {
                            if (!card.photocards) return null

                            return <CardItem
                                key={card.id}
                                id={card.photocards.id}
                                front_image_url={card.photocards.front_image_url}
                                group_name={card.photocards.group?.name ?? 'No Group Name'}
                                name={card.photocards.name}
                                rarity={card.photocards.rarity ?? 'N'}
                                idols={card.photocards.idols}
                                distribution_type={card.photocards.distribution_type?.name}
                                release_title={card.photocards?.releases?.title}
                                type='collection'
                            />
                        })}
                    </div>
                </div>

            </div>
        </div>
    )
}