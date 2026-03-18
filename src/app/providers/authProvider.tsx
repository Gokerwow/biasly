'use client'

import { Profile } from "@/types/database.helper";
import { createContext, ReactNode, useContext, useState } from "react"

interface ChildrenProps {
    children: ReactNode,
    initialUser: Profile | null
}

type UserContextType = {
    profile: Profile | null;
    setProfile: (user: Profile | null) => void;
};

const userContext = createContext<UserContextType | null>(null)

export function UserProvider({ children, initialUser }: ChildrenProps) {
    const [profile, setProfile] = useState<Profile | null>(initialUser)

    const value = { profile, initialUser, setProfile }

    console.log(profile)
    
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