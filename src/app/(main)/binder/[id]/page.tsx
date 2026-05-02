import BinderDetailClient from "./detailClient";
import { getProfile } from "@/app/lib/userServer";
import { getUserCollections } from "@/queries/userCollections";
import { getBinderDetail } from "@/queries/binders";
import { getApprovedCards, getUserWishlist } from "@/queries/photocards";
import { SearchParams } from "next/dist/server/request/search-params";
import { FilterProps } from "@/components/UI/filter";
import { getDistributionTypes } from "@/queries/distributionTypes";
import { getGroups } from "@/queries/groups";
import { CardRarity } from "@/types";
import { CARD_RARITY } from "@/constants";
import { buildPhotocardFilterRules } from "@/helper/buildFilter";

export default async function BinderDetailPage({ params, searchParams }: { params: { id: string }, searchParams: SearchParams }) {
    const profile = (await getProfile())!
    const binderID = await params.id
    const searchParam = await searchParams

    const query = Array.isArray(searchParam.search) ? searchParam.search[0] : searchParam.search || ''
    const currentPage = Number(searchParam?.page) || 1

    const rawGroupParam = Array.isArray(searchParam.groups) ? searchParam.groups : searchParam.groups ? searchParam.groups.split(',') : []
    const rawSortParam = Array.isArray(searchParam.sort_by) ? searchParam.sort_by[0] : searchParam.sort_by || ''
    const rawDistParam = Array.isArray(searchParam.distribution_type) ? searchParam.distribution_type[0] : searchParam.distribution_type || ''
    const rawRarityParam = Array.isArray(searchParam.rarity) ? searchParam.rarity : searchParam.rarity ? searchParam.rarity?.split(',') : []

    const [userCollections, userWishlists, binderData, distributionsData, groupsData] = await Promise.all([
        await getUserCollections(profile.id),
        await getUserWishlist(profile.id),
        await getBinderDetail(binderID),
        await getDistributionTypes(),
        await getGroups()
    ])

    const matchedGroup = groupsData.filter(
        g => rawGroupParam.includes(g.id)
    ) || null;

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

    const generatedRules = buildPhotocardFilterRules({
        searchQuery: query,
        selectedDistributions: rawDistParam,
        selectedGroups: rawGroupParam,
    })

    const cardsData = await getApprovedCards(currentPage, undefined, generatedRules)
    console.log(binderData)

    return <BinderDetailClient
        userCollections={userCollections}
        userWishlists={userWishlists}
        binderData={binderData}
        cardsData={cardsData}
        currentFilters={currentFilters}
        distributionTypes={distributionsData}
        groups={groupsData}
    />
}