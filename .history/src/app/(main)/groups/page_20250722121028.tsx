'use client'

import { useEffect, useState } from "react"

interface groups {
    pageid: number,
    ns: number,
    title: string
}

export default function GroupsPage() {
    const [ groups, setGroups ] = useState<groups | null>(null)

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
            {groups.map((group, index) => {
                <h1 key={index}>{group.title}</h1>
            })}
        </div>
    )
}