import { createClient } from "@/utils/supabase/server"
import Image from "next/image";
import GroupCards from "@/components/GroupCards";

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
                <div className="max-w-7xl py-10 mx-auto text-center">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore K-Pop Groups</h1>
                        <h2 className="text-xl text-purple-100 max-w-3xl mx-auto">Discover your favorite groups and find new biases</h2>
                    </div>
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <input type="text" placeholder="Search groups..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg" />
                            <svg className="absolute left-4 top-3.5 h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>
            <main className="containerPad">
                {/* <!-- Sort Options --> */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Popular Groups</h2>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                        <select aria-label="select sort by" className="bg-white border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                            <option>Popularity</option>
                            <option>Newest</option>
                            <option>Alphabetical</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-6">
                    <GroupCards />
                    <GroupCards />
                    <GroupCards />
                    <GroupCards />
                    <GroupCards />
                </div>
            </main>
        </div>
    )
}