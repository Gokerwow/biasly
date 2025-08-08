import { createClient } from "@/utils/supabase/server"

export default async function GroupsPage({ searchParams }: {
    searchParams: { page?: string };
}) {

    
    const currentPage = parseInt(searchParams.page || '1', 10)
    const itemsPerPage = 50; 
    
    const from = (currentPage - 1) * itemsPerPage
    const to = from + itemsPerPage - 1
    
    const supabase = await createClient()

    const { data: GroupsData, error: selectError } = await supabase
        .from('groups')
        .select('name')
        .range(from, to)
        .order('name', { ascending: true });
    
    if (selectError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    return (
        <div>
            {GroupsData.map((group, index) => {
                return <h1 key={index}>{group.name}</h1>
            })}
            <a href={`?page=${currentPage + 1}`}>next</a>
        </div>
    )
}