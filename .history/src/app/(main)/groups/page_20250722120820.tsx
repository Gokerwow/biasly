'use client'

import { useEffect, useState } from "react"

export default function GroupsPage() {
    const [ groups, setGroups ] = useState(null)

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('api/groups/boy')

            if (!response.ok) {
                throw new Error(`HTTP errorrrr! Status: ${response.status}`);
            }

            const result = await response.json()

            setGroups(result.data)
        }

        fetchGroups()
    }, [])

    console.log(groups)

    return (
        <div>
            <h1></h1>
        </div>
    )
}