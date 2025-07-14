import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[350px] bg-white rounded-lg border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src="/assets/images/1080full-yuna-(itzy).jpg"
                    alt="News Pic"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content */}
            <div className="p-5">
                <span className="text-xs text-gray-500">June 15, 2025</span>
                <h3 className="mt-1 text-lg font-semibold text-gray-900 line-clamp-2">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    The popular Yuna from ITZY Kpop Group spotted in Seoul with Brillian.
                </p>
                
                <button className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-700 transition-colors">
                    Read More →
                </button>
            </div>
        </div>
    )
}