import Image from 'next/image';
import { Heart } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { UsersRound } from 'lucide-react';
import { Cake } from 'lucide-react';
import { Building } from 'lucide-react';

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
                    <UsersRound size={18} color='#FF2D78' /> 18.2M
                </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">Jisoo</h3>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="role-badge px-2.5 py-1 rounded-full bg-[#00A2FF]/10 text-[#00A2FF] text-xs font-medium">Vocalist</span>
                    <span className="role-badge px-2.5 py-1 rounded-full bg-[#FF2D78]/10 text-[#FF2D78] text-xs font-medium">Visual</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <Cake className='mr-2' />
                        <span>Jan 3, 1995</span>
                    </div>
                    <div className="flex items-center">
                        <Building className='mr-2' />
                        <span>YG</span>
                    </div>
                </div>

                <button class="
  /* Tata Letak & Posisi */
  relative overflow-hidden cursor-pointer
  
  /* Ukuran & Padding */
  py-4 px-8 
  
  /* Tampilan & Warna Dasar */
  border-2 border-white rounded-xl bg-[#ecd448] text-[#131313]
  
  /* Font */
  text-[15px] font-bold
  
  /* Efek & Transisi */
  shadow-[0_2px_0_2px_#000] transition-all duration-300
  
  /* Pseudo-element ::before (elemen oranye yang melintas) */
  before:content-[''] before:absolute before:top-1/2 before:left-0 
  before:w-[100px] before:h-[120%] before:bg-[#ff6700] 
  before:transition-all before:duration-500
  
  /* Transformasi awal untuk ::before */
  before:-translate-y-1/2 before:-translate-x-[150%] before:-skew-x-[30deg]
  
  /* State: Hover */
  hover:bg-[#4cc9f0] hover:text-white hover:shadow-[0_2px_0_2px_#0d3b66]
  
  /* State: Hover untuk ::before (membuatnya melintas) */
  hover:before:translate-x-[150%] hover:before:delay-100
  
  /* State: Active (saat tombol ditekan) */
  active:scale-90
">
                    Shop now
                </button>
            </div>
        </div>
    )
}