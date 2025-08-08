import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
    } catch (error) {
        console.error("Proses Gagal Total:", error);
    }
}