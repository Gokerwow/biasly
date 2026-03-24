import { TABLES } from "@/constants";
import { createClient } from "@/utils/supabase/server";

export async function GetReleasesWithCards() {
    const supabase = await createClient()

    try {
        const { data, error } = await supabase
            .from(TABLES.RELEASES)
            .select(`
                *,
                groups(id, name),
                photocards(
                    *,
                    photocards_idol(
                        idol:idols(id, stage_name)
                    ),
                    distribution_types(id, name)
                )
            `)
            .order('created_at', { ascending: false })
            .limit(8)

        if (error) {
            console.log(`Error at getting releases with card data ${error}`)
            throw new Error(`Error at getting releases with card data: ${error}`)
        }

        return data ?? []
    } catch (error) {
        console.log(`Error at getting releases with card data ${error}`)
        throw new Error(`Error at getting releases with card data: ${error}`)
    }
}