import { createClient } from '@/utils/supabase/server';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

// Helper function untuk memberi jeda
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function GET() {
    const supabase = await createClient();

    try {
        // Ambil 10 grup yang belum di-update untuk menghindari timeout
        const { data: groupsToProcess, error: selectError } = await supabase
            .from('groups')
            .select('name, page_id') // Ambil 'page_id' untuk menargetkan update
            .is('details_fetched_at', null)
            .limit(10);

        if (selectError) throw selectError;

        if (!groupsToProcess || groupsToProcess.length === 0) {
            console.log("✅ All groups are already updated.");
            return NextResponse.json({ message: "All groups are up to date." });
        }

        console.log(`Processing details for ${groupsToProcess.length} groups...`);

        // Gunakan for...of agar lebih mudah dikontrol dan diberi jeda
        for (const group of groupsToProcess) {
            // Bungkus setiap iterasi dalam try...catch agar satu error tidak menghentikan semuanya
            try {
                const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(group.name)}&prop=text&format=json&origin=*`;
                const response = await fetch(url);

                if (!response.ok) {
                    console.error(`Http Error for ${group.name}: ${response.status}`);
                    continue; // Lanjutkan ke grup berikutnya
                }

                const result = await response.json();
                if (!result.parse?.text?.['*']) {
                    console.error(`No parsable content for ${group.name}`);
                    await supabase.from('groups').update({ details_fetched_at: new Date().toISOString(), notes: 'Page not found or empty' }).eq('page_id', group.page_id);
                    continue;
                }

                const htmlString = result.parse.text['*'];
                const $ = cheerio.load(htmlString);

                // --- Parsing dengan selector yang sudah diperbaiki ---
                const hangulName = $('h3.pi-data-label:contains("Hangul")').next('.pi-data-value').text().trim();
                const origin = $('h3.pi-data-label:contains("Origin")').next('.pi-data-value').text().trim();
                const yearsActive = $('h3.pi-data-label:contains("Years active")').next('.pi-data-value').text().trim();
                const fandomName = $('div[data-source="fandom"]').find('h3.pi-data-label:contains("Name")').next('.pi-data-value').text().trim();
                const imageUrl = $('figure.pi-image img').attr('src') || null;
                const genresText = $('h3.pi-data-label:contains("Genre(s)")').next('.pi-data-value').text();
                const genres = genresText ? genresText.split(',').map(g => g.trim()) : [];

                let koreanDebutDate: string | null = null;
                let japanDebutDate: string | null = null;
                const debutHtml = $('h3.pi-data-label:contains("Debut")').next('.pi-data-value').html();
                if (debutHtml) {
                    const entries = debutHtml.split('<br>');
                    for (const entryHtml of entries) {
                        if (entryHtml.trim() === '') continue;
                        const $entry = cheerio.load(entryHtml);
                        const country = $entry('span').text().replace(/[()]/g, '').trim();
                        $entry('span').remove();
                        const date = $entry.root().text().trim();
                        if (country.includes('South Korea')) koreanDebutDate = date;
                        if (country.includes('Japan')) japanDebutDate = date;
                    }
                }

                const dataToUpdate = {
                    korean_name: hangulName || null,
                    origin: origin || null,
                    years_active: yearsActive || null,
                    fandom_name: fandomName || null,
                    image_url: imageUrl,
                    genres: genres,
                    korean_debut_date: koreanDebutDate,
                    japan_debut_date: japanDebutDate,
                    details_fetched_at: new Date().toISOString()
                };

                // --- Update ke Supabase ---
                const { error: updateError } = await supabase
                    .from('groups')
                    .update(dataToUpdate)
                    .eq('page_id', group.page_id);

                if (updateError) throw updateError;
                
                console.log(`✅ Successfully updated: ${group.name}`);

            } catch (err: any) {
                console.error(`❌ Failed to process ${group.name}:`, err.message);
                // Tandai sebagai error agar tidak dicoba lagi
                await supabase.from('groups').update({ details_fetched_at: new Date().toISOString(), notes: err.message }).eq('page_id', group.page_id);
            }
            
            // Beri jeda 1 detik antar panggilan untuk tidak membebani Fandom API
            await delay(1000);
        }
        
        // Kembalikan respons sukses setelah semua batch selesai
        return NextResponse.json({ message: `Successfully processed a batch of ${groupsToProcess.length} groups.` });

    } catch (error: any) {
        console.error('An error occurred in the GET handler:', error);
        return NextResponse.json({ error: 'Seeding details failed.', details: error.message }, { status: 500 });
    }
}