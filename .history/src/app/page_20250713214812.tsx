import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[360px] bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
            {/* Image with Category Tag */}
            <div className="relative h-48 w-full overflow-hidden">
                <Image
                    src="/assets/images/1080full-yuna-(itzy).jpg"
                    alt="News Pic"
                    fill
                    className="object-cover"
                />
                <span className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                    GOSSIP
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>June 15, 2025</span>
                    <span>•</span>
                    <span>3 min read</span>
                </div>
                <h3 className="mt-2 text-lg font-bold text-gray-800">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                    The popular Yuna from ITZY Kpop Group was seen having dinner with Brillian at a high-end restaurant in Seoul, sparking dating rumors.
                </p>
                
                <button className="mt-4 w-full py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                    Read More
                </button>
            </div>
        </div>
    )
}