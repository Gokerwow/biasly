import { useEffect, useState } from "react"

export default function GroupsPage() {
    const [ groups, setGroups ] = useState(null)

    useEffect(() => {
        const getGroupsData = async () => {
            const url = 'https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Male_Idols&cmlimit=500&format=json'
        }
    })

    return (
        <div>
            <h1>Hello</h1>
        </div>
    )
}