import React from 'react';
import {
    X,
    CheckCircle2,
    AlertTriangle,
    Info,
    AlertOctagon,
    Sparkles
} from 'lucide-react';

// Enhanced Configuration with Better Visibility
const toastVariants = {
    success: {
        icon: CheckCircle2,
        // Brighter green with enhanced glow and gradient border
        base: "bg-gradient-to-br from-emerald-950/60 to-emerald-900/40 border-2 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.25),0_0_50px_rgba(16,185,129,0.1)]",
        accent: "text-emerald-300",
        iconBg: "bg-emerald-500/20",
        button: "hover:bg-emerald-500/30 text-emerald-200 hover:text-emerald-100",
        glow: "bg-emerald-400"
    },
    error: {
        icon: AlertOctagon,
        // Brighter red with enhanced glow and gradient border
        base: "bg-gradient-to-br from-rose-950/60 to-rose-900/40 border-2 border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.25),0_0_50px_rgba(244,63,94,0.1)]",
        accent: "text-rose-300",
        iconBg: "bg-rose-500/20",
        button: "hover:bg-rose-500/30 text-rose-200 hover:text-rose-100",
        glow: "bg-rose-400"
    },
    warning: {
        icon: AlertTriangle,
        // Brighter amber with enhanced glow and gradient border
        base: "bg-gradient-to-br from-amber-950/60 to-amber-900/40 border-2 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.25),0_0_50px_rgba(245,158,11,0.1)]",
        accent: "text-amber-300",
        iconBg: "bg-amber-500/20",
        button: "hover:bg-amber-500/30 text-amber-200 hover:text-amber-100",
        glow: "bg-amber-400"
    },
    info: {
        icon: Info,
        // Brighter blue with enhanced glow and gradient border
        base: "bg-gradient-to-br from-blue-950/60 to-blue-900/40 border-2 border-blue-500/40 shadow-[0_0_25px_rgba(59,130,246,0.25),0_0_50px_rgba(59,130,246,0.1)]",
        accent: "text-blue-300",
        iconBg: "bg-blue-500/20",
        button: "hover:bg-blue-500/30 text-blue-200 hover:text-blue-100",
        glow: "bg-blue-400"
    },
    default: {
        icon: Sparkles,
        // Enhanced dark with purple/cyan gradient accent
        base: "bg-gradient-to-br from-slate-900/95 to-slate-800/90 border-2 border-purple-500/30 shadow-[0_0_25px_rgba(168,85,247,0.2),0_0_50px_rgba(168,85,247,0.08)]",
        accent: "text-purple-300",
        iconBg: "bg-purple-500/20",
        button: "hover:bg-purple-500/20 text-gray-300 hover:text-white",
        glow: "bg-purple-400"
    }
};

type ToastType = 'info' | 'success' | 'warning' | 'error' | 'default';

interface CustomToasterProps {
    closeToast?: () => void;
    toastProps?: {
        type?: ToastType;
        data?: {
            title?: string;
            message?: string;
            onRetry?: () => void;
        }
    };
    children?: React.ReactNode;
}

const CustomToaster = ({ closeToast, toastProps, children }: CustomToasterProps) => {
    const type = (toastProps?.type as ToastType) || 'default';
    const styles = toastVariants[type];
    const Icon = styles.icon;

    const title = toastProps?.data?.title || (typeof children === 'string' ? children : 'Notification');
    const message = toastProps?.data?.message || '';
    const onRetry = toastProps?.data?.onRetry;

    return (
        <div className={`
            relative w-full max-w-[380px] flex items-center gap-3 p-4 rounded-2xl border backdrop-blur-xl overflow-hidden transition-all
            ${styles.base}
            animate-[slideIn_0.3s_ease-out]
            `}>

            {/* Animated Shimmer Effect on Border */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                <div className={`absolute inset-0 opacity-30 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_ease-in-out_infinite]`} 
                     style={{
                         backgroundSize: '200% 100%',
                         animation: 'shimmer 2s ease-in-out infinite'
                     }}
                />
            </div>

            {/* Enhanced Icon Section with Background Circle */}
            <div className={`relative shrink-0 p-2 rounded-lg ${styles.iconBg} ${styles.accent}`}>
                <Icon size={20} strokeWidth={2.5} className="relative z-10" />
                {/* Pulsing glow behind icon */}
                <div className={`absolute inset-0 rounded-lg ${styles.glow} opacity-20 blur-md animate-pulse`} />
            </div>

            {/* Content Section with Enhanced Typography */}
            <div className="flex-1 flex flex-col gap-1.5 relative z-10">
                {/* Brighter, more visible title */}
                <h4 className={`text-sm font-bold tracking-wide ${type === 'default' ? 'text-white' : styles.accent} drop-shadow-sm`}>
                    {title}
                </h4>
                
                {message && (
                    // Brighter message text with better contrast
                    <p className="text-xs text-gray-300 font-medium leading-relaxed">
                        {message}
                    </p>
                )}

                {/* Enhanced Action Button */}
                {onRetry && (
                    <button
                        onClick={(e) => { e.stopPropagation(); onRetry(); }}
                        className={`
                            mt-2 w-fit px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider 
                            rounded-lg border-2 border-current
                            transition-all duration-200 transform hover:scale-105
                            shadow-lg hover:shadow-xl
                            ${styles.accent} ${styles.button}
                        `}
                    >
                        Retry Action
                    </button>
                )}
            </div>

            {/* Enhanced Close Button */}
            <button
                onClick={closeToast}
                className={`
                    absolute top-3 right-3 p-1.5 rounded-full 
                    transition-all duration-200 transform hover:scale-110 hover:rotate-90
                    ${styles.button}
                    border border-transparent hover:border-current/30
                `}
            >
                <X size={14} strokeWidth={2.5} />
            </button>

            {/* Multiple Glow Layers for Enhanced Depth */}
            <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-30 pointer-events-none ${styles.glow}`} />
            <div className={`absolute -top-6 -left-6 w-20 h-20 rounded-full blur-2xl opacity-20 pointer-events-none ${styles.glow}`} />
            
            {/* Accent Line at Bottom */}
            <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${styles.glow} opacity-50`} />
        </div>
    );
};


export default CustomToaster;