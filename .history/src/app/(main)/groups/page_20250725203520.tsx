import { useState } from "react"

interface groups {
    pageid: number,
    ns: number,
    title: string
}

export default function GroupsPage() {
    const [groups, setGroups] = useState<groups[]>([])

    console.log(groups)

    return (
        <div>
            {groups.map((group, index) => {
                return <h1 key={index}>{group.title}</h1>
            })}
        </div>
    )
}