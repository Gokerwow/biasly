import { createClient } from "@/utils/supabase/server"

export default async function GroupsPage({ searchParams }: {
    searchParams: { page?: string };
}) {

    const supabase = await createClient()

    const { data: GroupsData, error: selectError } = await supabase
        .from('groups')
        .select('name')
        .range(0, 9)

    const currentPage = parseInt(searchParams.page || '1', 10)
    const itemsPerPage = 20; 

    const from = (currentPage - 1) * itemsPerPage
    const to = itemsPerPage - 1

    if (selectError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    return (
        <div>
            {GroupsData.map((group, index) => {
                return <h1 key={index}>{group.name}</h1>
            })}


        </div>
    )
}