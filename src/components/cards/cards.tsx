'use client'

import { useRouter } from 'next/navigation' 

interface CardProps {
    id: number;
    name: string;
    image_url: string;
    rarity: string;
    price: string;
    status: string;
}

const STATUS_STYLES = {
    owned: "bg-green-500/10 text-green-400 border-green-500/20",
    wishlist: "bg-pink-500/10 text-pink-400 border-pink-500/20",
    trading: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function CardItem({id, name, image_url, rarity, price, status }: CardProps) {
    const router = useRouter() //

    const currentStatus = (status?.toLowerCase() || 'owned') as keyof typeof STATUS_STYLES;
    const statusClasses = STATUS_STYLES[currentStatus];

    const handleNavigation = (id : number) => {
        router.push(`/collection/${id}`)
    }

    return (
        <div onClick={() => handleNavigation(id)} className="group relative overflow-hidden rounded-2xl border border-gray-800 bg-[#161B22] transition-all hover:-translate-y-1 hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/10 cursor-pointer">
            {/* Image */}
            <div className="aspect-[3/4] w-full overflow-hidden bg-gray-800">
                <img src='https://kzcucrksqzdypkmlviex.supabase.co/storage/v1/object/public/Cards/WhatsApp%20Image%202025-12-21%20at%209.57.33%20AM%20(2).jpeg' alt={name} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />
            </div>

            {/* Card Info */}
            <div className="p-4">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-xs font-bold text-pink-500 uppercase">{rarity}</p>
                        <h4 className="mt-1 font-bold text-white text-sm">{name}</h4>
                    </div>
                    <span className={`shrink-0 border px-2.5 py-0.5 text-[10px] font-bold uppercase rounded-full backdrop-blur-md ${statusClasses}`}>
                        {status}
                    </span>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-black/30 p-2">
                    <span className="text-xs text-gray-400">Market Price</span>
                    <span className="text-sm font-bold text-white">{price}</span>
                </div>
            </div>
        </div>
    );
}