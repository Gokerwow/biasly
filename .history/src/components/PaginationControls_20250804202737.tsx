export function PaginationControls() {
    return (
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
    )
}