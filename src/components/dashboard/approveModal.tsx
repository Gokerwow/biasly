/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { Check, X, Edit2 } from 'lucide-react'
import PrevCard from '../cards/prevCards'
import { CardWithDetail } from '@/app/(main)/dashboard/cards/approve/page'

// ⚠️ Keeps strict props signature as requested
export default function ApproveModal({ item, itemLength, onClose, onApprove, onReject }: { item: CardWithDetail | null, itemLength: number | null, onClose: () => void, onApprove: (id: string) => void, onReject: (id: string, reasoning: string) => void }) {
    const [isRejecting, setIsRejecting] = useState(false)
    const [reasoning, setReasoning] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setReasoning(e.target.value)
    }

    // Safety: If no item is selected, don't render the modal at all
    if (!item) return null

    return (
        // 1. MODAL OVERLAY
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-fade-in">
            
            {/* 2. MODAL CONTAINER */}
            <div className="relative w-full max-w-6xl max-h-[90vh] bg-[#0d1117] rounded-3xl border border-white/10 shadow-2xl flex flex-col overflow-hidden">
                
                {/* 3. MODAL HEADER */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-white/5 bg-[#161b22]/50">
                    <div>
                        <h2 className="text-xl font-black text-white uppercase italic tracking-tight flex items-center gap-3">
                            Approval <span className="text-purple-400">Queue</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/5 text-gray-400 not-italic border border-white/5">
                                {itemLength} Remaining
                            </span>
                        </h2>
                    </div>

                    <button onClick={onClose} className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center transition-colors">
                        <X className="h-4 w-4 text-white" />
                    </button>
                </div>

                {/* 4. MODAL BODY */}
                <div className="flex-1 overflow-hidden">
                    <div className="h-full grid grid-cols-1 lg:grid-cols-12">
                        
                        {/* LEFT: IMAGE PREVIEW */}
                        <div className="lg:col-span-7 relative flex items-center justify-center bg-black/40 p-8 overflow-hidden">
                            <div 
                                className="absolute inset-0 opacity-50 blur-xl bg-center bg-cover scale-150 pointer-events-none" 
                                style={{ backgroundImage: `url(${item.image_url})` }}
                            ></div>
                            
                            <div className="relative z-10 w-1/2">
                                <PrevCard card={item} />
                            </div>
                        </div>

                        {/* RIGHT: METADATA FORM */}
                        <div className="lg:col-span-5 flex flex-col bg-[#161b22] border-l border-white/5 h-full overflow-y-auto custom-scrollbar">
                            <div className="p-6 flex flex-col gap-6">
                                
                                {/* User Info Block */}
                                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
                                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-sm">
                                        {item.profiles?.username?.[0]?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] uppercase font-bold text-gray-500">Submitted by</p>
                                        <p className="text-sm font-bold text-white truncate">@{item.profiles?.username || 'Unknown'}</p>
                                    </div>
                                    <div className="text-[10px] font-mono text-gray-500 bg-black/30 px-2 py-1 rounded border border-white/5">
                                        {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                                            <Edit2 className="h-3 w-3 text-purple-400" /> Metadata
                                        </h3>
                                    </div>

                                    <div className="space-y-4">
                                        <Field label="Card Name" value={item.name} />
                                        
                                        <div className="grid grid-cols-2 gap-3">
                                            { item.subject_category === 'Solo' ? 
                                                <Field label="Idol" value={item.idols?.stage_name} /> :
                                                <Field label="Units" value={item.unit_names?.map((unit: any) => unit?.name).join(", ")} />
                                            }
                                            <Field label="Group" value={item.releases?.groups?.name} /> 
                                        </div>
                                        
                                        {/* Added Release Field Here */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Release / Era" value={item.releases?.title} />
                                            <Field label="Type" value={item.subject_category} />
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <Field label="Rarity" value={item.rarity} badge />
                                            {/* Empty placeholder to keep grid aligned if needed, or add another field */}
                                            <div className="hidden lg:block"></div> 
                                        </div>
                                    </div>
                                </div>

                                {/* Rejection Logic */}
                                {isRejecting && (
                                    <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/20 animate-in slide-in-from-top-2 fade-in">
                                        <label className="text-xs font-bold text-red-400 mb-2 block uppercase">Reason for Rejection</label>
                                        <textarea 
                                            className="w-full bg-black/40 border border-red-500/30 rounded-lg p-3 text-sm text-white placeholder-red-500/30 focus:outline-none focus:border-red-500 resize-none"
                                            rows={3}
                                            placeholder="Why is this card being rejected?"
                                            onChange={(e) => handleChange(e)}
                                            value={reasoning}
                                        ></textarea>
                                        <div className="flex justify-end gap-2 mt-3">
                                            <button 
                                                onClick={() => setIsRejecting(false)}
                                                className="px-4 py-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button  onClick={() => onReject(item.id, reasoning)} className="px-4 py-2 rounded-lg bg-red-600 text-xs font-bold text-white hover:bg-red-500 shadow-lg shadow-red-900/20">
                                                Confirm Reject
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sticky Footer Actions */}
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
                                                onClick={() => onApprove(item.id)}
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

function Field({ label, value, badge }: any) {
    return (
        <div className="group">
            <label className="text-[10px] uppercase font-bold text-gray-500 mb-1.5 block group-focus-within:text-purple-400 transition-colors">{label}</label>
            {badge ? (
                <span className="inline-flex items-center px-3 py-2 rounded-lg bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20">
                    {value || 'N/A'}
                </span>
            ) : (
                <input 
                    type="text" 
                    defaultValue={value || ''} 
                    className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white font-medium focus:border-purple-500/50 focus:bg-purple-500/5 focus:outline-none transition-all placeholder:text-gray-700"
                />
            )}
        </div>
    )
}