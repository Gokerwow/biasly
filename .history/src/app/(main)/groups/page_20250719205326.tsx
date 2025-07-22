import { error } from "console"
import { useEffect, useState } from "react"

export default function GroupsPage() {
    const [ groups, setGroups ] = useState(null)

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await fetch('api/groups')

            if (!response.ok) {
                throw new Error(`Error ${response.status}`)
            }

            const result = await response.json()

            
        }
    })

    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}