'use client';
import { Heart, MoveUpRight } from 'lucide-react';
import Image from 'next/image';
import { MainButton } from '@/components/mainButton.tsx';

interface ProductProps {
    id: number;
    name: string;
    price: string;
    image_url: string;
    link: string;
    category?: string;
}

const getStoreName = (url: string) => {
    if (url.includes('shopee')) return 'Shopee';
    if (url.includes('tokopedia')) return 'Tokopedia';
    if (url.includes('amazon')) return 'Amazon';
    if (url.includes('ktown4u')) return 'Ktown4u';
    return 'Store';
};

export const ProductCard: React.FC<ProductProps> = ({
    id,
    name,
    price,
    image_url,
    link
}) => {

    const storeName = getStoreName(link); // Auto-detect store

    return (
        <div className="w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100 flex flex-col">

            {/* --- IMAGE SECTION --- */}
            <div className="relative aspect-square w-full overflow-hidden bg-gray-100 group">
                {/* Like Button */}
                <button
                    className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-sm transition-all duration-300 hover:scale-110 cursor-pointer"
                    onClick={() => console.log('Toggle Like for ID:', id)}
                >
                    <Heart className="w-5 h-5 text-white" />
                </button>

                <Image
                    src={image_url}
                    alt={name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Store Badge (Auto-detected) */}
                <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 text-white text-xs font-bold rounded backdrop-blur-sm">
                    {storeName}
                </span>
            </div>

            {/* --- DETAILS SECTION --- */}
            <div className="p-4 flex-1 flex flex-col gap-3 justify-between">

                <div className="flex justify-between items-start gap-2">
                    {/* Title */}
                    <h3 className="font-bold text-gray-800 text-lg leading-tight line-clamp-2" title={name}>
                        {name}
                    </h3>
                    {/* Price */}
                    <span className="font-bold text-blue-600 text-lg whitespace-nowrap">
                        {price}
                    </span>
                </div>

                {/* --- BUY BUTTON --- */}
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <MainButton>
                        <div className=' flex gap-2 hover:gap-6 items-center transition-all duration-300'>
                            <h1 className='font-bold'>Buy Now</h1>
                            <MoveUpRight size={20}/>
                        </div>
                    </MainButton>
                </a>

            </div>
        </div>
    );
};