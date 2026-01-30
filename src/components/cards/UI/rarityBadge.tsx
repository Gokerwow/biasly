export default function RarityBadge({ tier }: { tier: string }) {

    const getStyle = (tier: string) => {
        switch (tier.toUpperCase()) {
            case 'UR':
                // The "Prismatic" Effect
                return "bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white animate-text border-transparent shadow-[0_0_15px_rgba(236,72,153,0.6)]"
            case 'SSR':
                // Gold Foil
                return "bg-gradient-to-b from-yellow-300 to-yellow-600 text-black border-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.4)]"
            case 'SR':
                // Silver Chrome
                return "bg-gradient-to-b from-gray-100 to-gray-400 text-black border-gray-300"
            case 'R':
                // Deep Blue Metallic
                return "bg-[#1e3a8a] text-blue-200 border-blue-500"
            default:
                // Normal (N)
                return "bg-gray-800 text-gray-400 border-gray-700"
        }
    }

    return (
        <span className={`
            inline-flex items-center justify-center text-center rounded px-2 py-0.5 
            text-[13px] font-black italic uppercase border
            ${getStyle(tier)}
        `}>
            {tier}
        </span>
    )
}