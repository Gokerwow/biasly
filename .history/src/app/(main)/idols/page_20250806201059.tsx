import { createClient } from "@/utils/supabase/server";
import IdolsCard from "@/components/IdolsCard";
import { PaginationControls } from "@/components/PaginationControls";
import { ChevronDown } from "lucide-react";

export default async function IdolsPage({ searchParams }: { searchParams: { page?: string } }) {

    const supabase = await createClient();

    const itemsPerPage = 30;
    const currentPage = Number(searchParams['page'] ?? '1');
    const from = (currentPage - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const { data: idolsData, error: selectError } = await supabase
        .from('idols')
        .select(`
            id,
            name,
            groups (id, name)`)
        .range(from, to)

if (selectError) {
    console.log('Select Error:', selectError);
    return <p>Gagal memuat data: {selectError.message}</p>;
}

    // Query BARU untuk menghitung SEMUA data dari tabel 'idols'
    const { count: totalIdols, error: countError } = await supabase
        .from('idols')
        .select('*', { count: 'exact', head: true });

    // Tambahkan error handling untuk query count
    if (countError) {
        return <p>Gagal menghitung total data.</p>;
    }

    // Perhitungan totalPages yang benar menggunakan Math.ceil
    const totalPages = Math.ceil((totalIdols ?? 0) / itemsPerPage);

    return (
        <div className="py-18">
            <header className="w-full bg-gradient-to-r from-[#9900FF] to-[#EB4899]">
                <div className="max-w-7xl py-10 mx-auto text-center">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">K-POP IDOLS GALLERY</h1>
                        <h2 className="text-xl text-purple-100 max-w-3xl mx-auto">Discover and explore your favorite K-Pop idols from various groups</h2>
                    </div>
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <input type="text" placeholder="Search groups..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg" />
                            <svg className="absolute left-4 top-3.5 h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>
            <div className="containerPad">
                {/* <!-- Filter Section --> */}
                <section className="mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <h2 id="female" className="font-display text-2xl md:text-3xl font-bold">All Idols</h2>

                        <div className="flex flex-wrap items-center gap-3">
                            <div className="relative">
                                <select aria-label="sort by" className="appearance-none bg-white border border-gray-200 rounded-full px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-idol-pink focus:border-transparent text-sm shadow-sm">
                                    <option>Sort by: Followers</option>
                                    <option>Sort by: Popularity</option>
                                    <option>Sort by: Newest</option>
                                    <option>Sort by: Alphabetical</option>
                                </select>
                                <ChevronDown className=" absolute right-3 top-2.5" />
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <button className="filter-chip px-3 py-1.5 rounded-full bg-[#9900FF] text-white text-xs font-medium shadow-sm cursor-pointer">All</button>
                                <button className="filter-chip px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium shadow-sm cursor-pointer">4th Gen</button>
                                <button className="filter-chip px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium shadow-sm cursor-pointer">3rd Gen</button>
                                <button className="filter-chip px-3 py-1.5 rounded-full bg-white border border-gray-200 hover:bg-gray-50 text-xs font-medium shadow-sm cursor-pointer">Active</button>
                            </div>
                        </div>
                    </div>
                </section>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {idolsData.map((idol) => {
                        return <IdolsCard
                            key={idol.id}
                            name={idol.name}
                            groups={idol.groups}
                        />
                    })}
                </div>
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    page='idols'
                />
            </div>
        </div>
    )
}