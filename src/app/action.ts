'use server'

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function toggleCollectionStatus(cardId: string) {
    const supabase = await createClient();

    // 1. Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: "You must be logged in" };

    // 2. Check if already in collection
    const { data: existing } = await supabase
        .from("collections")
        .select("id")
        .eq("user_id", user.id)
        .eq("card_id", cardId)
        .single();

    if (existing) {
        // REMOVE (Toggle Off)
        await supabase.from("collections").delete().eq("id", existing.id);
    } else {
        // ADD (Toggle On) - Defaulting to 'owned'
        await supabase.from("collections").insert({
            user_id: user.id,
            card_id: cardId,
            status: 'owned'
        });
    }

    // 3. Refresh the UI
    revalidatePath('/');
    return { success: true };
}