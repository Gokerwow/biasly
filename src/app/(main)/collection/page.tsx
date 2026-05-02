import { getProfile } from '@/app/lib/userServer'
import CollectionPageClient, { Pagination } from './collectionClient'
import { getUserCollections, getUserCollectionsDistribution, getUserCollectionsGroups, getUserCollectionsMembers, getUserCollectionsReleases } from '@/queries/userCollections'
import { SearchParams } from 'next/dist/server/request/search-params'
import { FetchFilterProps, FilterProps } from '@/components/UI/filter'
import { CardRarity } from '@/types'
import { CARD_RARITY } from '@/constants'
import { toSlug } from '@/helper/slug'

export default async function CollectionPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams
    const query = params.search

    const currentPage = Array.isArray(params.page) ? params.page[0] : params.page
    const rawGroupParam = Array.isArray(params.groups) ? params.groups : params.groups ? params.groups?.split(',') : []
    const rawSortParam = Array.isArray(params.sort_by) ? params.sort_by[0] : params.sort_by || ''
    const rawDistParam = Array.isArray(params.distribution_type) ? params.distribution_type[0] : params.distribution_type || ''
    const rawRarityParam = Array.isArray(params.rarity) ? params.rarity : params.rarity ? params.rarity?.split(',') : []
    const rawIdolsParam = Array.isArray(params.idols) ? params.idols : params.idols ? params.idols?.split(',') : []
    const rawReleasesParam = Array.isArray(params.releases) ? params.releases : params.releases ? params.releases?.split(',') : []

    const profile = (await getProfile())!
    const groupsFilter = await getUserCollectionsGroups(profile?.id)
    const distFilter = await getUserCollectionsDistribution(profile?.id)
    console.log("distribution", distFilter)

    const matchedGroup = groupsFilter.filter(
        g => rawGroupParam.includes(toSlug(g.name))
    ) || null;
    console.log("GROUPNYA YANG MATCh", matchedGroup)

    const matchedRarity: CardRarity[] | null = CARD_RARITY.filter(
        g => rawRarityParam.includes(g.toLowerCase())
    ) || null;

    const matchedDist = distFilter.find(
        d => toSlug(d.name) === rawDistParam
    ) || null;

    const idolsFilter = matchedGroup.length > 0 ? await getUserCollectionsMembers(profile?.id, matchedGroup.map(g => g.id)) : []
    const releasesFilter = matchedGroup.length > 0 ? await getUserCollectionsReleases(profile?.id, matchedGroup.map(g => g.id)) : []
    console.log("RELEASEs", releasesFilter)

    const matchedIdols = idolsFilter.filter(
        d => rawIdolsParam.includes(toSlug(d.stage_name))
    ) || null;

    const matchedReleases = releasesFilter.filter(
        d => rawReleasesParam.includes(toSlug(d.title))
    ) || null;


    const currentFilters: FilterProps = {
        sort_by: rawSortParam,
        distribution_type: matchedDist,
        rarity: matchedRarity,
        groups: matchedGroup,
        idols: matchedIdols,
        releases: matchedReleases
    }
    console.log("currentFilters", currentFilters)

    const fetchFilters: FetchFilterProps = {
        sort_by: rawSortParam,
        distribution_type_id: matchedDist?.id ?? '',
        raritys: matchedRarity,
        groups_ids: matchedGroup.map(g => g.id),
        idols_ids: matchedIdols.map(i => i.id),
        releases_ids: matchedReleases.map(r => r.id)
    }
    console.log("FETCH FILTERS", fetchFilters)

    const userCollections = await getUserCollections(profile?.id, undefined, undefined, undefined, fetchFilters)
    console.log("DATA", userCollections)

    const pagination: Pagination = {
        page: Number(currentPage) || 1,
        hasNextPage: userCollections.hasNextPage,
        hasPreviousPage: userCollections.hasPreviousPage,
        pageSize: userCollections.pageSize,
        total: userCollections.total,
        totalPages: userCollections.totalPages
    }
    console.log("FETCH PAGINATIONS", pagination)

    return <CollectionPageClient
        userCollections={userCollections.data}
        profile={profile}
        groupsFilters={groupsFilter}
        currentFilters={currentFilters}
        distFilters={distFilter}
        idolsFilters={idolsFilter}
        releasesFilters={releasesFilter}
        pagination={pagination}
    />
}