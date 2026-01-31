'use client'

import { useState, useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';
import SearchableSelect from '../UI/searchableSelect';

interface BulkRejectModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string) => void;
    count: number;
    isProcessing: boolean;
}

const QUICK_REASONS = [
    "Image quality is too low / blurry",
    "Duplicate entry",
    "Incorrect Idol/Group info",
    "Watermark or copyright issue",
    "Not a photocard (Fanart/Merch)",
    "Other"
];

export default function BulkRejectModal({
    isOpen,
    onClose,
    onConfirm,
    count,
    isProcessing
}: BulkRejectModalProps) {
    const [category, setCategory] = useState("");
    const [details, setDetails] = useState("");

    useEffect(() => {
        if (isOpen) {
            setCategory("");
            setDetails("");
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleConfirm = () => {
        let finalReason = "";
        if (category === "Other") {
            finalReason = details;
        } else {
            finalReason = details ? `${category}: ${details}` : category;
        }
        if (!finalReason) return;
        onConfirm(finalReason);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            {/* 1. SIZE CHANGE: 'max-w-md' -> 'max-w-2xl' 
                2. ADDED: 'w-full' to ensure it stretches on mobile
            */}
            <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-[#161b22] border border-red-500/30 shadow-2xl flex flex-col">

                {/* Header */}
                <div className="bg-red-500/10 px-8 py-6 border-b border-red-500/20 flex items-center gap-4">
                    <div className="p-3 bg-red-500/20 rounded-full text-red-400 shrink-0">
                        <AlertOctagon size={32} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-white tracking-tight">Reject {count} Items?</h3>
                        <p className="text-sm text-red-400 font-mono uppercase tracking-wider mt-1">
                            ⚠️ This action cannot be undone
                        </p>
                    </div>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">
                    <p className="text-base text-gray-300 leading-relaxed">
                        You are about to reject <strong>{count}</strong> submissions. Please provide a clear reason so the users can fix their mistakes.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-1 gap-8">
                        {/* 1. Category Selector */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reason Category</label>
                            <SearchableSelect
                                label='Category'
                                name="category"
                                placeholder="Select a category..."
                                items={QUICK_REASONS.map(r => ({ id: r, name: r }))}
                                onSelect={(item) => setCategory(item.name)}
                            />
                        </div>

                        {/* 2. Helper Text (Visual filler for the grid) */}
                        <div className="hidden md:block p-4 rounded-lg bg-white/5 border border-white/5 text-xs text-gray-400 leading-relaxed">
                            <strong className="text-gray-300 block mb-1">💡 Tip:</strong>
                            Being specific helps users learn. If it&apos;s a blurry image, mention &quot;Please scan at 300DPI&quot; in the details.
                        </div>
                    </div>

                    {/* 3. Details Box */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                            Additional Details {category !== "Other" && <span className="text-gray-600 font-normal normal-case">(Optional)</span>}
                        </label>
                        <textarea
                            value={details}
                            onChange={(e) => setDetails(e.target.value)}
                            placeholder={category === "Other" ? "Please explain why..." : "Add specific notes (optional)..."}
                            // SIZE CHANGE: Increased height h-32 -> h-40
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-xl p-4 text-base text-white resize-none focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-gray-600"
                        />
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-black/20 px-8 py-6 flex justify-end gap-4 border-t border-white/5">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 rounded-xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing || !category || (category === "Other" && !details)}
                        className="px-8 py-3 rounded-xl text-sm font-bold bg-red-600 text-white hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_30px_rgba(220,38,38,0.3)] hover:shadow-[0_0_40px_rgba(220,38,38,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        {isProcessing ? 'Rejecting...' : 'Confirm Rejection'}
                    </button>
                </div>
            </div>
        </div>
    );
}