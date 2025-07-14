import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[382px] h-[420px] bg-white relative rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {/* Image */}
            <div className="w-full h-48 relative overflow-hidden">
                <Image
                    className="object-cover hover:scale-105 transition-transform duration-500"
                    src='/assets/images/1080full-yuna-(itzy).jpg'
                    alt="News Pic"
                    fill
                    priority
                />
                {/* Date Badge */}
                <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full shadow-sm">
                    <p className="text-xs font-medium text-gray-800">June 15, 2025</p>
                </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 flex flex-col gap-3">
                <h3 className="text-xl font-bold text-gray-800 line-clamp-2">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                    The popular Yuna from ITZY Kpop Group has been spotted with Brillian at a private dinner in Seoul. Fans are speculating about their relationship status after these intimate photos surfaced online.
                </p>
                
                {/* CTA */}
                <div className="mt-4">
                    <button className="px-5 py-2 bg-rose-500 text-white text-sm font-medium rounded-full hover:bg-rose-600 transition-colors duration-300 shadow-sm hover:shadow-md">
                        Read More
                    </button>
                </div>
            </div>
        </div>
    )
}