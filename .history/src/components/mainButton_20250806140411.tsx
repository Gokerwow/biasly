export function MainButton(children: React.ReactNode) {
    return <button className="w-full py-2.5 rounded-lg mainButton font-medium text-sm flex items-center justify-center cursor-pointer text-white transition-all duration-300">
        {children}
    </button>
}