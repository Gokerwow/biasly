import {
    Share2,
    Calendar,
    Tag,
    Disc3,
    User,
    StickyNote,
    ShieldCheck,
    Hash
} from 'lucide-react'
import Link from 'next/link'
import BackButton from '@/components/UI/backButton'
import FlipImage from '@/components/cardsDetails/flipimage'
import { getProfile } from '@/app/lib/userServer'
import { CheckCardOwning, CheckCardWishlisted, getCardByID } from '@/queries/photocards'
import NotFound from '@/app/not-found'
import { rarityConfig } from '@/constants'
import DetailAction from '@/components/cardsDetails/actionbar'

export default async function CardDetailPage({ params }: { params: { id: string } }) {
    const id = await params.id
    const cardDetails = await getCardByID(id)

    if (!cardDetails) return NotFound()

    const profile = await getProfile()

    const [isOwned, isWishlisted] = await Promise.all([
        profile ? CheckCardOwning(profile.id, id) : Promise.resolve(null),
        profile ? CheckCardWishlisted(profile.id, id) : Promise.resolve(null)
    ])

    const rc = rarityConfig[cardDetails.rarity ?? 'N']
    
    return (
        <div className="flex flex-col gap-6">

            {/* ── TOP NAV ── */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <BackButton label="Back to Database" />
                <button className="flex items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-bold text-gray-300 hover:text-white hover:bg-zinc-800 transition-colors border border-white/5">
                    <Share2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Share Asset</span>
                </button>
            </div>

            {/* ── MAIN LAYOUT ── */}
            <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">

                {/* ── LEFT: STICKY CARD DISPLAY (Col 4) ── */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 flex flex-col items-center gap-6">
                    <div className="relative w-full max-w-sm mx-auto">
                        {/* Background glow behind card */}
                        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full -z-10" />
                        <FlipImage
                            backImageUrl={cardDetails.back_image_url ?? ''}
                            frontImageUrl={cardDetails.front_image_url ?? ''}
                            name={cardDetails.name}
                        />
                    </div>

                    {/* Streamlined Community Stats */}
                    <div className="w-full max-w-sm flex justify-center gap-8 px-6 py-4 bg-zinc-900/50 rounded-2xl border border-white/5 text-center">
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Wishlisted By</p>
                            <p className="text-lg text-white font-black">842</p>
                        </div>
                        <div className="w-px bg-white/10" />
                        <div>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Owned By</p>
                            <p className="text-lg text-white font-black">156</p>
                        </div>
                    </div>
                </div>

                {/* ── RIGHT: DATA & ACTIONS (Col 8) ── */}
                <div className="lg:col-span-8 flex flex-col gap-6">

                    {/* MODULE 1: CORE IDENTITY & ROSTER */}
                    <div className="flex flex-col bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/5">
                        
                        {/* 1A. Title & Origin */}
                        <div className="flex flex-col gap-3 mb-6">
                            <h1 className="text-4xl sm:text-5xl font-black text-white uppercase tracking-tight leading-none">
                                {cardDetails.name}
                            </h1>
                            <div className="flex flex-wrap items-center gap-3 text-gray-400">
                                <Link href={`/groups/${cardDetails.group?.slug}`} className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                                    <Tag className="h-4 w-4" /> <span className="font-bold text-sm">{cardDetails.group?.name ?? 'Unknown Group'}</span>
                                </Link>
                                <span className="text-white/20">•</span>
                                <Link href={`/releases/${cardDetails.releases?.id}`} className="flex items-center gap-1.5 hover:text-pink-400 transition-colors">
                                    <Disc3 className="h-4 w-4" /> <span className="font-bold text-sm">{cardDetails.releases?.title ?? 'Unknown Release'}</span>
                                </Link>
                            </div>
                        </div>

                        {/* 1B. Featured Idols (Scalable Flex Wrap) */}
                        <div className="flex flex-col gap-2.5 mb-8">
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                Featured Idols
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {cardDetails.idols?.map((item) => (
                                    <Link 
                                        key={item.id} 
                                        href={`/idols/${item.slug}`} 
                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all group"
                                    >
                                        <User className="h-3.5 w-3.5 text-gray-500 group-hover:text-pink-400" />
                                        <span className="text-sm font-bold text-gray-300 group-hover:text-white">
                                            {item.stage_name}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* 1C. The "Archive Ledger" (Card Physical Specs) */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-white/10 pt-6">
                            {/* Rarity */}
                            <div className={`flex flex-col gap-1.5 border-l-2 ${rc?.label || 'border-pink-500'} pl-4`}>
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    Classification
                                </span>
                                {/* Assuming rc is defined above as: const rc = rarityConfig[cardDetails.rarity ?? 'N'] */}
                                <span className={`text-lg font-black uppercase tracking-widest ${rc?.label || 'text-white'}`}>
                                    {cardDetails.rarity}
                                </span>
                            </div>

                            {/* Format */}
                            <div className="flex flex-col gap-1.5 border-l-2 border-pink-500 pl-4">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    Format
                                </span>
                                <span className="text-sm font-bold text-gray-200 leading-tight">
                                    {cardDetails.distribution_type?.name ?? 'Standard'}
                                </span>
                            </div>

                            {/* Finish/Modifiers */}
                            <div className="flex flex-col gap-1.5 border-l-2 border-pink-500 pl-4">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                    Finish / Traits
                                </span>
                                <span className="text-sm font-bold text-gray-200 leading-tight">
                                    {cardDetails.physical_types_global && cardDetails.physical_types_global.length > 0
                                        ? cardDetails.physical_types_global.map(m => m.name).join(', ')
                                        : 'Standard Finish'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* MODULE 2: COLLECTION STATUS */}
                    <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-3xl border border-white/5">
                        {isOwned ? (
                            <div className="flex flex-col gap-5">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs font-black text-pink-500 uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="h-4 w-4" /> Status: Secured in Binder
                                    </p>
                                    <span className="text-[10px] font-bold bg-pink-500/10 text-pink-400 px-2 py-1 rounded">
                                        Acq. ID: <Hash className="inline h-3 w-3" />{isOwned.id.split('-')[0]}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <Calendar className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold uppercase">Acquired</span>
                                        </div>
                                        <p className="text-sm font-black text-white">
                                            {isOwned.acquired_at ? new Date(isOwned.acquired_at).toLocaleDateString() : 'Unknown'}
                                        </p>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <Tag className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold uppercase">Investment</span>
                                        </div>
                                        <p className="text-sm font-black text-white">
                                            {isOwned.acquired_price ? `${isOwned.acquired_price.toLocaleString()} ${isOwned.acquired_currency}` : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5">
                                        <div className="flex items-center gap-2 text-gray-500 mb-1">
                                            <ShieldCheck className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold uppercase">Condition</span>
                                        </div>
                                        <p className="text-sm font-black text-white">{isOwned.condition || 'Mint'}</p>
                                    </div>
                                </div>

                                {isOwned.notes && (
                                    <div className="bg-black/20 rounded-xl p-4 border border-white/5 mt-2">
                                        <div className="flex items-center gap-2 text-gray-500 mb-2">
                                            <StickyNote className="h-3.5 w-3.5" />
                                            <span className="text-[10px] font-bold uppercase">Field Notes</span>
                                        </div>
                                        <p className="text-sm text-gray-300">&quot;{isOwned.notes}&quot;</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">Acquisition Actions</h3>
                                <DetailAction
                                    isWishlisted={!!isWishlisted}
                                    isCollected={!!isOwned}
                                    userID={profile?.id ?? ''}
                                    cardID={id}
                                />
                            </div>
                        )}
                    </div>

                    {/* MODULE 3: SYSTEM RECORD (Fills the bottom whitespace) */}
                    {/* Make sure to import { Database } from 'lucide-react' at the top of your file! */}
                    <div className="bg-zinc-900/40 p-5 rounded-3xl border border-white/5 flex flex-col gap-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Asset System ID</span>
                                <span className="text-gray-400 font-mono text-xs">{cardDetails.id}</span>
                            </div>
                            <div>
                                <span className="text-gray-500 block text-[10px] uppercase font-bold tracking-wider mb-0.5">Indexed On</span>
                                <span className="text-gray-400 text-xs">
                                    {cardDetails.created_at ? new Date(cardDetails.created_at).toLocaleDateString() : 'System Default'}
                                </span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}