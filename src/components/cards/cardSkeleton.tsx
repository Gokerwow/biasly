// Add this import if you put this in a separate file

export function PrevCardSkeleton() {
    return (
        <div className="relative z-10 flex flex-col items-center">
            {/* 1. Main Container 
                - Matches PrevCard's aspect-[2/3] and min-w-[160px]
                - Uses animate-pulse for the loading effect
            */}
            <div className="relative mx-auto aspect-[2/3] w-full min-w-[160px] overflow-hidden rounded-xl border-[3px] border-gray-800 bg-gray-900 animate-pulse shadow-xl">
                
                {/* 2. Center Placeholder Icon (Optional, gives a visual cue) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <div className="h-16 w-16 rounded-full bg-gray-700" />
                </div>

                {/* 3. Top Right Badge Skeleton */}
                <div className="absolute top-2 right-2 z-30">
                    <div className="h-6 w-16 rounded-md bg-gray-800/80 border border-gray-700/50"></div>
                </div>

                {/* 4. Bottom Info Footer Skeleton */}
                <div className="absolute bottom-0 left-0 w-full z-30">
                    {/* Gradient Fade match */}
                    <div className="h-12 w-full bg-gradient-to-t from-black/90 to-transparent"></div>
                    
                    {/* Text Block match */}
                    <div className="px-4 py-3 border-t border-white/5 bg-black/80 backdrop-blur-md">
                        <div className="flex flex-col gap-2">
                            {/* Title Line (Name) */}
                            <div className="h-4 w-3/4 rounded bg-gray-700/50"></div>
                            
                            {/* Subtitle Line (Idol + User Tag) */}
                            <div className="flex items-center justify-between mt-1">
                                <div className="h-3 w-1/3 rounded bg-gray-800"></div>
                                <div className="h-4 w-12 rounded bg-gray-800 border border-white/5"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}