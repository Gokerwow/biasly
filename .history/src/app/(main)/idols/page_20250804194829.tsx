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
                    <div className="group bg-white rounded-xl overflow-hidden shadow-md h-96 relative">
                        <div className="h-full">
                            <img src="assets/images/1080full-yuna-(itzy).jpg" className="idol-image w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white max-h-[125px] group-hover:max-h-[300px] transition-all duration-300">
                            <h3 className="text-2xl font-bold">YUNA</h3>
                            <p className="text-emerald-300 mb-3">ITZY</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="role-tag bg-pink-600/90 text-white px-3 py-1 rounded-full text-xs">Visual</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                </svg>
                                <span className="text-sm font-medium ">7.4M Favourites</span>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 shadow-md">
                            <button aria-label="Tambah ke Favorit" className="p-2 bg-white/60 rounded-full hover:bg-white cursor-pointer transition-colors duration-200 group">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 group-hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}