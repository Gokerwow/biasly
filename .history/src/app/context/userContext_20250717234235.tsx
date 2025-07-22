'use client'

import { createContext, ReactNode, useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import type { User } from '@supabase/supabase-js' // Pastikan User diimpor


interface Profile {
    avatar: string,
    bio: string
}

interface ChildrenProps {
    children: ReactNode
}

type UserContextType = {
    user: User | null;
    profile: Profile | null;
};

const userContext = createContext<UserContextType | null>(null)
const supabase = createClient()

export function UserProvider({ children  }: ChildrenProps) {

    const [user, setUser] = useState<User | null>(null)
    const [profile, setProfile] = useState<Profile | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession()
            setUser(session?.user ?? null)

            if (!session?.user) return;

            const { data: profileData, error } = await supabase
                .from('profiles')
                .select('avatar, bio')
                .eq('id', session?.user.id)
                .single()


            if (error) {
                console.error("Error fetching profile:", error.message)
            } else {
                if (profileData) {
                    setProfile(profileData)
                }
            }
        }

        getUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            // If the user logs out, clear their profile data
            if (!session) {
                setProfile(null)
            } else {
                // If a new user logs in, you could re-fetch the profile here,
                // but often a page reload or navigation handles this.
                // For simplicity, we just set the user.
            }
        })

        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [])

    const value = { user, profile }

    return <userContext.Provider value={value}>
        {children}
    </userContext.Provider>
}