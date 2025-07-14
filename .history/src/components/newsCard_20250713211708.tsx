import Image from "next/image"

export default function NewsCard() {
    return (
        <div className="w-[300px] h-[500px] relative">
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