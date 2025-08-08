import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

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

    let newLabelsCount = 0;
    for (const label of LabelsData) {
        if (existingPageIds.has(label.pageid)) {
            continue
        }

        newLabelsCount++;

        const { error: insertError } = await supabase
            .from('labels')
            .insert([
                {
                    name: label.title,
                    page_id: label.pageid,
                    ns: label.ns
                },
            ])

        if (insertError) {
            console.log(`error inserting ${label.title} data`)
            newLabelsCount--;
        }
    }

    return NextResponse.json({
        message: "Sinkronisasi label selesai.",
        totalLabelsFetched: LabelsData.length,
        existingLabelsFound: existingPageIds.size,
        newLabelsAdded: newLabelsCount // Gunakan penghitung yang akurat
    }, { status: 200 });
}