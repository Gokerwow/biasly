import { getProfile } from '@/app/lib/userServer'
import { getUserWishlist } from '@/queries/photocards'
import WishlistClient from './wishlistClient'
import { SearchParams } from 'next/dist/server/request/search-params'

export default async function Wishlist({ searchParams }: { searchParams: SearchParams }) {
    const profile = (await getProfile())!
    const params = await searchParams
    const currentPage = Number(params?.page) || 1
    const wishlists = await getUserWishlist(profile.id, currentPage)

    return <WishlistClient 
        profile={profile}
        userWishlists={wishlists}
    />
        
}