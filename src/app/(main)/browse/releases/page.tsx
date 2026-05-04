import { getFeaturedRelease, getReleasesWithCards } from '@/queries/releases'
import { getProfile } from '@/app/lib/userServer'
import { getUserWishlistIds } from '@/queries/photocards'
import { SearchParams } from 'next/dist/server/request/search-params'
import { getDistributionTypes } from '@/queries/distributionTypes'
import { getGroups } from '@/queries/groups'
import { FilterProps } from '@/components/UI/filter'
import { CARD_RARITY } from '@/constants'
import { CardRarity } from '@/types'
// import { toSlug } from '@/helper/slug'
import { getUserCollectionIds } from '@/queries/userCollections'
import { buildReleasesFilterRules } from '@/helper/buildFilter'
import { SortRule } from '@/queries/appylyFilters'
import { ReleasesClient } from './releasesClient'

export default async function BrowsePage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams
    const profile = await getProfile()

    const query = Array.isArray(params.search) ? params.search[0] : params.search || ''
    const currentPage = Number(params?.page) || 1

    const rawGroupParam = Array.isArray(params.groups) ? params.groups : params.groups ? params.groups.split(',') : []
    const rawSortParam = Array.isArray(params.sort_by) ? params.sort_by[0] : params.sort_by || ''
    const rawDistParam = Array.isArray(params.distribution_type) ? params.distribution_type[0] : params.distribution_type || ''
    const rawRarityParam = Array.isArray(params.rarity) ? params.rarity : params.rarity ? params.rarity?.split(',') : []

    const [distributionsData, groupsData] = await Promise.all([
        await getDistributionTypes(),
        await getGroups()
    ])

    const matchedGroup = groupsData.filter(
        g => rawGroupParam.includes(g.id)
    ) || null;
    console.log('GROUPS PARAM', rawGroupParam)

    const matchedDist = distributionsData.find(
        d => d.id === rawDistParam
    ) || null;

    const matchedRarity: CardRarity[] | null = CARD_RARITY.filter(
        g => rawRarityParam.includes(g.toLowerCase())
    ) || null;

    const currentFilters: FilterProps = {
        sort_by: rawSortParam,
        distribution_type: matchedDist,
        rarity: matchedRarity,
        groups: matchedGroup
    }

    const generatedRules = buildReleasesFilterRules({
        groupIds: rawGroupParam,
        rarities: matchedRarity || undefined,
        distributionTypeId: rawDistParam || null
    })

    // 3. THE SORT TRANSLATOR: Convert your UI sort state to the generic database SortRule
    const sortRule: SortRule = {
        column: rawSortParam === 'name' ? 'title' : 'created_at',
        // 'oldest' and 'name' are ascending (A-Z, oldest first). Default is descending (newest).
        ascending: rawSortParam === 'oldest' || rawSortParam === 'name' 
    }

    console.log('FILTERS', currentFilters)

    const collectionIds = profile ? await getUserCollectionIds(profile.id) : []
    const wishlistIds = profile ? await getUserWishlistIds(profile.id) : []

    const [releasesData, featuredRelease] = await Promise.all([
        await getReleasesWithCards(query, currentPage, undefined, generatedRules, sortRule),
        await getFeaturedRelease()
    ])

    console.log('INI YGY    ', releasesData)

    const releaseWithCards = releasesData.data
    const bannerImage = featuredRelease[0].photocards[0].front_image_url

    return (
        <ReleasesClient
            bannerImage={bannerImage}
            collectionIds={collectionIds}
            currentPage={currentPage}
            featuredRelease={featuredRelease[0]}
            hasNextPage={releasesData.hasNextPage}
            hasPreviousPage={releasesData.hasPreviousPage}
            releaseWithCards={releaseWithCards}
            totalItems={releasesData.total}
            totalPages={releasesData.totalPages}
            wishlistIds={wishlistIds}
            currentFilters={currentFilters}
            distributionData={distributionsData}
            groupsData={groupsData}
        />
    )
}