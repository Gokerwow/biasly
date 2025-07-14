import Image from "next/image"

export default function NewsCard({prop}) {
    return (
        <div className="w-[350px] bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow relative pb-16">
            {/* Image */}
            <div className="relative h-48 w-full overflow-hidden rounded-t-xl">
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
                <h3 className="mt-1 text-lg font-bold text-gray-800">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                    The popular Yuna from ITZY Kpop Group spotted in Seoul.
                </p>
            </div>

            {/* Floating Gradient Button */}
            <div className="absolute bottom-5 left-5 right-5">
                <button 
                    className="w-full py-3 rounded-xl text-white font-semibold
                    bg-gradient-to-r from-[#8C5CF5] to-[#DE45A6] hover:shadow-lg
                    transition-all hover:-translate-y-0.5 active:translate-y-0"
                >
                    Read Full Article
                </button>
            </div>
        </div>
    )
}