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
      <div className="flex items-center gap-5 pt-5">
        <NewsCard/>
        <NewsCard/>
        <NewsCard/>
        <NewsCard/>
          <button className="w-20 h-20 rounded-full flex flex-col items-center justify-center 
      bg-gradient-to-br from-[#8C5CF5] to-[#DE45A6] text-white
      shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300
      group relative overflow-hidden">
    
    {/* Text */}
    <span className="text-xs font-medium mb-1 group-hover:-translate-y-1 transition-transform">
      VIEW MORE
    </span>
    
    {/* Chevron Icon */}
    <div className="w-4 h-4 relative group-hover:translate-y-1 transition-transform">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 9l6 6 6-6" />
      </svg>
    </div>
    
    {/* Optional: Gradient overlay on hover */}
    <div className="absolute inset-0 bg-gradient-to-br from-[#DE45A6] to-[#8C5CF5] opacity-0 
        group-hover:opacity-100 transition-opacity duration-300 mix-blend-overlay" />
  </button>
      </div>
    </main>
  );
}
