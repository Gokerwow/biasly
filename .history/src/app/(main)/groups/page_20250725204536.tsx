import { createClient } from "@/utils/supabase/server"

export default async function GroupsPage() {
    
    const supabase = await createClient()

    const { data: GroupsData, error:selectError } = await supabase
        .from('groups')
        .select('name')
        .range(0, 9)

    if (selectError) {
        return <p>Gagal memuat data. Silakan coba lagi.</p>;
    }

    return (
        <div>
            {GroupsData.map((group, index) => {
                return <h1 key={index}>{group.name}</h1>
            })}
        </div>
    )
}