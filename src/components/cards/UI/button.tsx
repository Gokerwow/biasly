interface buttonProps {
    children: React.ReactNode,
    onClick: () => void
}

export const Button = ({children, onClick} : buttonProps) => {
    return (
        <button onClick={onClick} className="flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-2.5 text-sm font-black text-white transition-all hover:bg-pink-500 hover:shadow-[0_0_20px_rgba(236,72,153,0.3)] active:scale-95 uppercase tracking-widest">
            {children}
        </button>
    )
}