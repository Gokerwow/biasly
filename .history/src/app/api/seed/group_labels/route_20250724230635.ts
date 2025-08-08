import { createClient } from "@/utils/supabase/server";
import { Cheerio } from "cheerio";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient()

    const { data: GroupsData, error: groupSelectError } = await supabase
        .from('groups')
        .select('name')

    const { data: LabelsData, error: LabelsSelectError } = await supabase
        .from('labels')
        .select('name')

    if (groupSelectError || LabelsSelectError) {
        return NextResponse.json({ message: 'Select Error', error: (groupSelectError ?? LabelsSelectError) }, { status: 500 })
    }

    const result = await Promise.all(GroupsData.map(async (group) => {
        const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(group.name)}&prop=text&format=json&origin=*`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Http Error ${response.status} for ${group.name}`)
        }

        const result = await response.json()

        const htmlString = result.parse.text['*']

        const $ = Cheerio.load(htmlString)

        const labels = new Set<string>();

        const labelContainer = $('div[data-source="label"] .pi-data-value');

        labelContainer.find('a').each((_index, element) => {
            const labelName = $(element).text().trim();

            // Pastikan kita tidak mengambil link yang tidak relevan (seperti link referensi [1])
            if (labelName && !labelName.startsWith('[')) {
                labels.add(labelName);
            }
        });

        for (const label of labels) {
            const { error: insertError } = await supabase
             .from('group_labels')
             .
        }
        

    }))


}