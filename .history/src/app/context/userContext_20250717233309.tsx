'use client'

import { createContext, useState } from "react"

const userContext = createContext(null)

export function UserProvider({ children }) {

    const [user, setUser] = useState(null)
    const [profile, setProfile] = useState(null)

    
}