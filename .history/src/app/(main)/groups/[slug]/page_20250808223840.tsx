import Image from "next/image";
import { HeartIcon } from "lucide-react";
import { FaFire } from "react-icons/fa";

export default function GroupDetailPage({ params }: { params: { slug: string } }) {
    return (
        <div className="py-18">
            <header className="pt-20 pb-12 relative overflow-hidden">
                <div className="absolute inset-0 hero-gradient opacity-10"></div>
                <div className="container mx-auto px-6">
                    <div className="flex flex-col lg:flex-row items-center gap-12">
                        {/* <!-- Left Content --> */}
                        <div className="lg:w-1/2 text-center lg:text-left animate-slide-up">
                            <div className="flex bg-kpop-pink/10 text-kpop-pink px-4 py-2 rounded-full text-sm font-medium mb-4 border border-kpop-pink/20">
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
                                The world$apos;s biggest K-pop girl group breaking records and hearts worldwide
                            </p>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-600 mb-8">
                                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <i className="fas fa-building text-kpop-pink mr-2"></i>
                                    <span>YG Entertainment</span>
                                </div>
                                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <i className="fas fa-calendar-day text-kpop-purple mr-2"></i>
                                    <span>Since Aug 8, 2016</span>
                                </div>
                                <div className="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                                    <i className="fas fa-users text-kpop-blue mr-2"></i>
                                    <span>4 Members</span>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <button className="px-8 py-4 rounded-full hero-gradient text-white hover:shadow-xl transition-all duration-300 font-semibold flex items-center transform hover:scale-105">
                                    <HeartIcon className="mr-4" /> Follow Group
                                </button>
                                <button className="px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm text-kpop-black hover:bg-white transition-all duration-300 font-semibold flex items-center transform hover:scale-105">
                                    <div className="relative w-8 h-8 mr-4">
                                        <Image
                                            src="/youtube.svg"
                                            alt="youtube icon"
                                            fill
                                        >
                                        </Image> 
                                    </div>
                                    <h2 className="text-kpop-pink">Watch MV&apos;s</h2>
                                </button>
                            </div>
                        </div>

                        {/* <!-- Right Content - Image Grid --> */}
                        <div className="lg:w-1/2 relative">
                            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                                <div className="space-y-4">
                                    <div className="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500">
                                        <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500 delay-100">
                                        <img src="https://images.unsplash.com/photo-1637858868791-7a0b869a00a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK Performance" className="w-full h-32 object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-kpop-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-8">
                                    <div className="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500 delay-200">
                                        <img src="https://images.unsplash.com/photo-1639322537504-3101f4a71d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK Concert" className="w-full h-32 object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-kpop-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                    <div className="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500 delay-300">
                                        <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK Album" className="w-full h-48 object-cover" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-kpop-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>
                                </div>
                            </div>

                            {/* <!-- Floating Stats --> */}
                            <div className="absolute -top-4 -left-4 glass-effect rounded-xl p-4 animate-float">
                                <div className="text-2xl font-bold text-kpop-pink">85.2M</div>
                                <div className="text-xs text-gray-600">YouTube Subs</div>
                            </div>
                            <div className="absolute -bottom-4 -right-4 glass-effect rounded-xl p-4 animate-float" style={{ animationDelay: '1s' }}>
                                <div className="text-2xl font-bold text-kpop-purple">32</div>
                                <div className="text-xs text-gray-600">Music Awards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </div>
    );
}