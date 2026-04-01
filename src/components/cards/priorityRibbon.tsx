'use client'

import { useState } from 'react'
import { UpdateWishlistPriority } from '@/actions/card_actions'
import { useRouter } from 'next/navigation'
import { priorityConfig } from '@/constants'

const priorityOrder = ['low', 'medium', 'high'] as const
type Priority = typeof priorityOrder[number]

// const priorityStyles: Record<Priority, string> = {
//     high: 'bg-gradient-to-r from-red-600 to-rose-500',
//     medium: 'bg-gradient-to-r from-amber-500 to-orange-400',
//     low: 'bg-gradient-to-r from-gray-600 to-gray-500',
// }

export function PriorityRibbon({
    priority,
    wishlistId
}: {
    priority: Priority
    wishlistId: number
}) {
    const [currentPriority, setCurrentPriority] = useState(priority)
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    const pc = priority ? priorityConfig[priority] : priorityConfig['low']

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (isLoading) return

        // cycle: low → medium → high → low
        const currentIndex = priorityOrder.indexOf(currentPriority)
        const nextPriority = priorityOrder[(currentIndex + 1) % priorityOrder.length]

        setCurrentPriority(nextPriority)  // optimistic update
        setIsLoading(true)

        const result = await UpdateWishlistPriority(wishlistId, nextPriority)
        if (result.error) {
            setCurrentPriority(currentPriority)  // revert on error
        }

        setIsLoading(false)
        router.refresh()
    }

    return (
        <div className="absolute top-0 right-0 z-30 w-20 h-20 overflow-hidden rounded-tr-2xl">
            <div
                onClick={handleClick}
                className={`
                    absolute top-4 w-24 py-1
                    rotate-45 text-center cursor-pointer
                    text-[8px] font-black uppercase tracking-widest text-white shadow-xl
                    transition-all duration-300
                    ${pc}
                    ${isLoading ? 'opacity-50' : 'hover:brightness-110 active:brightness-90'}
                `}
                style={{ right: '-22px', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}
            >
                {currentPriority}
            </div>
        </div>
    )
}