'use client'

import { AddCardToCollection, AddCardToWishlist } from "@/actions/card_actions";
import { useUser } from "@/app/providers/authProvider";
import { useToast } from "@/app/providers/toastProvider";
import { CheckCheck, Heart, Loader2, Plus } from "lucide-react";
import { MouseEvent, useState } from "react";

interface props {
    cardID: string
    isInCollection: boolean
    isInWishlist: boolean
}

export function CardActionBar({ cardID, isInCollection, isInWishlist }: props) {

    const [isCollectLoading, setIsCollectLoading] = useState(false)
    const [isWishlistLoading, setIsWishlistLoading] = useState(false)
    const [inCollection, setInCollection] = useState(isInCollection)
    const [inWishlist, setInWishlist] = useState(isInWishlist)
    const { profile } = useUser()
    const { showToast } = useToast()

    const handleWishlist = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!profile) {
            showToast('You must be logged in', 'error')
            return
        }

        setIsWishlistLoading(true)

        const result = await AddCardToWishlist(profile.id, cardID)
        if (result.error) {
            showToast('Failed to add card to wishlist', 'error')
            console.log('Failed to add card to wishlist', result.error)
        } else {
            showToast('Successfully added card to wishlist', 'success')
            setInWishlist(true)
        }
        setIsWishlistLoading(false)
    }

    const handleCollect = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!profile) {
            showToast('You must be logged in', 'error')
            return
        }

        setIsCollectLoading(true)
        const result = await AddCardToCollection(profile.id, cardID)

        if (result.error) {
            showToast('Failed to add card to collection', 'error')
            console.log('Failed to add card to collection', result.error)
        } else {
            showToast('Successfully added card to collection', 'success')
            setInCollection(true)
        }
        setIsCollectLoading(false)
    }

    return <div className="
                    absolute bottom-0 inset-x-0 z-30
                    flex items-center gap-2 p-2
                    bg-black/60 backdrop-blur-sm
                    translate-y-full group-hover:translate-y-0
                    md:translate-y-full md:group-hover:translate-y-0
                    max-md:translate-y-0
                    transition-transform duration-300
                ">
        <button
            onClick={(e) => handleWishlist(e)}
            disabled={isWishlistLoading}
            className={`
                        flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                        text-[9px] font-bold uppercase tracking-widest
                        transition-all cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${inWishlist
                                    ? 'bg-pink-500/20 text-pink-400'
                                    : 'bg-white/10 text-white/70 hover:bg-pink-500/20 hover:text-pink-400'
                                }
                    `}
        >
            {isWishlistLoading
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : <Heart fill={inWishlist ? 'currentColor' : 'none'} className={`h-3 w-3 ${inWishlist ? 'text-pink-400' : ''}`} />
            }
            {inWishlist ? 'Wishlisted' : 'Wishlist'}
        </button>

        <button
            onClick={(e) => handleCollect(e)}
            disabled={isCollectLoading}
            className={`
                        flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg
                        text-[9px] font-bold uppercase tracking-widest
                        transition-all cursor-pointer
                        disabled:opacity-50 disabled:cursor-not-allowed
                        ${inCollection
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-white/10 text-white/70 hover:bg-purple-500/20 hover:text-purple-400'
                                }
                    `}
        >
            {isCollectLoading
                ? <Loader2 className="h-3 w-3 animate-spin" />
                : inCollection
                    ? <CheckCheck className="h-3 w-3" />
                    : <Plus className="h-3 w-3" />
            }
            {inCollection ? 'Collected' : 'Collect'}
        </button>
    </div>
}