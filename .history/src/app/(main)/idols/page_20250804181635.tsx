export default function IdolsPage() {
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
                    <div className="idol-card bg-white rounded-xl overflow-hidden shadow-md h-80 relative">
                        <div className="relative h-full">
                            <img alt='idol photo' src="/assets/images/1080full-yuna-(itzy).jpg" className="idol-image w-full h-full object-cover"/>
                            <div className="idol-info absolute bottom-0 left-0 right-0 p-4 text-white">
                                <h3 className="text-xl font-bold">Yuna</h3>
                                <p className="text-sm mb-2">ITZY</p>
                                <div className="flex gap-2">
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Leader</span>
                                    <span className="bg-white bg-opacity-20 px-2 py-1 rounded-full text-xs">Main Rapper</span>
                                </div>
                            </div>
                            <div className="absolute top-3 right-3 bg-pink-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-md">
                                6.5M
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}