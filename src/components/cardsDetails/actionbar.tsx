'use client'

import { AddCardToCollection, AddCardToWishlist } from "@/actions/card_actions";
import { useToast } from "@/app/providers/toastProvider";
import { CheckCheck, Heart, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DetailAction({ isWishlisted, isCollected, userID, cardID }: { 
    isWishlisted: boolean
    userID: string
    isCollected: boolean
    cardID: string 
}) {
    const [inWishlist, setInWishlist] = useState(isWishlisted)
    const [inCollection, setInCollection] = useState(isCollected)
    const [isCollectionLoading, setIsCollectionLoading] = useState(false)
    const [isWishlistLoading, setIsWishlistLoading] = useState(false)
    const { showToast } = useToast()
    const router = useRouter()

    const handleAddToCollection = async () => {
        if (inCollection) return  // already collected, do nothing
        setIsCollectionLoading(true)
        const result = await AddCardToCollection(userID, cardID)
        if (result.error) {
            showToast("Failed to add to collection", 'error')
        } else {
            setInCollection(true)
            showToast("Added to collection!", 'success')
        }
        setIsCollectionLoading(false)
    }

    const handleAddToWishlist = async () => {
        if (inWishlist) return  // already wishlisted, do nothing
        setIsWishlistLoading(true)
        const result = await AddCardToWishlist(userID, cardID)
        if (result.error) {
            showToast("Failed to add to wishlist", 'error')
        } else {
            setInWishlist(true)
            showToast("Added to wishlist!", 'success')
            router.refresh()
        }
        setIsWishlistLoading(false)
    }

    return (
        <div className="flex flex-col gap-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Add to your vault
            </p>
            <div className="flex gap-3">

                {/* Collect button */}
                <button
                    onClick={handleAddToCollection}
                    disabled={isCollectionLoading || inCollection}
                    className={`
                        flex-1 flex items-center justify-center gap-2 
                        rounded-2xl py-3.5 text-sm font-black
                        transition-all active:scale-95
                        disabled:cursor-not-allowed
                        ${inCollection
                            ? 'bg-green-500/20 border border-green-500/30 text-green-400 cursor-default'
                            : 'bg-pink-600 hover:bg-pink-500 hover:scale-[1.02] text-white shadow-lg shadow-pink-900/30 cursor-pointer'
                        }
                    `}
                >
                    {isCollectionLoading
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : inCollection
                            ? <CheckCheck className="h-4 w-4" />
                            : <Plus className="h-4 w-4" />
                    }
                    {inCollection ? 'In Collection' : 'Add to Collection'}
                </button>

                {/* Wishlist button */}
                <button
                    onClick={handleAddToWishlist}
                    disabled={isWishlistLoading || inWishlist}
                    className={`
                        flex items-center justify-center gap-2
                        rounded-2xl border px-5 py-3.5 text-sm font-black
                        transition-all active:scale-95
                        disabled:cursor-not-allowed
                        ${inWishlist
                            ? 'bg-pink-500/20 border-pink-500/50 text-pink-400 cursor-default'
                            : 'bg-white/5 border-white/10 text-gray-400 hover:text-pink-400 hover:border-pink-500/30 hover:scale-[1.02] cursor-pointer'
                        }
                    `}
                >
                    {isWishlistLoading
                        ? <Loader2 className="h-4 w-4 animate-spin" />
                        : <Heart
                            className="h-4 w-4"
                            fill={inWishlist ? 'currentColor' : 'none'}
                        />
                    }
                    {inWishlist ? 'Wishlisted' : 'Wishlist'}
                </button>

            </div>
        </div>
    )
}