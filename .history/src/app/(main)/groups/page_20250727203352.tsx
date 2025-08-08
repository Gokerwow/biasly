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
                    <h1 className="text-4xl font-black">Explore K-Pop Groups</h1>
                    <h2>Discover your favorite groups and find new biases</h2>
                </div>
                <div className="relative">
                    <input type="text" placeholder="Search groups..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg"/>
                        <svg className="absolute left-4 top-3.5 h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                </div>
            </header>
        </div>
    )
}