import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient()

        const { data: GroupsData, error: SelectError } = await supabase
            .from('groups')
            .select('name')
            .is('details_fetched_at', null)
            .limit(50);
    } catch {

    }
}