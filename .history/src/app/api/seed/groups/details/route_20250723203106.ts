import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

// Fungsi GET akan menerima 'name' dari URL
export async function GET(request: Request, { params }: { params: { name: string } }) {
    const groupName = params.name;

    console.log(`✨ Starting detail enrichment for: ${groupName}`);

    try {
        const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(groupName)}&prop=text&format=json&origin=*`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Fandom API Error for ${groupName}, Status: ${response.status}`);
        }

        const result = await response.json();
        if (result.error) {
            throw new Error(`Group '${groupName}' not found on Fandom Wiki.`);
        }
        
        const htmlString = result.parse.text['*'];
        const $ = cheerio.load(htmlString);

        // --- Proses Parsing (dengan selector yang benar) ---
        
        const hangulName = $('h3.pi-data-label:contains("Hangul")').next('.pi-data-value').text().trim();
        const origin = $('h3.pi-data-label:contains("Origin")').next('.pi-data-value').text().trim();
        const yearsActive = $('h3.pi-data-label:contains("Years active")').next('.pi-data-value').text().trim();
        const fandomName = $('div[data-source="fandom"]').find('h3.pi-data-label:contains("Name")').next('.pi-data-value').text().trim();
        const imageUrl = $('figure.pi-image img').attr('src') || null;
        
        const genresText = $('h3.pi-data-label:contains("Genre(s)")').next('.pi-data-value').text();
        const genres = genresText.split(',').map(g => g.trim());

        // Proses debut date yang terpisah
        const debutHtml = $('h3.pi-data-label:contains("Debut")').next('.pi-data-value').html();
        let koreanDebutDate: string | null = null;
        let japanDebutDate: string | null = null;

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

        // Siapkan data untuk di-update
        const dataToUpdate = {
            korean_name: hangulName,
            origin: origin,
            years_active: yearsActive,
            fandom_name: fandomName,
            image_url: imageUrl,
            genres: genres,
            korean_debut_date: koreanDebutDate,
            japan_debut_date: japanDebutDate,
            details_fetched_at: new Date().toISOString() // Tandai sudah di-update
        };

        // --- Update ke Supabase ---
        const supabase = await createClient();
        const { error } = await supabase
            .from('groups')
            .update(dataToUpdate)
            .eq('title', groupName); // Gunakan 'title' untuk mencari baris yang benar

        if (error) {
            throw error;
        }

        console.log(`✅ Successfully updated details for: ${groupName}`);
        return NextResponse.json({ message: `Details for ${groupName} updated successfully.`, data: dataToUpdate });

    } catch (error: any) {
        console.error(`Failed to process ${groupName}:`, error);
        return NextResponse.json({ error: `Failed for ${groupName}`, details: error.message }, { status: 500 });
    }
}