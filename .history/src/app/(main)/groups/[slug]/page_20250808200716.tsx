export default function GroupDetailPage({ params }: { params: { slug: string } }) {
    return (
        <div className="py-18">
                <header class="pt-20 pb-12 relative overflow-hidden">
        <div class="absolute inset-0 hero-gradient opacity-10"></div>
        <div class="container mx-auto px-6">
            <div class="flex flex-col lg:flex-row items-center gap-12">
                <!-- Left Content -->
                <div class="lg:w-1/2 text-center lg:text-left animate-slide-up">
                    <span class="inline-block bg-kpop-pink/10 text-kpop-pink px-4 py-2 rounded-full text-sm font-medium mb-4 border border-kpop-pink/20">
                        <i class="fas fa-fire mr-2"></i>Active Group
                    </span>
                    <h1 class="text-5xl lg:text-7xl font-display font-bold mb-4">
                        <span class="bg-gradient-to-r from-kpop-pink via-kpop-purple to-kpop-blue bg-clip-text text-transparent">
                            BLACK
                        </span>
                        <br>
                        <span class="text-kpop-black">PINK</span>
                    </h1>
                    <p class="text-xl text-gray-600 mb-6 leading-relaxed max-w-lg">
                        The world's biggest K-pop girl group breaking records and hearts worldwide
                    </p>
                    
                    <div class="flex flex-wrap justify-center lg:justify-start gap-4 text-sm text-gray-600 mb-8">
                        <div class="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                            <i class="fas fa-building text-kpop-pink mr-2"></i>
                            <span>YG Entertainment</span>
                        </div>
                        <div class="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                            <i class="fas fa-calendar-day text-kpop-purple mr-2"></i>
                            <span>Since Aug 8, 2016</span>
                        </div>
                        <div class="flex items-center bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full">
                            <i class="fas fa-users text-kpop-blue mr-2"></i>
                            <span>4 Members</span>
                        </div>
                    </div>
                    
                    <div class="flex flex-wrap justify-center lg:justify-start gap-4">
                        <button class="px-8 py-4 rounded-full hero-gradient text-white hover:shadow-xl transition-all duration-300 font-semibold flex items-center transform hover:scale-105">
                            <i class="far fa-heart mr-3"></i> Follow Group
                        </button>
                        <button class="px-8 py-4 rounded-full bg-white/80 backdrop-blur-sm text-kpop-black hover:bg-white transition-all duration-300 font-semibold flex items-center transform hover:scale-105">
                            <i class="fab fa-youtube text-red-500 mr-3"></i> Watch MVs
                        </button>
                    </div>
                </div>
                
                <!-- Right Content - Image Grid -->
                <div class="lg:w-1/2 relative">
                    <div class="grid grid-cols-2 gap-4 max-w-md mx-auto">
                        <div class="space-y-4">
                            <div class="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500">
                                <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK" class="w-full h-48 object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div class="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500 delay-100">
                                <img src="https://images.unsplash.com/photo-1637858868791-7a0b869a00a6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK Performance" class="w-full h-32 object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-kpop-pink/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                        <div class="space-y-4 pt-8">
                            <div class="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500 delay-200">
                                <img src="https://images.unsplash.com/photo-1639322537504-3101f4a71d4d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK Concert" class="w-full h-32 object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-kpop-purple/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                            <div class="relative group overflow-hidden rounded-2xl transform hover:scale-105 transition-all duration-500 delay-300">
                                <img src="https://images.unsplash.com/photo-1639322537228-f710d846310a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" alt="BLACKPINK Album" class="w-full h-48 object-cover">
                                <div class="absolute inset-0 bg-gradient-to-t from-kpop-blue/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Floating Stats -->
                    <div class="absolute -top-4 -left-4 glass-effect rounded-xl p-4 animate-float">
                        <div class="text-2xl font-bold text-kpop-pink">85.2M</div>
                        <div class="text-xs text-gray-600">YouTube Subs</div>
                    </div>
                    <div class="absolute -bottom-4 -right-4 glass-effect rounded-xl p-4 animate-float" style="animation-delay: 1s;">
                        <div class="text-2xl font-bold text-kpop-purple">32</div>
                        <div class="text-xs text-gray-600">Music Awards</div>
                    </div>
                </div>
            </div>
        </div>
    </header>
        </div>
    );
}