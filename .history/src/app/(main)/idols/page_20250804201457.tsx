import { createClient } from "@/utils/supabase/server";
import IdolsCard from "@/components/IdolsCard";

export default async function IdolsPage({ searchParams }: { searchParams: { page?: string } }) {

    const supabase = await createClient();

    const { data: idolsData, error: selectError } = await supabase
        .from('idols')
        .select('*');

    if (selectError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    const itemsPerPage = 30;
    const totalIdols = idolsData.length || 0
    const totalpages = totalIdols / itemsPerPage
    const from = Number(searchParams.page) * itemsPerPage
    const to = 

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
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <IdolsCard />
                </div>
            </div>
        </div>
    )
}