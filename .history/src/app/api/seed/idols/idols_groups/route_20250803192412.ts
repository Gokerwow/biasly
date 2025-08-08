import { createClient } from "@supabase/supabase-js";

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );
                const url = `https://kpop.fandom.com/api.php?action=parse&page=${idolName}&prop=text&format=json&origin=*`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`)
        }

        const result = await response.json()

        if (result.error) {
            // Handle specific API errors
            if (result.error.code === 'missingtitle') {
                console.log(`Halaman tidak ditemukan untuk idol: ${idolName}`);
                return null; // Return null instead of throwing error
            }
            throw new Error(`API Error: ${result.error.info}`);
        }
    } catch (error) {
        console.error("Proses Gagal Total:", error);
    }
}