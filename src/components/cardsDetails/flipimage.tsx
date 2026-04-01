'use client'

import { useState } from "react"
import { motion } from 'framer-motion'
import Image from "next/image"

export default function FlipImage({ name, frontImageUrl, backImageUrl }: { name: string, frontImageUrl: string, backImageUrl: string }) {
    const [isFlipped, setIsFlipped] = useState(false)

    return (
        <>
            <div
                className="relative w-full cursor-pointer [perspective:1200px]"
                onClick={() => setIsFlipped(!isFlipped)}
            >
                <motion.div
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.6, type: 'spring', stiffness: 80, damping: 15 }}
                    style={{ transformStyle: 'preserve-3d' }}
                    className="relative w-full aspect-[2/3]"
                >
                    {/* Front */}
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
                        style={{ backfaceVisibility: 'hidden' }}>
                        <Image
                            src={frontImageUrl}
                            alt={name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/10 pointer-events-none" />
                    </div>

                    {/* Back */}
                    <div
                        className="absolute inset-0 rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {backImageUrl ? (
                            <Image
                                src={backImageUrl}
                                alt={`${name} back`}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-[#161B22] flex items-center justify-center">
                                <span className="text-xs text-gray-600 uppercase tracking-widest">No Back Image</span>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* Flip hint */}
            <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest">
                {isFlipped ? 'Showing back — click to flip' : 'Click card to flip'}
            </p>
        </>
    )
}