'use client'

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"

export default function Pagination({ totalItems, itemsPerPage, currentPage, onPageChange }) {
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    if (totalPages <= 1) return null;

    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    const getPageNumbers = () => {
        const pages = [];

        // Case A: If 7 or fewer pages, show them all (1, 2, 3, 4, 5, 6, 7)
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Case B: We have many pages, use the "Window" logic

            // If near the start (Page 1, 2, 3, or 4)
            // page 1,2,3,4,...,100(total)
            if (currentPage <= 4) {
                pages.push(1, 2, 3, 4, 5, '...', totalPages);
            }
            // If near the end
            else if (currentPage >= totalPages - 3) {
                pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            }
            // If in the middle
            else {
                pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
            }
        }
        return pages;
    };

    return (
        <div className="flex flex-col items-center gap-4 py-8">

            {/* 1. Main Pagination Bar */}
            <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#161b22]/80 p-2 backdrop-blur-xl shadow-2xl">

                {/* PREVIOUS BUTTON */}
                <button
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="group cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                    <ChevronLeft className="h-5 w-5" />
                </button>

                {/* Divider */}
                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

                {/* DYNAMIC PAGE NUMBERS LOOP */}
                {getPageNumbers().map((page, index) => {

                    // A. Render the "..." (Ellipsis)
                    if (page === '...') {
                        return (
                            <div key={`ellipsis-${index}`} className="flex h-10 w-10 items-center justify-center text-gray-600">
                                <MoreHorizontal className="h-4 w-4" />
                            </div>
                        );
                    }

                    // B. Render the Number Buttons
                    const isActive = page === currentPage;

                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)} // Use the new prop
                            className={`cursor-pointer ${isActive
                                ? "relative h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-sm font-bold text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-transform hover:scale-105"
                                : "h-10 w-10 rounded-xl text-sm font-bold text-gray-400 transition-all hover:bg-white/5 hover:text-white"
                                }
                            `}
                        >
                            {page}
                        </button>
                    );
                })}

                {/* Divider */}
                <div className="h-6 w-[1px] bg-white/10 mx-1"></div>

                {/* NEXT BUTTON */}
                <button
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="group cursor-pointer flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-gray-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-400 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]"
                >
                    <ChevronRight className="h-5 w-5 group-hover:translate-x-0.5 transition-transform" />
                </button>

            </div>

            {/* 2. Info Text */}
            <div className="text-xs font-mono text-gray-500">
                Showing <span className="text-white font-bold">{startItem}-{endItem}</span> of <span className="text-white font-bold">{totalItems}</span> cards
            </div>

        </div>
    )
}