import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[380px] bg-white/20 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden shadow-lg hover:shadow-xl transition-all">
            {/* Image */}
            <div className="relative h-56 w-full overflow-hidden">
                <Image
                    src="/assets/images/1080full-yuna-(itzy).jpg"
                    alt="News Pic"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
            </div>

            {/* Content */}
            <div className="p-6">
                <span className="text-xs text-white/80">June 15, 2025</span>
                <h3 className="mt-2 text-xl font-bold text-white">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                
                {/* Gradient Button */}
                <button 
                    className="mt-6 px-5 py-2.5 rounded-full text-white font-medium text-sm
                    bg-gradient-to-r from-[#8C5CF5] to-[#DE45A6] hover:from-[#7B4CE5] hover:to-[#D33A9A]
                    transition-all shadow-lg hover:shadow-[#DE45A6]/30"
                >
                    Read Full Story
                </button>
            </div>
        </div>
    )
}