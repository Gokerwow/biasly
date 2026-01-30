'use client'

import { Modal } from '@/components/cards/UI/modal';
import SideBar from '@/components/cards/UI/sidebar';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useModal } from '../providers/modalProvider';

export default function DashboardLayout({ children, topBar }: { children: React.ReactNode, topBar: React.ReactNode }) {
    const pathname = usePathname()
    const mainContentRef = useRef<HTMLDivElement>(null) 

    const { isOpen, setIsOpen } = useModal()

    // 4. The Magic Fix: Reset scroll when path changes
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
                    <Modal
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        title="Create New Binder"
                    >
                        <div className="space-y-4">
                            <p>Ready to start a new collection, Sir?</p>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full py-3 bg-pink-600 rounded-xl font-bold text-white"
                            >
                                Close Test
                            </button>
                        </div>
                    </Modal>
                    
                    <div className='p-8 flex-1' >{children}</div>
                </div>

            </div>
        </main>
    )
}