'use client'

import { useEffect, useState } from "react"

interface Group {
    
}

export default function GroupProvider() {
    const [groups, setGroups] = useState(null)

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('/api/groups')

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch data');
            }

            const data = await response.json
            setGroups(data)
        }
    })
}