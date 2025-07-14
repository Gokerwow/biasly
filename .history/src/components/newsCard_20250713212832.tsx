import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[382px] h-[291px] bg-white relative rounded-lg shadow-lg">
            {/* Image */}
            <div className="w-full h-48 relative overflow-hidden">
                <Image
                className="object-cover"
                src='/assets/images/1080full-yuna-(itzy).jpg'
                alt="News Pic"
                fill
                />
            </div>

            {/* CONTENT */}
            <div>
                <p>June 15, 2025</p>
                          <h3 className="text-xl font-bold text-gray-800 mb-2">
            Yuna has a relationship with Brillian?!?!
          </h3>
            </div>
        </div>
    )
}