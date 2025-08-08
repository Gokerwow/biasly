import Image from 'next/image';
import { Heart } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { UsersRound } from 'lucide-react';

interface IdolsCardProps {
    name: string;
}

export default function IdolsCard({ name }: IdolsCardProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-card-hover hover:-translate-y-5 transition-all duration-200 hover:shadow-lg">
            <div className="relative">
                <div className="w-full h-60">
                    <Image src="/assets/images/1080full-yuna-(itzy).jpg" alt="Jisoo" fill className="object-cover" />
                </div>
                <div className="absolute inset-0 image-overlay"></div>

                <div className="absolute top-3 right-3">
                    <button aria-label='favourite button' className="w-8 h-8 rounded-full bg-white/90 hover:bg-[#FF2D78] flex items-center justify-center text-gray-700 hover:text-white transition shadow-sm cursor-pointer">
                        <Heart size={15} />
                    </button>
                </div>

                <div className="absolute bottom-3 left-3 group-label px-3 py-1 rounded-full text-white text-xs font-medium">
                    BLACKPINK
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 flex justify-center items-center rounded-full text-gray-800 text-xs font-medium shadow-sm bg-[linear-gradient(135deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.8)_100%)]">
                    <UsersRound size={10}/> 18.2M
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">Jisoo</h3>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="role-badge px-2.5 py-1 rounded-full bg-idol-blue/10 text-idol-blue text-xs font-medium">Vocalist</span>
                    <span className="role-badge px-2.5 py-1 rounded-full bg-idol-purple/10 text-idol-purple text-xs font-medium">Visual</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <i className="fas fa-birthday-cake mr-2 text-gray-400"></i>
                        <span>Jan 3, 1995</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-gray-400"></i>
                        <span>YG</span>
                    </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition flex items-center justify-center cursor-pointer">
                    View Full Profile <ChevronRight size={20}/>
                </button>
            </div>
        </div>
    )
}