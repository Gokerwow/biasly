import { TABLES } from "@/constants";
import { mapToCleanRelease } from "@/helper/cleanPhotocard";
import { handleQueryError } from "@/helper/errorHandling";
import { createClient } from "@/utils/supabase/server";

export async function getReleasesWithCards() {
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
                    distribution_types(id, name),
                    photocards_modifiers_global(
                        global_modifier:global_card_modifiers(id, name)
                    )
                )
            `)
            .order('created_at', { ascending: false })
            .order('created_at', {
                referencedTable: 'photocards',
                ascending: false
            })
            .limit(8)

        if (error) handleQueryError(error, 'Error at getting releases with card data')

        return data.map(mapToCleanRelease)
    } catch (error) {
        console.log(`Error at getting releases with card data ${error}`)
        throw new Error(`Error at getting releases with card data: ${error}`)
    }
}