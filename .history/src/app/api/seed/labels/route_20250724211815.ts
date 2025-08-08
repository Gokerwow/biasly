import { createClient } from "@/utils/supabase/server";

export async function GET() {
    const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:Record%20labels&cmlimit=500&format=json&origin=*`

    const response = await fetch(url)

    if (!response.ok) {
        console.error(`Fandom API Error for Labels page: Status ${response.status}`);
    }

    const result = await response.json()
    const LabelsData = result.query.categorymembers

    const supabase = await createClient()

    const { data: existingLabels, error: selectError } = await supabase
        .from('labels')
        .select('page_id')

    if (selectError) {
        console.error("Supabase select error:", selectError);
        throw selectError;
    }

    const existingPageIds = new Set(existingLabels.map(label => label.page_id))
    
for (const label of LabelsData) {
    // Perhatikan: properti dari Fandom API adalah 'pageid' (huruf kecil)
    if (existingPageIds[label.pageid]) {
        continue; // 'continue' berfungsi dengan benar di sini
    }

    // Kode selanjutnya untuk label yang tidak ada di existingPageIds...
}
}