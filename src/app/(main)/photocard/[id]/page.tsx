import {
    Share2,
    Heart,
    Plus,
    Calendar,
    Tag,
    Disc3,
    User,
    StickyNote,
    ShieldCheck,
} from 'lucide-react'
import Link from 'next/link'
import BackButton from '@/components/UI/backButton'
import FlipImage from '@/components/cards/flipimage'
import { getProfile } from '@/app/lib/userServer'
import { CheckCardOwning, CheckCardWishlisted, GetCardByID } from '@/queries/photocards'
import NotFound from '@/app/not-found'
import { cleanIdols } from '@/helper/cleanIdols'
import { rarityConfig } from '@/constants'

export default async function CardDetailPage({ params }: { params: { id: string } }) {
    const id = await params.id
    const cardDetails = await GetCardByID(id)

    if (!cardDetails) return NotFound()

    const profile = await getProfile()
    
    const [isOwned, isWishlisted] = await Promise.all([
        profile ? CheckCardOwning(profile.id, id) : Promise.resolve(null),
        profile ? CheckCardWishlisted(profile.id, id) : Promise.resolve(null)
    ])

    const rc = rarityConfig[cardDetails.rarity ?? 'N']

    const idols = cleanIdols(cardDetails.photocards_idol)

    return (
        <div className="flex flex-col gap-8">

            {/* ── TOP BAR ── */}
            <div className="flex items-center justify-between">
                <BackButton label="Back" />
                <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                    <Share2 className="h-4 w-4" />
                    Share
                </button>
            </div>

            {/* ── MAIN GRID ── */}
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

                {/* ── LEFT: CARD IMAGE + FLIP ── */}
                <div className="lg:col-span-5 flex flex-col gap-4">

                    {/* Flip Container */}
                    <FlipImage
                        backImageUrl={cardDetails.back_image_url ?? ''}
                        frontImageUrl={cardDetails.front_image_url ?? ''}
                        name={cardDetails.name}
                    />
                </div>

                {/* ── RIGHT: CARD INFO ── */}
                <div className="lg:col-span-7 flex flex-col gap-6">

                    {/* Rarity + Distribution */}
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-widest border ${rc.badge}`}>
                            {cardDetails.rarity}
                        </span>
                        {cardDetails.distribution_types && (
                            <span className="text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest border bg-white/5 text-white/50 border-white/10">
                                {cardDetails.distribution_types.name}
                            </span>
                        )}
                    </div>

                    {/* Card Name */}
                    <div>
                        <h1 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
                            {cardDetails.name}
                        </h1>
                    </div>

                    {/* Group + Release + Idols */}
                    <div className="flex flex-col gap-3">

                        {/* Group */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16 shrink-0">Group</span>
                            <Link
                                href={`/groups/${cardDetails.groups?.slug}`}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold text-white hover:border-pink-500/50 hover:text-pink-400 transition-all"
                            >
                                <Tag className="h-3.5 w-3.5" />
                                {cardDetails.groups?.name}
                            </Link>
                        </div>

                        {/* Release */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16 shrink-0">Release</span>
                            <Link
                                href={`/releases/${cardDetails.releases?.id}`}
                                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold text-white hover:border-pink-500/50 hover:text-pink-400 transition-all"
                            >
                                <Disc3 className="h-3.5 w-3.5" />
                                {cardDetails.releases?.title}
                            </Link>
                        </div>

                        {/* Idols */}
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider w-16 shrink-0">Idols</span>
                            <div className="flex items-center gap-2 flex-wrap">
                                {idols.map(idol => (
                                    <Link
                                        key={idol.id}
                                        href={`/idols/${idol.slug}`}
                                        className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold text-white hover:border-pink-500/50 hover:text-pink-400 transition-all"
                                    >
                                        <User className="h-3.5 w-3.5" />
                                        {idol.stage_name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-white/5" />

                    {/* ── COLLECTION STATUS ── */}
                    {isOwned ? (
                        <div className="flex flex-col gap-4">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">In Your Collection</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Acquired</span>
                                    </div>
                                    <p className="text-sm font-black text-white">
                                        {isOwned.acquired_at ? new Date(isOwned.acquired_at).toLocaleDateString() : 'No Acquired date set'}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <Tag className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Price</span>
                                    </div>
                                    <p className="text-sm font-black text-white">
                                        {isOwned.acquired_price ? isOwned.acquired_price.toLocaleString() : 'No Acquired price set'} {isOwned.acquired_currency}
                                    </p>
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <ShieldCheck className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Condition</span>
                                    </div>
                                    <p className="text-sm font-black text-white">{isOwned.condition}</p>
                                </div>
                            </div>

                            {/* Notes */}
                            {isOwned.notes && (
                                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                    <div className="flex items-center gap-2 text-gray-500 mb-2">
                                        <StickyNote className="h-3.5 w-3.5" />
                                        <span className="text-[10px] font-bold uppercase">Notes</span>
                                    </div>
                                    <p className="text-sm text-gray-400 leading-relaxed">{isOwned.notes}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        /* ── ADD TO COLLECTION / WISHLIST ── */
                        <div className="flex flex-col gap-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Add to your vault</p>
                            <div className="flex gap-3">
                                <button className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-pink-600 hover:bg-pink-500 py-3.5 text-sm font-black text-white transition-all hover:scale-[1.02] active:scale-95 shadow-lg shadow-pink-900/30">
                                    <Plus className="h-4 w-4" />
                                    Add to Collection
                                </button>
                                <button className={`
                                    flex items-center justify-center gap-2 rounded-2xl border px-5 py-3.5 text-sm font-black transition-all hover:scale-[1.02] active:scale-95
                                    ${isWishlisted
                                        ? 'bg-pink-500/20 border-pink-500/50 text-pink-400'
                                        : 'bg-white/5 border-white/10 text-gray-400 hover:text-pink-400 hover:border-pink-500/30'
                                    }
                                `}>
                                    <Heart className="h-4 w-4" fill={isWishlisted ? 'currentColor' : 'none'} />
                                    {isWishlisted ? 'Wishlisted' : 'Wishlist'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}