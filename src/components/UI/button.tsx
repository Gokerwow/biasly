interface buttonProps {
    children: React.ReactNode,
    variant?: 'outline' | 'default',
    onClick: () => void
    disabled?: boolean
    className?: string
}

export const Button = ({ children, onClick, variant = 'default', disabled = false, className }: buttonProps) => {
    const variantStyles = {
        default: "bg-pink-600 text-white hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] ",
        outline: "border-2 border-pink-600 text-pink-500 bg-transparent"
    }

    return (
        <button onClick={onClick} disabled={disabled} className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-black transition-all ${variantStyles[variant]} ${className} active:scale-95 uppercase tracking-widest cursor-pointer`}>
            {children}
        </button>
    )
}