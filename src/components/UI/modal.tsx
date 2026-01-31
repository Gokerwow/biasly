'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { ReactNode } from 'react'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: ReactNode
}

export const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    
                    {/* 1. Backdrop (The dark blurry background) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose} // Clicking outside closes the modal
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* 2. The Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        className="relative w-full max-w-md overflow-hidden rounded-[2rem] border border-gray-800 bg-[#161B22] p-8 shadow-2xl"
                    >
                        {/* Header Section */}
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-black italic text-white uppercase tracking-tighter">
                                {title || 'Notification'}
                            </h2>
                            <button
                                onClick={onClose}
                                className="rounded-full p-2 text-gray-500 hover:bg-white/5 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Content Section (Where your form/text goes) */}
                        <div className="text-gray-300">
                            {children}
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    )
}