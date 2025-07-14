import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-full max-w-2xl flex bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow">
            {/* Image (1/3 width) */}
            <div className="w-1/3 relative overflow-hidden">
                <Image
                    src="/assets/images/1080full-yuna-(itzy).jpg"
                    alt="News Pic"
                    fill
                    className="object-cover"
                />
            </div>

            {/* Content (2/3 width) */}
            <div className="w-2/3 p-5 flex flex-col">
                <span className="text-xs text-gray-500">June 15, 2025</span>
                <h3 className="mt-1 text-lg font-bold text-gray-800 line-clamp-2">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    The popular Yuna from ITZY Kpop Group spotted with Brillian at a private event.
                </p>
                
                <button className="mt-auto self-start text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    Read More →
                </button>
            </div>
        </div>
    )
}