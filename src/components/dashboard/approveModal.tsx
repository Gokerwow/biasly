'use client'

import React, { useState } from 'react'
import { Check, X, Edit2 } from 'lucide-react'
import { CardWithDetail } from '@/types'
import CardItem from '../cards/cards'
import { getOptimizedImageUrl } from '@/helper/cloudinary'
import { CapitalizeFirstletter } from '@/helper/parseString'

interface ApproveModalProps {
    item: CardWithDetail | null
    itemLength: number | null
    onClose: () => void
    onApprove: () => void
    onReject: (reasoning: string) => void
}

export default function ApproveModal({ item, itemLength, onClose, onApprove, onReject }: ApproveModalProps) {
    const [isRejecting, setIsRejecting] = useState(false)
    const [reasoning, setReasoning] = useState('')

    if (!item) return null

    const cardData = item.data
    console.log(cardData)
    const profile = item.submitted_by_profile

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#0d1117] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#161b22]/50">
                    <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                        Approval <span className="text-purple-400">Queue</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-400 not-italic border border-white/5">
                            {itemLength} Remaining
                        </span>
                    </h2>
                    <button
                        onClick={onClose}
                        className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors"
                    >
                        <X className="h-4 w-4 text-white" />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12">

                        {/* Left — Card Preview */}
                        <div className="lg:col-span-7 relative flex items-center justify-center bg-black/40 p-8 overflow-hidden">
                            <div
                                className="absolute inset-0 opacity-50 blur-xl bg-center bg-cover scale-150 pointer-events-none"
                                style={{ backgroundImage: `url(${getOptimizedImageUrl(cardData.front_image_url, {
                                    gravity: 'face',
                                    crop: 'fill'
                                })})` }}
                            />
                            <div className="relative z-10 w-70">
                                <CardItem
                                    isDoubleSided={cardData.is_double_sided}
                                    isHorizontal={cardData.is_horizontal}
                                    id={item.id}
                                    name={cardData.name}
                                    front_image_url={cardData.front_image_url}
                                    back_image_url={cardData.back_image_url}
                                    rarity={cardData.rarity}
                                    group_name={cardData.group_name ?? null}
                                    release_title={null}
                                    distribution_type={null}
                                    physical_types={cardData.modifier_names?.map(m => ({ name: m }))}
                                    idols={(cardData.idol_names ?? []).map(name => ({ stage_name: name }))}
                                    type="collection"
                                />
                            </div>
                        </div>

                        {/* Right — Metadata */}
                        <div className="lg:col-span-5 flex flex-col bg-[#161b22] border-l border-white/5 h-full overflow-y-auto custom-scrollbar">
                            <div className="p-6 flex flex-col gap-6">

                                {/* Submitter Info */}
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm shrink-0">
                                        {profile?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] uppercase font-bold text-gray-500">Submitted by</p>
                                        <p className="text-sm font-bold text-white truncate">@{profile?.username || 'Unknown'}</p>
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-1 rounded border border-white/5 shrink-0">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Metadata Fields */}
                                <div className="space-y-4">
                                    <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                                        <Edit2 className="h-3 w-3 text-purple-400" /> Metadata
                                    </h3>

                                    <Field label="Card Name" value={cardData.name} />

                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Group" value={cardData.group_name} />
                                        <Field label="Subject Type" value={CapitalizeFirstletter(cardData.subject_type)} />
                                    </div>
                                    
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Physical Types" value={cardData.modifier_names?.join(', ') || '—'} />
                                        <Field label="Distribution Type" value={cardData.distribution_name} />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <Field
                                            label={cardData.subject_type === 'solo' ? 'Idol' : 'Members'}
                                            value={cardData.idol_names?.join(', ') || '—'}
                                        />
                                        <Field label="Rarity" value={cardData.rarity} badge />
                                    </div>
                                    
                                </div>

                                {/* Rejection Form */}
                                {isRejecting && (
                                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 animate-in slide-in-from-top-2 fade-in">
                                        <label className="text-xs font-bold text-red-400 mb-2 block uppercase">
                                            Reason for Rejection
                                        </label>
                                        <textarea
                                            className="w-full bg-black/40 border border-red-500/30 rounded-lg p-3 text-sm text-white placeholder-red-500/30 focus:outline-none focus:border-red-500 resize-none"
                                            rows={3}
                                            placeholder="Why is this card being rejected?"
                                            value={reasoning}
                                            onChange={(e) => setReasoning(e.target.value)}
                                        />
                                        <div className="flex justify-end gap-2 mt-3">
                                            <button
                                                onClick={() => setIsRejecting(false)}
                                                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => onReject(reasoning)}
                                                className="px-4 py-2 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-500 shadow-lg shadow-red-900/20"
                                            >
                                                Confirm Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sticky Footer */}
                            <div className="mt-auto p-6 border-t border-white/5 bg-[#161b22] sticky bottom-0 z-20">
                                <div className="grid grid-cols-2 gap-4">
                                    {!isRejecting ? (
                                        <>
                                            <button
                                                onClick={() => setIsRejecting(true)}
                                                className="h-12 rounded-xl border border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 font-bold flex items-center justify-center gap-2 transition-all"
                                            >
                                                <X className="h-4 w-4" /> Reject
                                            </button>
                                            <button
                                                onClick={onApprove}
                                                className="h-12 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-black font-bold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] shadow-[0_0_20px_rgba(34,197,94,0.2)]"
                                            >
                                                <Check className="h-4 w-4" /> Approve
                                            </button>
                                        </>
                                    ) : (
                                        <div className="col-span-2 flex items-center justify-center text-xs text-gray-500 font-mono">
                                            Awaiting decision...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface FieldProps {
    label: string
    value: string | null | undefined
    badge?: boolean
}

function Field({ label, value, badge }: FieldProps) {
    return (
        <div className="group">
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 block transition-colors group-focus-within:text-purple-400">
                {label}
            </label>
            {badge ? (
                <span className="inline-flex items-center px-3 py-2 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                    {value || 'N/A'}
                </span>
            ) : (
                <input
                    title='Input Field'
                    type="text"
                    defaultValue={value || ''}
                    readOnly
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-medium focus:border-purple-500/50 focus:bg-purple-500/5 focus:outline-none transition-all"
                />
            )}
        </div>
    )
}