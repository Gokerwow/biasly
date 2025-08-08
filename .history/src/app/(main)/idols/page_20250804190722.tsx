import { createClient } from "@/utils/supabase/server";

export default async function IdolsPage() {

    const supabase = await createClient();

    const { data: idolsData, error: selectError } = await supabase
        .from('idols')
        .select('*');

    console.log(idolsData?.map(idol => idol.name));

    return (
        <div className="py-18">
            <header className="w-full bg-gradient-to-r from-[#9900FF] to-[#EB4899]">
                <div className="max-w-7xl py-10 mx-auto text-center">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">K-POP IDOLS GALLERY</h1>
                        <h2 className="text-xl text-purple-100 max-w-3xl mx-auto">Discover and explore your favorite K-Pop idols from various groups</h2>
                    </div>
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <input type="text" placeholder="Search groups..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg" />
                            <svg className="absolute left-4 top-3.5 h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>
            <div className="containerPad">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
<div class="max-w-xs bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform">
  <!-- Gambar Idol -->
  <img 
    class="w-full h-64 object-cover" 
    src="https://via.placeholder.com/300x400/FFB6C1/000000?text=IDOL+PHOTO" 
    alt="Idol Photo"
  >
  
  <!-- Info Card -->
  <div class="p-4 bg-pink-50">
    <div class="flex justify-between items-center">
      <h3 class="text-xl font-bold text-pink-700">Nama Idol</h3>
      <span class="bg-pink-200 text-pink-800 px-2 py-1 rounded-full text-xs font-semibold">Grup</span>
    </div>
    <p class="text-gray-600 mt-1">Main Vocal</p>
  </div>
</div>
                </div>
            </div>
        </div>
    )
}