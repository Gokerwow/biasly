import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[382px] h-[291px] bg-gray-500 relative">
            <div className="relative overflow-hidden">
                <Image
                className="object-cover"
                src='/assets/images/1080full-yuna-(itzy).jpg'
                alt="News Pic"
                fill
                />
            </div>
        </div>
    )
}