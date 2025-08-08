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
                    <div className="idol-card bg-white rounded-xl overflow-hidden shadow-md h-96 relative">
                        <div className="h-full">
                            <img src="assets/images/1080full-yuna-(itzy).jpg" className="idol-image w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 text-white max-h-[125px] group-hover:max-h-fit transition-all duration-300">
                            <h3 className="text-2xl font-bold">YUNA</h3>
                            <p className="text-emerald-300 mb-3">ITZY</p>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="role-tag bg-pink-600/90 text-white px-3 py-1 rounded-full text-xs">Visual</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-yellow-300" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span>5.2M Followers</span>
                            </div>
                        </div>
                        <div className="absolute top-4 right-4 bg-white text-emerald-500 px-3 py-1 rounded-full text-xs font-bold shadow-md">
                            RISING STAR
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}