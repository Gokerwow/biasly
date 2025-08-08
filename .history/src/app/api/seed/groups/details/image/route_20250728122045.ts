import { createClient } from "@/utils/supabase/server";

export async function GET() {
        try {
            const supabase = await createClient()
        } catch {

        }
}