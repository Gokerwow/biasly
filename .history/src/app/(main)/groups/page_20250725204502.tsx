import { createClient } from "@/utils/supabase/server"

export default async function GroupsPage() {
    
    const supabase = await createClient()

    const { data: GroupsData, error:selectError } = await supabase
        .from('groups')
        .select('name')

    if (selectError) {
        throw new Error(`Select Error `)
    }

    return (
        <div>
            {GroupsData.map((group, index) => {
                return <h1 key={index}>{group.title}</h1>
            })}
        </div>
    )
}