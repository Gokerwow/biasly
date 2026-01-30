'use client'

import React, { ReactNode, useContext, useState, createContext } from "react"

interface ChildrenProps {
    children: ReactNode
}

interface ModalContextProps {
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const ModalContext = createContext<ModalContextProps | null>(null)

export default function ModalProvider({ children }: ChildrenProps) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <ModalContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
        </ModalContext.Provider>
    )
}

export const useModal = () => {
    const context = useContext(ModalContext)
    if (context === undefined || context === null) {
        throw new Error('useUser must be used within a modalProvider');
    }
    return context
}