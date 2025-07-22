import { useEffect, useState } from "react"

export default function GroupsPage() {
    const [ groups, setGroups ] = useState(null)

    useEffect(() => {
        const getGroupsData = async () => {
            const url = 'https://k-pop.p.rapidapi.com/idols?q=${query}'
        }
    })

    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}