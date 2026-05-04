import { SearchParams } from "next/dist/server/request/search-params";
import { IdolsClient } from "./idolsClient";
import { getAllIdols } from "@/queries/idols";

export default async function IdolsPage({ searchParams }: { searchParams: SearchParams }) {
    const params = await searchParams
    const currentPage = Number(params?.page) || 1
    const query = Array.isArray(params.search) ? params.search[0] : params.search || ''
    
    const idolsData = await getAllIdols(query, currentPage, 30, undefined)

    return (
        <IdolsClient 
            currentPage={currentPage}
            idols={idolsData}
        />
    )
}