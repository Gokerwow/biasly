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

    // Menjalankan proses untuk setiap grup secara paralel
    const processingResults = await Promise.all(GroupsData.map(async (group) => {
        try {
            // 1. Scraping data label untuk satu grup
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
            labelContainer.find('a').each((_index, element) => {
                const labelName = $(element).text().trim();
                if (labelName && !labelName.startsWith('[')) {
                    labelNames.add(labelName);
                }
            });

            const labelsArray = [...labelNames];

            if (labelsArray.length === 0) {
                return { group: group.name, status: 'success', message: 'No labels found on page.' };
            }

            // 2. Ambil ID untuk semua label yang ditemukan dalam SATU KALI query
            const { data: labelsData, error: labelsSelectError } = await supabase
                .from('labels')
                .select('id, name')
                .in('name', labelsArray);

            if (labelsSelectError) {
                throw new Error(`Failed to select labels for ${group.name}: ${labelsSelectError.message}`);
            }

            // 3. Siapkan data untuk dimasukkan (bulk insert)
            const relationshipsToInsert = labelsData.map(label => ({
                group_id: group.id,
                label_id: label.id
                // PERBAIKAN: Tidak ada kolom 'name' di sini
            }));

            if (relationshipsToInsert.length > 0) {
                // 4. Masukkan semua hubungan dalam SATU KALI operasi
                const { error: insertError } = await supabase
                    .from('group_labels')
                    .insert(relationshipsToInsert)
                    .onConflict('group_id, label_id') // Abaikan jika sudah ada
                    .ignore();

                if (insertError) {
                    throw new Error(`Failed to insert relationships for ${group.name}: ${insertError.message}`);
                }
            }

            return { group: group.name, status: 'success', labels_processed: relationshipsToInsert.length };

        } catch (error) {
            // Menangkap semua error yang terjadi untuk grup ini
            return { group: group.name, status: 'error', message: error.message };
        }
    }));

    // 5. Kembalikan respons akhir setelah semua proses selesai
    return NextResponse.json({
        message: "Group processing finished.",
        results: processingResults
    }, { status: 200 });
}