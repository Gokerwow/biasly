import Image from "next/image"

interface GroupCardsProps {
    name: string,
    agency: string,
    genres: string[],
    imageUrl: string
}

export default function GroupCards({ name, agency, genres, imageUrl }: GroupCardsProps) {
    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-md cursor-pointer hover:shadow-lg transition-shadow duration-300">
            <div className="relative h-60 overflow-hidden">
                <Image
                    src='https://static.wikia.nocookie.net/kpop/images/3/31/1VERSE_The_1st_Verse_group_concept_photo_5.png/revision/latest/scale-to-width-down/268?cb=20250714105525\'
                    alt="Group Photo"
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-4">
                    <h1 className="text-white font-bold text-xl drop-shadow-md">{name}</h1>
                    <h2 className="text-purple-200 text-sm drop-shadow-md">{agency}</h2>
                </div>
                <div className="absolute top-3 right-3">
                    <button aria-label="Tambah ke Favorit" className="p-2 bg-white/60 rounded-full hover:bg-white cursor-pointer transition-colors duration-200 group">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600 group-hover:text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
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
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">5 Members</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                    <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full font-medium">Chic</span>
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full font-medium">Pop</span>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">Elegant</span>
                </div>

                <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            DEBUT
                        </p>
                        <p className="text-sm font-semibold text-gray-800">2019.02.12</p>
                        <p className="text-xs text-purple-600 font-medium">DALLA DALLA</p>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 hover:bg-gray-100 transition-colors">
                        <p className="text-xs text-gray-500 mb-1 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            LATEST
                        </p>
                        <p className="text-sm font-semibold text-gray-800">2023.07.15</p>
                        <p className="text-xs text-purple-600 font-medium">CAKE</p>
                    </div>
                </div>

                <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg text-sm font-semibold transition-colors duration-300 flex items-center justify-center gap-2">
                    View Profile
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    )
}