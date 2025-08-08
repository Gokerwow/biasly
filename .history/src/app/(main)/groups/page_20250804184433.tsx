import { createClient } from "@/utils/supabase/server"
import GroupCards from "@/components/GroupCards";
import Link from "next/link";

// Fungsi untuk membuat daftar angka dengan cepat, misal: [3, 4, 5]
const range = (start: number, end: number) => {
    const length = end - start + 1;
    return Array.from({ length }, (_, idx) => idx + start);
};

// Fungsi "Si Pengatur Cerdas" yang sudah disederhanakan
const generatePagination = (totalPages: number, currentPage: number) => {
    const DOTS = '...';

    // ATURAN #1: Kalau total halaman sedikit, tampilkan semua.
    if (totalPages <= 7) {
        return range(1, totalPages);
    }

    // ATURAN #2: Kalau kita di dekat awal.
    if (currentPage < 5) {
        return [1, 2, 3, 4, 5, DOTS, totalPages];
    }

    // ATURAN #3: Kalau kita di dekat akhir.
    if (currentPage > totalPages - 4) {
        return [1, DOTS, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    // ATURAN #4: Kalau kita di tengah-tengah.
    return [1, DOTS, currentPage - 1, currentPage, currentPage + 1, DOTS, totalPages];
};

export default async function GroupsPage({ searchParams }: {
    searchParams: { page?: string };
}) {

    const currentPage = parseInt(searchParams.page || '1', 10)
    const itemsPerPage = 30;

    const from = (currentPage - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const supabase = await createClient()

    const { data: GroupsData, error: selectError } = await supabase
        .from('groups')
        .select('*')
        .range(from, to)

    // Query BARU untuk menghitung SEMUA data
    const { count, error: countError } = await supabase
        .from('groups')
        .select('*', { count: 'exact', head: true }); // head: true agar lebih cepat

    if (selectError || countError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    const totalPages = Math.ceil(count / itemsPerPage);

    const pageDetail = generatePagination(totalPages, currentPage)

    return (
        <div className="py-18">
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
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
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
                <div className="grid grid-cols-[repeat(auto-fill,minmax(320px,1fr))] gap-6">
                    {GroupsData.map((group) => {
                        const originalImageUrl = group.image_url;
                        const proxyImageUrl = originalImageUrl
                            ? `/api/image?url=${encodeURIComponent(originalImageUrl)}`
                            : '/assets/images/1080full-yuna-(itzy).jpg'; // Sediakan gambar placeholder
                        return <GroupCards
                            key={group.id}
                            name={group.name}
                            imageUrl={proxyImageUrl}
                            genres={group.genres}
                        />
                    })}
                </div>
                {/* <!-- Pagination --> */}
                <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-1">
                        <Link href={`/groups?page=${currentPage + 1}`} aria-label="previous pagination" className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 cursor-pointer hover:scale-110 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                            </svg>
                        </Link>
                        {pageDetail.map((pageNumber, index) => {
                            return <Link
                                key={index}
                                href={`/groups?page=${pageNumber}`}
                                className={currentPage === pageNumber
                                    ? "px-4 py-2 rounded-full bg-purple-600 text-white font-medium" // Style untuk halaman aktif
                                    : "px-4 py-2 rounded-full bg-white text-purple-600 border border-purple-200 font-medium hover:bg-purple-50" // Style untuk halaman non-aktif
                                }>
                                {pageNumber}
                            </Link>
                        })}
                        <Link href={`/groups?page=${currentPage - 1}`} aria-label="next pagination" className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 cursor-pointer hover:scale-110 transition-all duration-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </nav>
                </div>
            </main>
        </div>
    )
}