// 🎨 COLOR MAPPINGS

export const getRarityGlow = (tier: string | null) => {
    switch (tier) {
        case 'UR': return 'bg-rose-500';    // Red Glow
        case 'SSR': return 'bg-yellow-400'; // Gold Glow
        case 'SR': return 'bg-purple-500';  // Purple Glow
        case 'R': return 'bg-blue-500';     // Blue Glow
        default: return 'bg-gray-500';      // Basic Glow
    }
};

export const getRarityBorder = (tier: string | null) => {
    switch (tier) {
        case 'UR': return 'border-rose-500';
        case 'SSR': return 'border-yellow-400';
        case 'SR': return 'border-purple-400';
        case 'R': return 'border-blue-500';
        default: return 'border-gray-700';
    }
};

export const getRarityText = (tier: string | null) => {
    switch (tier) {
        case 'UR': return 'text-rose-400';
        case 'SSR': return 'text-yellow-400';
        case 'SR': return 'text-purple-400';
        case 'R': return 'text-blue-400';
        default: return 'text-gray-400';
    }
};

export const getShadow = (tier: string | null) => {
    switch (tier) {
        // Red/Rose Shadow for UR
        case 'UR': return 'shadow-[0_0_15px_rgba(244,63,94,0.4)]'; 
        
        // Yellow/Gold Shadow for SSR
        case 'SSR': return 'shadow-[0_0_15px_rgba(250,204,21,0.4)]'; 
        
        // Purple Shadow for SR
        case 'SR': return 'shadow-[0_0_15px_rgba(168,85,247,0.4)]'; 
        
        // Blue Shadow for R
        case 'R': return 'shadow-[0_0_15px_rgba(59,130,246,0.4)]'; 
        
        // Gray/White Shadow for Common
        default: return 'shadow-[0_0_10px_rgba(255,255,255,0.1)]';
    }
};