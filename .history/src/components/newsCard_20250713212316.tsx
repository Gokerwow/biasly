import Image from "next/image";

export default function NewsCard() {
  return (
    <div className="max-w-sm rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 w-full">
        <Image
          src='/assets/images/1080full-yuna-(itzy).jpg'
          alt="News Pic"
          layout="fill"
          objectFit="cover"
          className="hover:scale-105 transition-transform duration-500"
        />
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        {/* Date */}
        <div className="text-sm text-gray-500 mb-2">July 13, 2023</div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
          Exciting News About K-pop Industry Trends in 2023
        </h3>
        
        {/* Subtitle */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          Discover how K-pop continues to dominate global music charts and what trends are emerging this year.
        </p>
        
        {/* CTA Button */}
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
          Read More
        </button>
      </div>
    </div>
  );
}