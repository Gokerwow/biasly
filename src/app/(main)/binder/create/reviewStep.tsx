'use client'

import { motion } from 'framer-motion'
import { Globe, Lock, Palette, Sparkles, Book } from 'lucide-react'
import Image from 'next/image'
import { Binder } from '@/types'
import { COLOR_THEMES } from '@/constants'

export const dynamic = 'force-dynamic'

interface FinalReviewStepProps {
    binderData: Binder
}

export default function FinalReviewStep({ binderData }: FinalReviewStepProps) {
    const selectedTheme = COLOR_THEMES.find(theme => theme.id === binderData.theme_color) || COLOR_THEMES[0]

    return (
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center w-full">
            
            {/* --- LEFT: THE 3D BINDER DISPLAY --- */}
            <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-1">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md relative"
                >
                    {/* Background Ambient Glow */}
                    <div className={`absolute -inset-10 bg-gradient-to-br ${selectedTheme.gradient} to-transparent rounded-full blur-[100px] opacity-20`} />

                    <div className="relative aspect-[3/4] w-full">
                        {/* Shadow */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black rounded-[3rem] blur-2xl opacity-60 scale-105" />

                        {/* Binder Body (Exact same as Config Step) */}
                        <div className="relative h-full rounded-[2.5rem] overflow-hidden border-2 border-gray-800 bg-[#0B0E11] shadow-2xl">
                            {/* Cover Image */}
                            <div className="absolute inset-0">
                                {binderData.cover_url ? (
                                    <Image
                                        src={binderData.cover_url}
                                        alt="Binder Cover"
                                        fill
                                        className="object-cover opacity-40"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                                )}
                            </div>

                            {/* Theme Overlay */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-t ${selectedTheme.gradient} via-black/60 to-transparent opacity-80`}
                                style={{
                                    background: `linear-gradient(to top, ${selectedTheme.color}80, rgba(0,0,0,0.6) 50%, transparent)`
                                }}
                            />

                            {/* Ring Holes */}
                            <div className="absolute left-0 top-0 h-full w-6 bg-gradient-to-r from-black/60 to-transparent backdrop-blur-[2px] border-r border-white/10">
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-black/80 border border-white/20 shadow-inner"
                                        style={{ top: `${15 + i * 14}%` }}
                                    />
                                ))}
                            </div>

                            {/* Content */}
                            <div className="absolute inset-0 flex flex-col justify-between p-8 z-10">
                                <div className="flex justify-end">
                                    {binderData.is_public ? (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30">
                                            <Globe className="h-3 w-3 text-emerald-400" />
                                            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">
                                                Public
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-900/80 backdrop-blur-md border border-gray-700">
                                            <Lock className="h-3 w-3 text-gray-400" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">
                                                Private
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <div className="mb-3">
                                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20">
                                            <Sparkles className="h-3 w-3 text-white" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                {selectedTheme.name}
                                            </span>
                                        </div>
                                    </div>
                                    <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-3 drop-shadow-lg">
                                        {binderData.name || 'My Collection'}
                                    </h2>
                                    {binderData.description && (
                                        <p className="text-xs md:text-sm text-gray-300 leading-relaxed line-clamp-3 drop-shadow-md">
                                            {binderData.description}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Spine Highlight */}
                            <div className="absolute right-0 top-0 h-full w-1 bg-gradient-to-b from-white/20 via-white/5 to-transparent" />
                        </div>

                        {/* 3D Edge */}
                        <div className="absolute right-0 top-4 bottom-4 w-3 bg-gradient-to-l from-black/40 to-transparent rounded-r-3xl -mr-3 -z-10" />
                    </div>
                </motion.div>
            </div>

            {/* --- RIGHT: LAUNCH TERMINAL --- */}
            <div className="w-full lg:w-1/2 flex flex-col order-1 lg:order-2">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tighter italic leading-none">
                        Ready for Launch
                    </h2>
                    <p className="text-gray-400 text-base mb-10">
                        Your binder is fully configured. Review the final specifications below before we initialize the database.
                    </p>

                    {/* Pre-Flight Specs List */}
                    <div className="space-y-6 mb-10 p-6 rounded-2xl bg-gray-900/40 border border-gray-800">
                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-gray-800 border border-gray-700">
                                <Book className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Architecture</p>
                                <p className="text-sm font-bold text-white">
                                    {binderData.origin_template_id ? 'Official Tracker Template' : 'Custom Blank Canvas'}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-gray-800 border border-gray-700">
                                <Palette className="h-5 w-5 text-gray-400" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Color Profile</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${selectedTheme.gradient} shadow-sm`} />
                                    <p className="text-sm font-bold text-white">{selectedTheme.name}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="p-2.5 rounded-xl bg-gray-800 border border-gray-700">
                                {binderData.is_public ? <Globe className="h-5 w-5 text-gray-400" /> : <Lock className="h-5 w-5 text-gray-400" />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Network Visibility</p>
                                <p className={`text-sm font-bold ${binderData.is_public ? 'text-emerald-400' : 'text-gray-300'}`}>
                                    {binderData.is_public ? 'Public (Anyone can view your collection)' : 'Private (Only you can see this)'}
                                </p>
                            </div>
                        </div>
                    </div>

                
                </motion.div>
            </div>
        </div>
    )
}