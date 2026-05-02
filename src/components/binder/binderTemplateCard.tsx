import { getOptimizedImageUrl } from "@/helper/cloudinary"
import { TemplatesWithAuthor } from "@/types/templates"
import { BadgeCheck, Layers, Star, User } from "lucide-react"
import Image from "next/image"

export function BinderTemplateCard({ 
    template, 
    onSelect 
}: { 
    template: TemplatesWithAuthor
    onSelect: (template: TemplatesWithAuthor) => void
}) {
    return (
        <button
            onClick={() => onSelect(template)}
            className={`
                group relative flex flex-col w-full text-left overflow-hidden rounded-2xl border bg-[#0F1318] transition-all duration-300 
                hover:-translate-y-1 
                ${template.is_official 
                    ? 'border-gray-700 hover:border-pink-500/60 hover:shadow-[0_12px_40px_-15px_rgba(236,72,153,0.3)]' 
                    : 'border-gray-800/80 hover:border-gray-600 hover:shadow-2xl'
                }
            `}
        >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-900">
                <Image
                    src={getOptimizedImageUrl(template.cover_url) ?? ''}
                    alt={template.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${template.theme_color} to-transparent z-10`} />

                <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10">
                    {template.is_official ? (
                        <span className="flex items-center gap-1.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 px-2.5 py-1 text-xs font-bold text-blue-400 shadow-sm">
                            <BadgeCheck className="h-3.5 w-3.5" />
                            Official Tracker
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 text-xs font-semibold text-gray-300 shadow-sm">
                            <User className="h-3 w-3" />
                            {template.author.username}  {/* change to author ddata  */}
                        </span>
                    )}

                    {/* {!template.is_official && template.rating && (
                        <span className="flex items-center gap-1 rounded-full bg-black/40 backdrop-blur-md px-2 py-1 text-[11px] font-bold text-yellow-500">
                            <Star className="h-3 w-3 fill-yellow-500" />
                            {template.rating}
                        </span>
                    )} */}
                </div>

                <div className="absolute bottom-3 left-4 flex items-center gap-1.5 z-10">
                    <Layers className="h-4 w-4 text-white/80" />
                    <span className="text-xl font-black text-white tracking-tight">
                        {template.total_cards}
                    </span>
                    <span className="text-xs font-medium text-white/60 mt-1">Cards</span>
                </div>
            </div>

            <div className="relative flex flex-col flex-1 p-5">
                <div className="mb-2">
                    <span className="inline-block rounded-full bg-gray-800/60 px-2.5 py-0.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider border border-gray-700/50">
                        {template.category || 'No Category'}
                    </span>
                </div>

                <div className="flex-1 mb-4">
                    <h3 className="text-lg font-bold text-white tracking-tight group-hover:text-pink-400 transition-colors mb-1.5 line-clamp-1">
                        {template.name || '-'}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">
                        {template.description || '-'}
                    </p>
                </div>

                <div className="pt-4 border-t border-gray-800/60">
                    <div className="flex flex-wrap gap-1.5">
                        {template.breakdown && template.breakdown.slice(0, 3).map((item, idx) => (
                            <span 
                                key={idx}
                                className="text-xs font-medium text-gray-300 bg-gray-800/40 px-2 py-1 rounded-md"
                            >
                                {item}
                            </span>
                        ))}
                        {template.breakdown && template.breakdown.length > 3 && (
                            <span className="text-xs font-medium text-gray-500 flex items-center px-1">
                                +{template.breakdown.length - 3}
                            </span>
                        )}
                    </div>
                </div>

                <div className={`absolute bottom-0 left-0 right-0 h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${template.is_official ? 'bg-gradient-to-r from-blue-500 to-pink-500' : 'bg-gray-600'}`} />
            </div>
        </button>
    )
}