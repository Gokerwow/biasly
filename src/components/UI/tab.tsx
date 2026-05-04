'use client'

import Link from "next/link"
import { usePathname } from "next/navigation";

interface tabsProps {
    id: string,
    label: string,
    icon: React.ReactNode
    href: string
}

export default function Tabs({ id, label, icon, href }: tabsProps) {
    const pathname = usePathname();
    
    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            key={id}
            href={href}
            className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold uppercase tracking-wider transition-all rounded-full ${
                isActive
                    ? "bg-pink-600 text-white shadow-lg shadow-pink-500/25"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
            }`}
        >
            {icon}
            {label}
        </Link>
    )
}