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
      <div className="flex justify-between items-center pt-5">
        <NewsCard 
        imageUrl={"/assets/images/1080full-yuna-(itzy).jpg"}
        alt={"picture"}
        date={"22 June 2025"}
        title="Yuna has a relationship with Brillian?!?!"
        subTitle="The popular Yuna from ITZY Kpop Group spotted in Seoul."
        />
        <NewsCard />
        <NewsCard />
        <NewsCard />
        {/* Right-pointing chevron circle button */}
        <button className="w-16 h-16 rounded-full flex items-center justify-center 
      bg-gradient-to-r from-[#8C5CF5] to-[#DE45A6] hover:from-[#7B4CE5] hover:to-[#D33A9A]
      shadow-lg hover:shadow-xl transition-all duration-300 group ml-2">

          {/* Right chevron icon */}
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className="text-white group-hover:translate-x-1 transition-transform"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </main>
  );
}
