import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const supabase = await createClient()

    const { data: GroupsData, error: groupSelectError } = await supabase
        .from('groups')
        .select('name')

    if (groupSelectError) {
        
    }
}