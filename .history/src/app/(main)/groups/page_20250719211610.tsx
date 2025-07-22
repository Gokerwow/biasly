'use client'

import { useEffect, useState } from "react"

export default function GroupsPage() {
    const [ groups, setGroups ] = useState(null)

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('api/groups')

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const result = await response.json()

            setGroups(result.data)
        }

        fetchGroups()
    }, [])

    return (
        <div>
            <h1>{groups}</h1>
        </div>
    )
}