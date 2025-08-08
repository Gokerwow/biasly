interface MainButtonProps {
    children: React.ReactNode;
}

export function MainButton({ children }: MainButtonProps) {
    return <button className="w-full py-2.5 rounded-lg mainButton font-medium text-sm flex items-center justify-center cursor-pointer text-white transition-all duration-300">
        {children}
    </button>
}