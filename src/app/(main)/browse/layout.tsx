"use client"

import { Compass, Album, Disc3 } from "lucide-react"
import Tabs from "@/components/UI/tab"
import { ROUTES } from "@/constants"

interface BrowseLayoutProps {
    children: React.ReactNode
}

const tabs = [
    { id: "releases", label: "Releases", icon: <Album className="h-4 w-4" />, href: ROUTES.BROWSE.RELEASES },
    { id: "groups", label: "Groups", icon: <Disc3 className="h-4 w-4" />, href: ROUTES.BROWSE.GROUPS },
    { id: "idols", label: "Idols", icon: <Album className="h-4 w-4" />, href: ROUTES.BROWSE.IDOLS },
]

export default function BrowseLayout({ children }: BrowseLayoutProps) {
    return (
        <div className="flex flex-col gap-8">
            {/* Navigation Tabs */}
            <nav className="flex items-center gap-3 border-b border-gray-800/50 pb-4">
                <div className="flex items-center gap-2 mr-4">
                    <Compass className="h-6 w-6 text-pink-500" />
                    <span className="text-lg font-black text-white uppercase tracking-tight">Browse</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    {tabs.map((tab) => (
                        <Tabs
                            key={tab.id}
                            id={tab.id}
                            label={tab.label}
                            icon={tab.icon}
                            href={tab.href}
                        />
                    ))}
                </div>
            </nav>

            {/* Page Content */}
            <div className="flex flex-col gap-10">
                {children}
            </div>
        </div>
    )
}