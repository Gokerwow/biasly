import { createClient } from "@/utils/supabase/server";
import * as cheerio from 'cheerio';
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient();

    const { data: GroupsData, error: groupSelectError } = await supabase
        .from('groups')
        .select('id, name');

    if (groupSelectError) {
        return NextResponse.json({ message: 'Select Error', error: groupSelectError }, { status: 500 });
    }

    const processingResults = await Promise.all(GroupsData.map(async (group) => {
        try {
            const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(group.name)}&prop=text&format=json&origin=*`;
            const response = await fetch(url);

            if (!response.ok) {
                // Lemparkan error jika fetch gagal
                throw new Error(`Http Error ${response.status} for ${group.name}`);
            }

            const result = await response.json();
            const htmlString = result.parse.text['*'];
            const $ = cheerio.load(htmlString);

            const labelNames = new Set<string>();
            const labelContainer = $('div[data-source="label"] .pi-data-value');

            if (labelContainer.length > 0) {
                const links = labelContainer.find('a');

                if (links.length > 0) {
                    // KASUS 1: Jika ada link, loop setiap link
                    links.each((_index, element) => {
                        const labelName = $(element).text().trim();
                        if (labelName && !labelName.startsWith('[')) {
                            labelNames.add(labelName);
                        }
                    });
                } else {
                    // KASUS 2: Jika TIDAK ada link, ambil teks langsung dari kontainer
                    const labelName = labelContainer
                        .clone()         // Buat duplikat agar tidak merusak elemen asli
                        .children('sup') // Pilih elemen <sup> di dalam duplikat
                        .remove()        // Hapus elemen <sup> tersebut
                        .end()           // Kembali ke elemen induk (div)
                        .text()          // Ambil teks yang sekarang sudah bersih
                        .trim();

                    if (labelName) {
                        // Tambahan: hapus juga tanda kutip jika ada
                        labels.add(labelName.replace(/"/g, ''));
                    }
                }
            }

            const labelsArray = [...labelNames];

            if (labelsArray.length === 0) {
                return { group: group.name, status: 'success', message: 'No labels found on page.' };
            }

            const { data: existedLabelsData, error: existedLabelsSelectError } = await supabase
                .from('labels')
                .select('id, name')
                .in('name', labelsArray);

            if (existedLabelsSelectError) {
                throw new Error(`Failed to select labels for ${group.name}: ${labelsSelectError.message}`);
            }

            const existLabelsData = new Set(existedLabelsData.map(label => label.name))
            const missingLabelData = labelsArray.filter(label => !existLabelsData.has(label))

            if (missingLabelData.length > 0) {
                console.log('Missing labels found, inserting:', missingLabelData);

                const labelsToInsert = missingLabelData.map(label => ({ name: label }));

                const { error } = await supabase
                    .from('labels')
                    .upsert(labelsToInsert, {
                        onConflict: 'name',          // Beritahu Supabase kolom mana yang unik
                        ignoreDuplicates: true   // Abaikan jika nama sudah ada
                    });

                if (error) {
                    throw new Error(`Failed to upsert new labels: ${error.message}`);
                }
            }

            const { data: labelsData, error: labelsSelectError } = await supabase
                .from('labels')
                .select('id, name')
                .in('name', labelsArray);

            if (labelsSelectError) {
                throw new Error(`Failed to select labels for ${group.name}: ${labelsSelectError.message}`);
            }

            const relationshipsToInsert = labelsData.map(label => ({
                group_id: group.id,
                label_id: label.id
            }));

            if (relationshipsToInsert.length > 0) {
                const { error: upsertError } = await supabase
                    .from('group_labels')
                    .upsert(relationshipsToInsert, {
                        onConflict: 'group_id, label_id',
                        ignoreDuplicates: true
                    });

                if (upsertError) {
                    throw new Error(`Failed to upsert relationships for ${group.name}: ${upsertError.message}`);
                }
            }

            return { group: group.name, status: 'success', labels_processed: relationshipsToInsert.length };

        } catch (error) {
            return { group: group.name, status: 'error', message: error.message };
        }
    }));

    return NextResponse.json({
        message: "Group processing finished.",
        results: processingResults
    }, { status: 200 });
}