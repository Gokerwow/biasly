'use client'

import Image from "next/image";
import { HeartIcon, Building, Calendar } from "lucide-react";
import { FaFire, FaUsers, FaPlay, FaMusic, FaCompactDisc } from "react-icons/fa";
import { useState } from "react";
import { FaSpotify, FaYoutube } from "react-icons/fa";
import IdolsCard from "@/components/IdolsCard";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/thumbnails.css";
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails";
import YoutubeIcon from "@/assets/svgs/youtube.svg";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/ProductCards";
import CustomSelect from "@/components/Dropdown";

const sectionBar = [
    'Overview',
    'Members',
    'Album',
    'Gallery',
    'Shop'
]


export default function GroupDetailPage({ params }: { params: { slug: string } }) {

    const [secBar, setSecBar] = useState('Overview')

    const handleSectionClick = (section: string) => {
        setSecBar(section)
    }

    const dummyProducts = [
        {
            id: 1,
            name: "NewJeans - 2nd EP [Get Up] (Bunny Beach Bag ver.)",
            price: "Rp 355.000",
            image_url: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg",
            link: "https://shopee.co.id/NewJeans-Get-Up-Album",
            category: "Album"
        },
        {
            id: 2,
            name: "aespa - Official Light Stick",
            price: "Rp 650.000",
            image_url: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg",
            link: "https://shopee.co.id/aespa-official-lightstick",
            category: "Lightstick"
        },
        {
            id: 3,
            name: "IVE - I HAVE IVE (The 1st Album) Ver.1",
            price: "$24.99",
            image_url: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg",
            link: "https://www.amazon.com/dp/B0BYJ8K9X",
            category: "Album"
        },
        {
            id: 4,
            name: "TWICE - Ready To Be (Digipack Ver.)",
            price: "Rp 185.000",
            image_url: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg",
            link: "https://www.tokopedia.com/twice-ready-to-be",
            category: "Album"
        },
        {
            id: 5,
            name: "LE SSERAFIM - UNFORGIVEN (Weverse Albums ver.)",
            price: "Rp 150.000",
            image_url: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg",
            link: "https://shopee.co.id/lesserafim-unforgiven",
            category: "Album"
        },
        {
            id: 6,
            name: "BLACKPINK - Born Pink World Tour T-Shirt",
            price: "$35.00",
            image_url: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg",
            link: "https://shop.blackpinkmusic.com/products/tour-tee",
            category: "Merch"
        },
    ];

    const photos = [
        { src: "/assets/images/1080full-yuna-(itzy).jpg" },
        { src: "/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg" },
        { src: "/assets/images/ITZY_Yuna_Girls_Will_Be_Girls_concept_photo_5.png" },
        { src: "/assets/images/220715-ITZY-Yuna-Music-Bank-Commute-documents-5(2).jpeg" },
        { src: "/assets/images/YUNA-x-VIEWMAP-documents-1.jpeg" },
        { src: "/assets/images/YUNA-x-VIEWMAP-documents-1.jpeg" },
        { src: "/assets/images/YUNA-x-VIEWMAP-documents-1.jpeg" },
        { src: "/assets/images/yunaaa.jpg" },
    ];

    const [open, setOpen] = useState(false);
    const [index, setIndex] = useState(0);

    const idolExample = {
        id: 1,
        name: "ITZY"
    };


    return (
        <div className="py-18">
            <header className="py-12 relative overflow-hidden">
                <div className="absolute inset-0 hero-gradient opacity-10 -z-[1]"></div>
                <div className="container mx-auto ">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* <!-- Left Content --> */}
                        <div className="lg:w-1/2 text-center lg:text-left animate-slide-up">
                            <div className="flex justify-center items-center gap-2 w-fit bg-kpop-pink/10 text-kpop-pink px-4 py-2 rounded-full text-sm font-medium mb-4 border border-kpop-pink/20">
                                <FaFire />
                                <span>Active Group</span>
                            </div>
                            <h1 className="text-5xl lg:text-7xl font-display font-bold mb-4">
                                <span className="bg-gradient-to-r from-kpop-pink via-kpop-purple to-kpop-blue bg-clip-text text-transparent">
                                    BLACK
                                </span>
                                <br />
                                <span className="text-kpop-black">PINK</span>
                            </h1>
                            <p className="text-xl text-gray-600 mb-6 leading-relaxed max-w-lg">
                                The world&apos;s biggest K-pop girl group breaking records and hearts worldwide
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-600 mb-8">
                                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Building className="mr-2" />
                                    <span>YG Entertainment</span>
                                </div>
                                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <Calendar className="mr-2" />
                                    <span>Since Aug 8, 2016</span>
                                </div>
                                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <FaUsers size={20} className="mr-2" />
                                    <span>4 Members</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <button className="px-8 py-4 rounded-full hero-gradient text-white transition-all duration-300 font-semibold flex items-center cursor-pointer transform hover:scale-105">
                                    <HeartIcon className="mr-4" /> Follow Group
                                </button>
                                <button className="px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm text-kpop-black hover:bg-white transition-all duration-300 font-semibold flex items-center transform hover:scale-105 cursor-pointer">
                                    <div className="relative w-8 h-8 mr-4">
                                        <YoutubeIcon className="w-full h-full" />
                                    </div>
                                    <h2 className="text-kpop-pink">Watch MV&apos;s</h2>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Right Content - Image Grid --> */}
                        <div className="lg:w-1/2 relative">
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="relative aspect-[3/2] w-[600px] shadow-md hover:shadow-xl group transition-all duration-300 overflow-hidden">
                                    <Image
                                        src='/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg'
                                        alt="group photo"
                                        fill
                                        className="object-cover object-center group-hover:scale-110 transition-all duration-300"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <main className="container mx-auto py-12">
                <ul className="flex gap-8  px-6 justify-center">
                    {sectionBar.map((section, index) =>
                        <li key={index} onClick={() => handleSectionClick(section)} className={`p-2 transition-all duration-300 font-semibold border-b-4 ${secBar === section ? 'border-kpop-pink text-kpop-pink' : 'cursor-pointer border-transparent'}`}>
                            <span>{section}</span>
                        </li>
                    )}
                </ul>
                {/* Overview Tab */}
                {secBar === 'Overview' &&
                    <div>
                        <div className="p-6">
                            <div className="grid grid-cols-3 gap-5">
                                <div className="col-span-2">
                                    <h1 className="font-display text-3xl font-bold mb-6 bg-gradient-to-r from-kpop-pink to-kpop-purple bg-clip-text text-transparent">About BLACKPINK</h1>
                                    <div className="prose prose-lg text-gray-700 space-y-4">
                                        <p>BLACKPINK (블랙핑크) is a South Korean girl group formed by YG Entertainment, consisting of members Jisoo, Jennie, Rosé, and Lisa. The group debuted on August 8, 2016, with their single album "Square One".</p>
                                        <p>BLACKPINK is the highest-charting female K-pop act on the Billboard Hot 100, peaking at number 13 with "Ice Cream" (2020), and on the Billboard 200, peaking at number one with their first Korean-language studio album, "The Album" (2020).</p>
                                        <p>They were the first K-pop girl group to perform at Coachella and are the most-subscribed music artist on YouTube.</p>
                                    </div>
                                </div>
                                <div className="bg-white py-5">
                                    <h1 className="text-xl font-bold text-center">Quick Facts</h1>
                                    <div className="space-y-6">
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-1">Korean Name</p>
                                            <p className="font-bold text-lg">블랙핑크</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-1">Debut Date</p>
                                            <p className="font-bold text-lg">August 8, 2016</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-1">Fandom Name</p>
                                            <p className="font-bold text-lg text-kpop-pink">BLINK</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm text-gray-500 mb-2">Official Colors</p>
                                            <div className="flex justify-center space-x-3">
                                                <span className="w-8 h-8 rounded-full bg-black shadow-lg"></span>
                                                <span className="w-8 h-8 rounded-full bg-pink-500 shadow-lg"></span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <!-- Quick Stats --> */}
                        <section className="py-12">
                            <div className="container mx-auto px-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="stats-card rounded-2xl p-6 text-center border bg-[#f7eafe] border-white/50 hover:bg-[#8a2be233] hover:-translate-y-3 transition-all duration-200">
                                        <div className="text-3xl font-bold text-kpop-pink mb-2">4</div>
                                        <p className="text-sm text-gray-600 font-medium">Studio Albums</p>
                                    </div>
                                    <div className="stats-card rounded-2xl p-6 text-center border bg-[#f7eafe] border-white/50 hover:bg-[#8a2be233] hover:-translate-y-3 transition-all duration-200">
                                        <div className="text-3xl font-bold text-kpop-purple mb-2">32</div>
                                        <p className="text-sm text-gray-600 font-medium">Music Show Wins</p>
                                    </div>
                                    <div className="stats-card rounded-2xl p-6 text-center border bg-[#f7eafe] border-white/50 hover:bg-[#8a2be233] hover:-translate-y-3 transition-all duration-200">
                                        <div className="text-3xl font-bold text-kpop-blue mb-2">85.2M</div>
                                        <p className="text-sm text-gray-600 font-medium">YouTube Subs</p>
                                    </div>
                                    <div className="stats-card rounded-2xl p-6 text-center border bg-[#f7eafe] border-white/50 hover:bg-[#8a2be233] hover:-translate-y-3 transition-all duration-200">
                                        <div className="text-3xl font-bold text-kpop-pink mb-2">6</div>
                                        <p className="text-sm text-gray-600 font-medium">Guinness Records</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                        {/* <!-- Latest Release --> */}
                        <section className="py-12">
                            <h2 className="font-display text-3xl font-bold mb-8 text-center">Latest Release</h2>
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-kpop-pink/10 to-kpop-purple/10 border border-white/30">
                                <div className="flex flex-col lg:flex-row">
                                    <div className="lg:w-1/3 relative">
                                        <Image src="/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg" alt="BORN PINK" fill className="w-full h-64 lg:h-full object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                                    </div>
                                    <div className="lg:w-2/3 p-8 lg:p-12">
                                        <span className="inline-block bg-kpop-pink text-white px-4 py-2 rounded-full text-sm font-medium mb-4">
                                            <i className="fas fa-fire mr-2"></i>NEW RELEASE
                                        </span>
                                        <h3 className="font-display text-3xl font-bold mb-3">BORN PINK</h3>
                                        <p className="text-gray-600 mb-6">Released: September 16, 2022 | 8 Songs</p>
                                        <p className="text-gray-700 mb-8 leading-relaxed">BLACKPINK&apos;s second studio album &quot;BORN PINK&quot; features the hit singles &quot;Pink Venom&quot; and &quot;Shut Down&quot;. The album debuted at #1 on the Billboard 200, making BLACKPINK the first female K-pop act to top the chart twice.</p>
                                        <div className="flex flex-wrap gap-4">
                                            <button className="px-6 py-3 rounded-full bg-green-500 text-white hover:bg-green-600 transition-all duration-300 font-medium flex items-center gap-4 transform hover:scale-105 cursor-pointer">
                                                <FaSpotify /> Spotify
                                            </button>
                                            <button className="px-6 py-3 rounded-full bg-red-500 text-white hover:bg-red-800 transition-all duration-300 font-medium flex items-center gap-4 transform hover:scale-105 cursor-pointer">
                                                <FaYoutube /> YouTube
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                }

                {/* Members Tab */}
                {secBar === 'Members' &&
                    <div className="py-12">
                        <h2 className="font-display text-3xl font-bold mb-8 text-center bg-gradient-to-r from-kpop-pink to-kpop-purple bg-clip-text text-transparent">Meet the Members</h2>
                        <div className="grid grid-cols-4 gap-5">
                            <IdolsCard
                                name="Yuna"
                                groups={idolExample}
                            />
                            <IdolsCard
                                name="Yuna"
                                groups={idolExample}
                            />
                            <IdolsCard
                                name="Yuna"
                                groups={idolExample}
                            />
                            <IdolsCard
                                name="Yuna"
                                groups={idolExample}
                            />
                        </div>
                    </div>
                }

                {secBar === 'Album' &&
                    <div className="tab-content py-12">
                        <h2 className="font-display text-3xl font-bold mb-8 text-center bg-gradient-to-r from-kpop-purple to-kpop-blue bg-clip-text text-transparent">Albums</h2>

                        <div className="mb-12">
                            <h3 className="font-bold text-xl mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-kpop-pink flex items-center justify-center text-white text-sm mr-3">
                                    <FaCompactDisc />
                                </span>
                                Studio Albums
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div className="album-card glass-effect rounded-2xl overflow-hidden border border-white/30 cursor-pointer group">
                                    <div className="relative overflow-hidden">
                                        <Image src="/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg" fill alt="THE ALBUM" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <button className="bg-white/20 backdrop-blur-sm rounded-full p-4 text-white hover:bg-white/30 transition-all">
                                                <FaPlay />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-semibold text-lg mb-1">THE ALBUM</h4>
                                        <p className="text-sm text-gray-600">2020 • 8 Tracks</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-12">
                            <h3 className="font-bold text-xl mb-6 flex items-center">
                                <span className="w-8 h-8 rounded-full bg-kpop-purple flex items-center justify-center text-white text-sm mr-3">
                                    <FaMusic />
                                </span>
                                Single Albums
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                <div className="album-card glass-effect rounded-xl overflow-hidden border border-white/30 cursor-pointer group">
                                    <div className="relative overflow-hidden">
                                        <img src="/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg" alt="SQUARE ONE" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-kpop-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm mb-1">SQUARE ONE</h4>
                                        <p className="text-xs text-gray-600">2016 • 2 Tracks</p>
                                    </div>
                                </div>
                                <div className="album-card glass-effect rounded-xl overflow-hidden border border-white/30 cursor-pointer group">
                                    <div className="relative overflow-hidden">
                                        <img src="/assets/images/221218-ITZY-Yuna-documents-1(2).jpeg" alt="SQUARE TWO" className="w-full aspect-square object-cover group-hover:scale-110 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-kpop-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-medium text-sm mb-1">SQUARE TWO</h4>
                                        <p className="text-xs text-gray-600">2016 • 2 Tracks</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {secBar === 'Gallery' &&
                    <div className="py-12">
                        <h2 className="font-display text-3xl font-bold mb-8 text-center bg-gradient-to-r from-kpop-blue to-kpop-pink bg-clip-text text-transparent">Photo Gallery</h2>

                        <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4 p-4 justify-center">
                            {photos.map((photo, index) =>
                                <div key={index} className="w-full relative aspect-square overflow-hidden rounded-lg shadow-md cursor-pointer hover:shadow-lg group transition-all duration-300" onClick={() => {
                                    setIndex(index);
                                    setOpen(true);
                                }}>
                                    <Image
                                        alt={`photo-${index}`}
                                        src={photo.src}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-all duration-300"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50 opacity-0 group-hover:opacity-50 transition-all duration-300"></div>
                                </div>
                            )}
                        </div>

                        <Lightbox
                            open={open}
                            close={() => setOpen(false)}
                            index={index}
                            slides={photos}
                            plugins={[Thumbnails]}
                        />
                    </div>
                }

                {secBar === 'Shop' &&
                    <div className="py-12 relative">
                        <div className="flex justify-between">
                            <h1>147 Items Found</h1>
                            <CustomSelect />
                        </div>
                        <div className="grid grid-cols-4 gap-6 mt-12">
                            {dummyProducts.map((product) => (
                                <ProductCard 
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                image_url={product.image_url}
                                link={product.link}
                                />
                            ))}
                        </div>
                        <div>

                        </div>
                    </div>
                }
            </main >
        </div >
    );
}