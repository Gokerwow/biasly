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
        .select('*')
        .range(from, to)
        .order('name', { ascending: true });
    
    if (selectError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    return (
        <div className="pt-18">
            <header className="w-full bg-gradient-to-r from-[#9900FF] to-[#EB4899]">
                <div className="text-white">
                    <h1 className="text-4xl fontb">Explore K-Pop Groups</h1>
                    <h2>Discover your favorite groups and find new biases</h2>
                </div>
            </header>
        </div>
    )
}