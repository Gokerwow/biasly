'use client'

import SideBar from '@/components/UI/sidebar';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

export default function DashboardLayout({ children, topBar }: { children: React.ReactNode, topBar: React.ReactNode }) {
    const pathname = usePathname()
    const mainContentRef = useRef<HTMLDivElement>(null) 

    useEffect(() => {
        if (mainContentRef.current) {
            mainContentRef.current.scrollTop = 0
        }
    }, [pathname])

    return (
        <main className="fixed inset-0 flex overflow-hidden bg-[#111] overscroll-none">
            <SideBar />

            <div className="flex flex-1 flex-col ml-64 overflow-hidden transition-all duration-300">
                {topBar}

                <div
                    ref={mainContentRef}
                    className="flex-1 overflow-y-auto text-white custom-scrollbar relative"
                >
                    
                    <div className='p-8 flex-1' >{children}</div>
                </div>

            </div>
        </main>
    )
}