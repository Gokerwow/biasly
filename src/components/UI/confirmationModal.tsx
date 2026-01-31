'use client'

import { AlertTriangle, X, CheckCircle2 } from "lucide-react"
import { useEffect, useState } from "react"
import { createPortal } from "react-dom"

interface ConfirmationModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    isLoading?: boolean
    variant?: 'danger' | 'success' | 'warning' // Default is generic/pink
}

export default function ConfirmationModal({ 
    isOpen, 
    onClose, 
    onConfirm, 
    title, 
    description, 
    isLoading = false,
    variant = 'warning' 
}: ConfirmationModalProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Handle client-side mounting
    useEffect(() => {
        setMounted(true)
        return () => setMounted(false)
    }, [])

    // Handle smooth unmounting animation
    useEffect(() => {
        if (isOpen) setIsVisible(true)
        else setTimeout(() => setIsVisible(false), 200)
    }, [isOpen])

    // Don't render until mounted (prevents SSR issues)
    if (!mounted || !isVisible) return null

    // Theme Config based on Variant
    const theme = {
        danger: {
            icon: <AlertTriangle className="h-6 w-6" />,
            iconBg: "bg-red-500/10 text-red-500",
            button: "bg-red-600 hover:bg-red-500 shadow-red-500/20",
            border: "focus:ring-red-500/20"
        },
        success: {
            icon: <CheckCircle2 className="h-6 w-6" />,
            iconBg: "bg-green-500/10 text-green-500",
            button: "bg-green-600 hover:bg-green-500 shadow-green-500/20",
            border: "focus:ring-green-500/20"
        },
        warning: { // Default (Pink/Brand)
            icon: <AlertTriangle className="h-6 w-6" />,
            iconBg: "bg-pink-500/10 text-pink-500",
            button: "bg-gradient-to-r from-pink-600 to-pink-500 hover:scale-105 shadow-pink-500/20",
            border: "focus:ring-pink-500/20"
        }
    }[variant]

    const modalContent = (
        // ✅ FIXED: z-[9999] ensures it's above EVERYTHING
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={onClose} // Click backdrop to close
        >
            {/* Modal Container */}
            <div 
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
                className={`w-full max-w-md transform overflow-hidden rounded-2xl border border-white/10 bg-[#161B22] p-6 text-left shadow-2xl transition-all duration-200 ease-out
                ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                
                {/* Close Button (Top Right) */}
                <button 
                    onClick={onClose} 
                    disabled={isLoading}
                    className="absolute right-4 top-4 rounded-lg p-1 text-gray-500 transition-colors hover:bg-white/5 hover:text-white z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
                    {/* Icon Wrapper */}
                    <div className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/5 sm:mx-0 ${theme.iconBg}`}>
                        {theme.icon}
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-black uppercase italic tracking-tight text-white">
                        {title}
                    </h3>
                    <div className="mt-2">
                        <p className="text-sm font-medium leading-relaxed text-gray-400">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-gray-300 transition-all hover:bg-white/10 hover:text-white disabled:opacity-50 sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={isLoading}
                        className={`inline-flex w-full items-center justify-center rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed sm:w-auto ${theme.button}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></div>
                                <span>Processing...</span>
                            </div>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )

    // ✅ RENDER USING PORTAL - escapes parent DOM hierarchy!
    return createPortal(modalContent, document.body)
}