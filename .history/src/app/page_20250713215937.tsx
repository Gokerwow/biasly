import Image from "next/image";
import NewsCard from "@/components/newsCard";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center items-center py-5">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#9900FF] to-[#EB4899] bg-clip-text text-transparent leading-tight w-fit">Welcome To Biasly!</h1>
        <h3>Your ultimate hub for K-pop rankings, news, and fandom</h3>
      </div>
      <div className="flex items-center border-b-2 border-gray-400 py-2 gap-2">
        <Image
          src="/bolt-solid.svg"
          alt="News Icon"
          width={30}
          height={30}
          className="bg-gradient-to-r from-[#9900FF] to-[#EB4899] bg-clip-text transparent"
        />
        <h1 className="text-xl font-bold">K-POP Breaking News</h1>
      </div>
<div className="flex flex-wrap justify-center gap-5 pt-5 relative pb-12">
  <NewsCard/>
  <NewsCard/>
  <NewsCard/>
  <NewsCard/>
  
  {/* More Button */}
  <div className="w-full flex justify-center mt-6">
    <button className="px-8 py-3 rounded-full text-white font-medium
        bg-gradient-to-r from-[#8C5CF5] to-[#DE45A6] hover:shadow-lg
        transition-all hover:-translate-y-1 active:translate-y-0">
      Load More Articles
    </button>
  </div>
</div>
    </main>
  );
}
