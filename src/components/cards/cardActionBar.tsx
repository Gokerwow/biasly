'use client'

import { AddCardToCollection, AddCardToWishlist, RemoveCardFromCollection, RemoveCardFromWishlist } from "@/actions/card_actions";
import { useUser } from "@/app/providers/authProvider";
import { useToast } from "@/app/providers/toastProvider";
import { CheckCheck, Heart, Loader2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { MouseEvent, startTransition, useState } from "react";
import ConfirmationModal from "../UI/confirmationModal";

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
    const [isOpen, setIsOpen] = useState(false)
    const { profile } = useUser()
    const { showToast } = useToast()
    const router = useRouter()

    const handleWishlist = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!profile) {
            showToast('You must be logged in', 'error')
            return
        }

        setIsWishlistLoading(true)

        startTransition(async () => {
            if (!inWishlist) {
                const result = await AddCardToWishlist(profile.id, cardID, 'medium')
                if (result.error) {
                    showToast('Failed to add card to wishlist', 'error')
                } else {
                    showToast('Successfully added card to wishlist!', 'success')
                    setInWishlist(true)
                }
            } else {
                const result = await RemoveCardFromWishlist(profile.id, cardID)
                if (result.error) {
                    showToast('Failed to remove card from wishlist', 'error')
                } else {
                    showToast('Successfully removed from wishlist', 'success')
                    setInWishlist(false)
                }
            }
            setIsWishlistLoading(false)
            router.refresh()
        })
    }

    const handleCollect = async (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        e.preventDefault()
        e.stopPropagation()

        if (!profile) {
            showToast('You must be logged in', 'error')
            return
        }

        setIsCollectLoading(true)

        if (!inCollection) {
            const result = await AddCardToCollection(profile.id, cardID)
            if (result.error) {
                showToast('Failed to add card to collection', 'error')
                console.log('Failed to add card to collection', result.error)
            } else {
                showToast('Successfully added card to collection', 'success')
                setInCollection(true)
            }
        } else {
            setIsOpen(true)
        }
        setIsCollectLoading(false)
    }

    const handleConfirmRemove = async () => {
        if (!profile) {
            showToast('You must be logged in', 'error')
            return
        }

        const result = await RemoveCardFromCollection(profile.id, cardID)
        console.log("HABIS CONFIRM REMOVE: ", result)
        setIsOpen(false)
        setInCollection(false)
    }

    return <>
        <div className="
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

        <ConfirmationModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            onConfirm={handleConfirmRemove}
            title="Are you sure to remove card from collection?"
            description="You can still add the card to your collections again"
        />
    </>
}