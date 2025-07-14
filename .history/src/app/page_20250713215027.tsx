import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[360px] bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden group">
            {/* Image with Neon Border Effect */}
            <div className="relative h-48 w-full overflow-hidden border-b border-gray-800">
                <Image
                    src="/assets/images/1080full-yuna-(itzy).jpg"
                    alt="News Pic"
                    fill
                    className="object-cover group-hover:opacity-80 transition-opacity"
                />
                {/* Neon Tag */}
                <span className="absolute top-3 left-3 bg-black text-[#DE45A6] px-3 py-1 rounded-full text-xs font-bold border border-[#8C5CF5]">
                    EXCLUSIVE
                </span>
            </div>

            {/* Content */}
            <div className="p-5">
                <span className="text-xs text-[#8C5CF5]">June 15, 2025</span>
                <h3 className="mt-1 text-lg font-bold text-white">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                
                {/* Neon Gradient Button */}
                <button 
                    className="mt-4 w-full py-2.5 rounded-lg font-medium
                    bg-gradient-to-r from-[#8C5CF5] to-[#DE45A6] hover:bg-[length:200%_100%]
                    bg-[length:100%_100%] transition-all duration-500 shadow-lg hover:shadow-[#DE45A6]/40"
                >
                    <span className="drop-shadow-[0_1px_2px_rgba(222,69,166,0.8)]">
                        Read More
                    </span>
                </button>
            </div>
        </div>
    )
}