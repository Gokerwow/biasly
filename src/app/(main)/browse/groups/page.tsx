import { SearchParams } from "next/dist/server/request/search-params";
import { GroupsClient } from "./groupsClient"
import { getAllGroups } from "@/queries/groups";

export default async function GroupsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1
    const query = Array.isArray(params.search) ? params.search[0] : params.search || ''

    
    const groupsData = await getAllGroups(query, currentPage, undefined, undefined)

    return (
        <GroupsClient groups={groupsData} currentPage={currentPage} />
    )
}
