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
            <div className="p-3 flex flex-col gap-1">
                <p className="text-sm">June 15, 2025</p>
                <h3 className="text-md font-bold text-gray-800">
                    Yuna has a relationship with Brillian?!?!
                </h3>
                <p className="text-sm">The popular Yuna From ITZY Kpop Group..</p>
            </div>
        </div>
    )
}