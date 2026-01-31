'use client'

import { useEffect, useState } from 'react'
import { Check, CheckSquare, Square, Trash2, PartyPopper } from 'lucide-react'
import PrevCard from '@/components/cards/prevCards'
// Ensure this imports the skeleton component we made earlier
import ApproveModal from '@/components/dashboard/approveModal';
import { createClient } from '@/utils/supabase/client';
import { Tables } from '@/types/supabase';
import { useToast } from '@/app/providers/toastProvider';
import BackButton from '@/components/UI/backButton';
import BulkRejectModal from '@/components/dashboard/rejectionModal';
import { PrevCardSkeleton } from '@/components/cards/cardSkeleton';

// Define the type clearly
export type CardWithDetail = Tables<'photocards'> & {
    idols: { id: string, stage_name: string | null } | null
    releases: { id: string, title: string | null, groups: { id: string, name: string | null } | null } | null
    profiles: { id: string, email: string | null, username: string | null, avatar_url: string | null } | null
}

export default function BulkApprovePage() {
    const supabase = createClient()
    const { showToast } = useToast()

    // UI States
    const [isLoading, setIsLoading] = useState(true)
    const [cardsData, setCardsData] = useState<CardWithDetail[]>([])

    // Selection States
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // Modal States
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [singleModalOpen, setSingleModalOpen] = useState(false)
    const [selectedCard, setSelectedCard] = useState<CardWithDetail | null>(null)

    // 1. Fetch Data Once
    useEffect(() => {
        const fetchCards = async () => {
            setIsLoading(true)
            try {
                const { data, error } = await supabase
                    .from('photocards')
                    .select('*, idols(id, stage_name), releases(id, title, groups(id, name)), profiles(id, email, username, avatar_url)')
                    .eq('status', 'pending')
                    .order('created_at', { ascending: false })

                if (error) throw error
                setCardsData(data || [])
            } catch (error) {
                console.error('Error fetching cards:', error)
                showToast("Failed to load queue", 'error')
            } finally {
                setIsLoading(false)
            }
        }
        fetchCards()
    }, [])

    // 2. Optimistic Helper (Removes items instantly from UI)
    const removeCardsFromUi = (idsToRemove: string[]) => {
        setCardsData(prev => prev.filter(card => !idsToRemove.includes(card.id)));
        setSelectedIds(prev => prev.filter(id => !idsToRemove.includes(id)));
    }

    // --- Selection Logic ---
    const toggleSelect = (id: string) => {
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
    }

    const toggleSelectAll = () => {
        setSelectedIds(selectedIds.length === cardsData.length ? [] : cardsData.map(c => c.id))
    }

    const handleCardInspect = (item: CardWithDetail) => {
        setSelectedCard(item)
        setSingleModalOpen(true)
    }

    // --- Actions ---

    const handleApprove = async (id: string) => {
        // Optimistic Update
        removeCardsFromUi([id]);
        setSingleModalOpen(false);
        showToast('Approved Card', 'success');

        // Background API Call
        const { error } = await supabase.from('photocards').update({ status: 'accepted' }).eq('id', id);
        if (error) {
            // Optional: Revert UI if needed, but rarely happens
            console.error(error);
            showToast('Failed to save approval', 'error');
        }
    }

    const handleApproveAll = async () => {
        const idsToProcess = [...selectedIds]; // Copy IDs

        // Optimistic Update
        removeCardsFromUi(idsToProcess);
        showToast(`Approved ${idsToProcess.length} Cards`, 'success');

        // Background API Call
        const { error } = await supabase.from('photocards').update({ status: 'accepted' }).in('id', idsToProcess);
        if (error) console.error(error);
    }

    const handleRejection = async (reasoning: string, singleId?: string) => {
        // Determine which IDs to reject (Single or Bulk)
        const idsToReject = singleId ? [singleId] : [...selectedIds];

        // Optimistic Update
        removeCardsFromUi(idsToReject);
        setSingleModalOpen(false);
        setIsRejectModalOpen(false);
        showToast('Cards Rejected', 'info');

        // Background API Call
        const { error } = await supabase
            .from('photocards')
            .update({ status: 'rejected', rejected_reason: reasoning }) // Note: check if column is 'rejected_reason' or 'rejection_reason'
            .in('id', idsToReject);

        if (error) console.error(error);
    }

    return (
        <div className="flex flex-col gap-8 relative min-h-screen pb-32">

            <div className="relative z-10">
                <BackButton label="SYSTEM RETURN" href="/dashboard/cards" />
            </div>

            <div className="sticky top-4 z-50 rounded-2xl border border-white/10 bg-[#161b22]/40 p-6 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                        Approve <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 pr-2">Queue</span>
                    </h1>
                    <p className="text-sm text-gray-400 font-mono mt-1 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        {isLoading ? 'Scanning database...' : `${cardsData.length} pending submissions`}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={toggleSelectAll}
                        disabled={isLoading || cardsData.length === 0}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-bold text-gray-300 transition-colors disabled:opacity-50"
                    >
                        {selectedIds.length > 0 && selectedIds.length === cardsData.length ? (
                            <><CheckSquare className="h-4 w-4 text-purple-400" /> Deselect All</>
                        ) : (
                            <><Square className="h-4 w-4" /> Select All</>
                        )}
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {[...Array(10)].map((_, i) => <PrevCardSkeleton key={i} />)}
                </div>
            ) : cardsData.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in zoom-in duration-500">
                    <div className="h-24 w-24 bg-gradient-to-tr from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center mb-6">
                        <PartyPopper className="h-10 w-10 text-purple-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">All Caught Up!</h2>
                    <p className="text-gray-400 max-w-sm">
                        There are no pending cards to review. Great job clearing the queue.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {cardsData.map((card) => (
                        <PrevCard
                            key={card.id}
                            card={card}
                            onClick={() => toggleSelect(card.id)}
                            isSelected={selectedIds.includes(card.id)}
                            submitted_by={card.submitted_by}
                            onInspect={(item) => handleCardInspect(item)}
                        />
                    ))}
                </div>
            )}

            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 pr-4 rounded-2xl bg-[#0d1117] border border-purple-500/30 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 transform z-50 ${selectedIds.length > 0 ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95 pointer-events-none'
                }`}>
                <div className="bg-purple-500/10 px-4 py-2 rounded-xl text-sm font-bold text-purple-300 min-w-[120px] text-center border border-purple-500/20">
                    {selectedIds.length} Selected
                </div>

                <div className="h-8 w-[1px] bg-white/10 mx-1"></div>

                <button
                    onClick={() => setIsRejectModalOpen(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-400 font-bold text-sm hover:bg-red-600 hover:text-white transition-all"
                >
                    <Trash2 className="h-4 w-4" />
                    Reject
                </button>

                <button
                    onClick={handleApproveAll}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-500 text-black font-bold text-sm hover:bg-green-400 hover:scale-105 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                    <Check className="h-4 w-4 stroke-[3]" />
                    Approve Selected
                </button>
            </div>

            {singleModalOpen && selectedCard && (
                <ApproveModal
                    item={selectedCard}
                    itemLength={cardsData.length}
                    onClose={() => setSingleModalOpen(false)}
                    onApprove={() => handleApprove(selectedCard.id)}
                    // FIXED: Passed logic correctly. ID first, then reason.
                    onReject={(reason) => handleRejection(reason, selectedCard.id)}
                />
            )}

            <BulkRejectModal
                isOpen={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                // FIXED: Passed logic correctly. Just reason.
                onConfirm={(reason) => handleRejection(reason)}
                count={selectedIds.length}
                isProcessing={false}
            />
        </div>
    )
}