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

interface PaginationControlsProps {
    totalPages: number,
    currentPage: number
}

export function PaginationControls({ totalPages, currentPage }: PaginationControlsProps ) {

    const pageDetail = generatePagination(totalPages, currentPage)

    return (
        <div className="mt-12 flex justify-center">
            <nav className="flex items-center space-x-1">
                <Link href={`/groups?page=${currentPage - 1}`} aria-label="previous pagination" className={`p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 cursor-pointer hover:scale-110 transition-all duration-200 ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                {pageDetail.map((pageNumber, index) => {
                    if (pageNumber === '...') {
                        return (
                            <span key={index} className="px-4 py-2 text-gray-500">
                                ...
                            </span>
                        );
                    }
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
                <Link href={`/groups?page=${currentPage + 1}`} aria-label="next pagination" className="p-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 cursor-pointer hover:scale-110 transition-all duration-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                </Link>
            </nav>
        </div>
    )
}