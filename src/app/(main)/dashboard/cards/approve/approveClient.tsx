'use client'

import { useState } from 'react'
import { Check, CheckSquare, Square, Trash2, PartyPopper } from 'lucide-react'
import ApproveModal from '@/components/dashboard/approveModal'
import { useToast } from '@/app/providers/toastProvider'
import BackButton from '@/components/UI/backButton'
import BulkRejectModal from '@/components/dashboard/rejectionModal'
import { CardReviewPayload, CardWithDetail } from '@/types'
import { ReviewCard } from '@/actions/card_actions'
import Card from '@/components/cards/cards'

export default function ApproveClient({ initialCards }: { initialCards: CardWithDetail[] }) {
    const { showToast } = useToast()

    const [cardsData, setCardsData] = useState<CardWithDetail[]>(initialCards)
    const [selectedIds, setSelectedIds] = useState<string[]>([])
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
    const [singleModalOpen, setSingleModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CardWithDetail | null>(null)

    // Helpers
    const removeCardsFromUi = (ids: string[]) => {
        setCardsData(prev => prev.filter(c => !ids.includes(c.id)))
        setSelectedIds(prev => prev.filter(id => !ids.includes(id)))
    }

    const pairCards = (ids: string[]): CardReviewPayload[] =>
        ids.map(id => ({
            submissionId: id,
            data: cardsData.find(c => c.id === id)?.data
        }))

    // Selection
    const toggleSelect = (id: string) =>
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])

    const toggleSelectAll = () =>
        setSelectedIds(selectedIds.length === cardsData.length ? [] : cardsData.map(c => c.id))

    // Actions
    const handleApprove = async (id: string) => {
        removeCardsFromUi([id])
        setSingleModalOpen(false)
        showToast('Approved Card', 'success')

        const { error } = await ReviewCard('accepted', pairCards([id]))
        if (error) {
            console.error(error)
            showToast('Failed to save approval', 'error')
        }
    }

    const handleApproveAll = async () => {
        const ids = [...selectedIds]
        removeCardsFromUi(ids)
        showToast(`Approved ${ids.length} Cards`, 'success')

        const { error } = await ReviewCard('accepted', pairCards(ids))
        if (error) {
            console.error(error)
            showToast('Failed to save approval', 'error')
        }
    }

    const handleRejection = async (reasoning: string, singleId?: string) => {
        const ids = singleId ? [singleId] : [...selectedIds]
        removeCardsFromUi(ids)
        setSingleModalOpen(false)
        setIsRejectModalOpen(false)
        showToast('Cards Rejected', 'info')

        const { error } = await ReviewCard('rejected', ids.map(id => ({ submissionId: id })), reasoning)
        if (error) console.error(error)
    }

    const allSelected = selectedIds.length === cardsData.length && cardsData.length > 0

    console.log(cardsData)

    return (
        <div className="flex flex-col gap-8 relative min-h-screen pb-32">
            <div className="relative z-10">
                <BackButton label="SYSTEM RETURN" href="/dashboard/cards" />
            </div>

            {/* Header */}
            <div className="sticky top-4 z-50 rounded-2xl border border-white/10 bg-[#161b22]/40 p-6 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        Approve <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 pr-2">Queue</span>
                    </h1>
                    <p className="text-sm text-gray-400 font-mono mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        {`${cardsData.length} pending submissions`}
                    </p>
                </div>
                <button
                    onClick={toggleSelectAll}
                    disabled={cardsData.length === 0}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-gray-300 transition-colors disabled:opacity-50"
                >
                    {allSelected
                        ? <><CheckSquare className="h-4 w-4 text-purple-400" /> Deselect All</>
                        : <><Square className="h-4 w-4" /> Select All</>
                    }
                </button>
            </div>

            {/* Content */}
            {cardsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                    <div className="h-24 w-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                        <PartyPopper className="h-10 w-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
                    <p className="text-gray-400 max-w-sm">There are no pending cards to review.</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cardsData.map(card => (
                        <Card
                            isHorizontal={card.data.is_horizontal}
                            key={card.id}
                            id={card.id}
                            name={card.data.name}
                            front_image_url={card.data.front_image_url}
                            back_image_url={card.data.back_image_url}
                            rarity={card.data.rarity}
                            group_name={card.data.group_name ?? null}
                            idols={(card.data.idol_names ?? []).map(n => ({ id: n, stage_name: n }))}
                            isSelected={selectedIds.includes(card.id)}
                            onSelect={() => toggleSelect(card.id)}
                            onInspect={() => {
                                setSelectedCard(card)
                                setSingleModalOpen(true)
                            }}
                            submittedBy={card.submitted_by_profile?.username}
                        />
                    ))}
                </div>
            )}

            {/* Bulk Action Bar */}
            <div className={`
                fixed bottom-8 left-1/2 -translate-x-1/2 z-50
                flex items-center gap-3 p-2 pr-4
                rounded-2xl bg-[#0d1117] border border-purple-500/30
                shadow-[0_0_50px_rgba(0,0,0,0.5)]
                transition-all duration-300
                ${selectedIds.length > 0
                    ? 'translate-y-0 opacity-100 scale-100'
                    : 'translate-y-20 opacity-0 scale-95 pointer-events-none'
                }
            `}>
                <div className="bg-purple-500/10 px-4 py-2 rounded-xl text-sm font-bold text-purple-300 min-w-[120px] text-center border border-purple-500/20">
                    {selectedIds.length} Selected
                </div>
                <div className="h-8 w-[1px] bg-white/10 mx-1" />
                <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
                >
                    <Trash2 className="h-4 w-4" /> Reject
                </button>
                <button
                    onClick={handleApproveAll}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 text-black font-bold text-sm hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                    <Check className="h-4 w-4 stroke-[3]" /> Approve Selected
                </button>
            </div>

            {/* Modals */}
            {singleModalOpen && selectedCard && (
                <ApproveModal
                    item={selectedCard}
                    itemLength={cardsData.length}
                    onClose={() => setSingleModalOpen(false)}
                    onApprove={() => handleApprove(selectedCard.id)}
                    onReject={(reason) => handleRejection(reason, selectedCard.id)}
                />
            )}

            <BulkRejectModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                onConfirm={(reason) => handleRejection(reason)}
                count={selectedIds.length}
                isProcessing={false}
            />
        </div>
    )
}