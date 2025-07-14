import Image from "next/image";
import NewsCard from "@/components/newsCard";

export default function Home() {
  return (
    <main>
      <div className="flex flex-col justify-center items-center py-5">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-[#9900FF] to-[#EB4899] bg-clip-text text-transparent leading-tight w-fit">
          Welcome To Biasly!
        </h1>
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
      <div className="flex flex-col items-center gap-8 pt-5">
        <div className="flex gap-5 w-full overflow-x-auto pb-4">
          <NewsCard />
          <NewsCard />
          <NewsCard />
          <NewsCard />
        </div>

        {/* More Button */}
        <button className="px-6 py-2 text-lg font-medium relative group">
          <span className="text-gray-700 group-hover:text-gray-900 transition-colors">
            Show More
          </span>
          <span
            className="absolute left-1/2 -bottom-1 h-0.5 w-0 bg-gradient-to-r from-[#8C5CF5] to-[#DE45A6] 
        transition-all duration-300 group-hover:w-full group-hover:left-0"
          ></span>
        </button>
      </div>
    </main>
  );
}
