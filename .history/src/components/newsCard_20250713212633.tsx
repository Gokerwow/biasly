import Image from "next/image";

export default function NewsCard() {
    return (
        <div className="w-[382px] h-[291px] bg-white rounded-lg overflow-hidden shadow-md">
            {/* Image Section - Top Half */}
            <div className="w-full h-1/2 relative overflow-hidden">
                <Image
                    src='/assets/images/1080full-yuna-(itzy).jpg'
                    alt="Yuna from ITZY"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                />
            </div>

            {/* Content Section - Bottom Half */}
            <div className="p-4 h-1/2 flex flex-col justify-between">
                <div>
                    {/* Date */}
                    <p className="text-sm text-gray-500 mb-1">June 15, 2025</p>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        Yuna has a relationship with Brillian?!?!
                    </h3>

                    {/* Subtitle */}
                    <p className="text-gray-600 text-sm">
                        The popular Yuna From ITZY Kpop Group...
                    </p>
                </div>

                {/* CTA Button */}
                <button className="self-start mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">
                    Read More
                </button>
            </div>
        </div>
    );
}