'use client'

import { createContext, useEffect, useState } from "react"

const userContext = createContext(null)

export function UserProvider({ children }) {

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)

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
                    setAvatarUrl(profileData.avatar)
                    setBio(profileData.bio)
                }
            }
        }

        getUser()

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
            // If the user logs out, clear their profile data
            if (!session) {
                setBio(null)
                setAvatarUrl(null)
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
}