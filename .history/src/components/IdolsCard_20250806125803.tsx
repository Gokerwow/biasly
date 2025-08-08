import Image from 'next/image';

interface IdolsCardProps {
    name: string;
}

export default function IdolsCard({ name }: IdolsCardProps) {
    return (
        <div className="idol-card bg-white rounded-xl overflow-hidden shadow-card hover:shadow-card-hover">
            <div className="relative">
                <img src="https://images.unsplash.com/photo-1639322537504-3101f4a71d4d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" alt="Jisoo" className="w-full h-60 object-cover"/>
                    <div className="absolute inset-0 image-overlay"></div>

                    <div className="absolute top-3 right-3">
                        <button className="w-9 h-9 rounded-full bg-white/90 hover:bg-idol-pink flex items-center justify-center text-gray-700 hover:text-white transition shadow-sm">
                            <i className="far fa-heart text-sm"></i>
                        </button>
                    </div>

                    <div className="absolute bottom-3 left-3 group-label px-3 py-1 rounded-full text-white text-xs font-medium">
                        BLACKPINK
                    </div>

                    <div className="absolute bottom-3 right-3 follower-count px-3 py-1 rounded-full text-gray-800 text-xs font-medium shadow-sm">
                        <i className="fas fa-users mr-1 text-idol-pink"></i> 18.2M
                    </div>
            </div>

            <div className="p-5">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg">Jisoo</h3>
                    <span className="px-2 py-0.5 rounded-full bg-green-100 text-green-800 text-xs">Active</span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                    <span className="role-badge px-2.5 py-1 rounded-full bg-idol-blue/10 text-idol-blue text-xs font-medium">Vocalist</span>
                    <span className="role-badge px-2.5 py-1 rounded-full bg-idol-purple/10 text-idol-purple text-xs font-medium">Visual</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                        <i className="fas fa-birthday-cake mr-2 text-gray-400"></i>
                        <span>Jan 3, 1995</span>
                    </div>
                    <div className="flex items-center">
                        <i className="fas fa-building mr-2 text-gray-400"></i>
                        <span>YG</span>
                    </div>
                </div>

                <button className="w-full py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium text-sm transition flex items-center justify-center">
                    View Full Profile <i className="fas fa-chevron-right ml-2 text-xs"></i>
                </button>
            </div>
        </div>
    )
}