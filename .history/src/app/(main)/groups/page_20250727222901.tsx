import { createClient } from "@/utils/supabase/server"
import Image from "next/image";

export default async function GroupsPage({ searchParams }: {
    searchParams: { page?: string };
}) {


    const currentPage = parseInt(searchParams.page || '1', 10)
    const itemsPerPage = 50;

    const from = (currentPage - 1) * itemsPerPage
    const to = from + itemsPerPage - 1

    const supabase = await createClient()

    const { data: GroupsData, error: selectError } = await supabase
        .from('groups')
        .select('*')
        .range(from, to)
        .order('name', { ascending: true });

    if (selectError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    return (
        <div className="pt-18">
            <header className="w-full bg-gradient-to-r from-[#9900FF] to-[#EB4899]">
                <div className="max-w-7xl py-10 mx-auto text-center">
                    <div className="text-white">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Explore K-Pop Groups</h1>
                        <h2 className="text-xl text-purple-100 max-w-3xl mx-auto">Discover your favorite groups and find new biases</h2>
                    </div>
                    <div className="mt-8 max-w-md mx-auto">
                        <div className="relative">
                            <input type="text" placeholder="Search groups..." className="w-full pl-12 pr-4 py-3 rounded-full bg-white/90 focus:outline-none focus:ring-2 focus:ring-purple-300 shadow-lg" />
                            <svg className="absolute left-4 top-3.5 h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                        </div>
                    </div>
                </div>
            </header>
            <main className="containerPad">
                {/* <!-- Sort Options --> */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-800">Popular Groups</h2>
                    <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-2">Sort by:</span>
                        <select className="bg-white border border-gray-300 rounded-full px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500">
                            <option>Popularity</option>
                            <option>Newest</option>
                            <option>Alphabetical</option>
                        </select>
                    </div>
                </div>
                <div className="grid grid-cols-4">
                    <div className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer">
                        <div className="relative h-60 overflow-hidden">
                            <Image
                                src={'/assets/images/1080full-yuna-(itzy).jpg'}
                                alt="Group Photo"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 p-4">
                                <h1 className="text-white font-bold text-xl">ITZY</h1>
                                <h2 className="text-purple-200 text-sm">JYP entertainment</h2>
                            </div>
                            <div className="absolute top-3 right-3">
                                <button className="p-2 bg-white/60 rounded-full hover:bg-white cursor-pointer transition-colors duration-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500 mr-1" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                                    </svg>
                                    <span className="text-sm font-medium text-gray-700">7.4M Favourites</span>
                                </div>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">5 Members</span>
                            </div>
                            <div className="flex flex-wrap gap-2 mb-3">
                                <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">Chic</span>
                                <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">Pop</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Elegant</span>
                            </div>
<div className="mb-3 grid grid-cols-2 gap-3">
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500 mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            DEBUT
        </p>
        <p className="text-sm font-semibold">2019.02.12</p>
        <p className="text-xs text-purple-600">DALLA DALLA</p>
    </div>
    
    <div className="bg-gray-50 p-3 rounded-lg">
        <p className="text-xs text-gray-500 mb-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            LATEST
        </p>
        <p className="text-sm font-semibold">2023.07.15</p>
        <p className="text-xs text-purple-600">CAKE</p>
    </div>
</div>
                            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition">
                                View Profile
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}