import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[400px] h-[300px] bg-gray-500 relative">
            <div className="aspect-video relative">
                <Image
                src='/assets/images/1080full-yuna-(itzy).jpg'
                alt="News Pic"
                fill
                />
            </div>
        </div>
    )
}