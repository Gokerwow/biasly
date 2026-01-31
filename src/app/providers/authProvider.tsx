'use client'

import { createContext, ReactNode, useContext, useEffect, useState } from "react"
import { Database } from "@/types/supabase"

export type Profile = Database['public']['Tables']['profiles']['Row']

interface ChildrenProps {
    children: ReactNode,
    initialUser: Profile | null
}

type UserContextType = {
    user: Profile | null;
    setUser: (user: Profile | null) => void;
};

const userContext = createContext<UserContextType | null>(null)

export function UserProvider({ children, initialUser }: ChildrenProps) {
    const [user, setUser] = useState<Profile | null>(initialUser)

    const value = { user, initialUser, setUser }

    console.log(user)

    useEffect(() => {
        setUser(initialUser)
    }, [initialUser])

    return (
        <userContext.Provider value={value}>
            {children}
        </userContext.Provider>
    )
}

export function useUser() {
    const context = useContext(userContext);
    if (context === undefined || context === null) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}