import { createClient } from '@/utils/supabase/server';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = await createClient()

        // Fixed: Changed 'details_fetched_at' to 'detail_fetched_at' based on error message
        const { data: GroupsData, error: SelectError } = await supabase
            .from('groups')
            .select('name')
            .is('details_fetched_at', null)
            .limit(10);

        if (SelectError) {
            return NextResponse.json({ message: 'Select Error', error: SelectError }, { status: 500 })
        }

        const results = await Promise.all(GroupsData.map(async (group) => {
            try {

                console.log(group.name)

                const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(group.name)}&prop=text&format=json&origin=*`

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`Http Error ${response.status} for ${group.name}`)
                }

                const result = await response.json()

                const htmlString = result.parse.text['*']

                const $ = cheerio.load(htmlString)

                const details = {
                    hangulName: '',
                    katakana: '',
                    romanization: '',
                    koreanDebutDate: '',
                    japanDebutDate: '',
                    origin: '',
                    yearsActive: '',
                    genres: [] as string[],
                    fandomName: '',
                    fandomColor: '',
                    imageUrl: ''
                };

                details.hangulName = $('h3.pi-data-label:contains("Hangul")')
                    .next('.pi-data-value')
                    .text()

                details.katakana = $('h3.pi-data-label:contains("Katakana")')
                    .next('.pi-data-value')
                    .text()

                details.romanization = $('h3.pi-data-label:contains("Romanization")')
                    .next('.pi-data-value')
                    .text()

                const debutValueDiv = $('h3.pi-data-label:contains("Debut")')
                    .next('.pi-data-value')
                    .next()

                if (debutValueDiv.length > 0) {
                    const debutHtml = debutValueDiv.html();

                    if (debutHtml) {
                        const entries = debutHtml.split('<br>');
                        const debutDetails: { date: string, country: string }[] = [];

                        for (const entryHtml of entries) {
                            if (entryHtml.trim() === '') continue;

                            const $entry = cheerio.load(entryHtml);
                            const country = $entry('span').text().replace(/[()]/g, '').trim();
                            $entry('span').remove();
                            const date = $entry.root().text().trim();
                            debutDetails.push({ date, country });
                        }

                        if (debutDetails) {
                            for (const detail of debutDetails) {
                                if (detail.country.includes('South Korea')) {
                                    details.koreanDebutDate = detail.date
                                } else {
                                    details.japanDebutDate = detail.date
                                }
                            }
                        }
                    }
                }

                details.origin = $('h3.pi-data-label:contains("Origin")')
                    .next('.pi-data-value')
                    .text()

                const genres = $('h3.pi-data-label:contains("Genre")')
                    .next('.pi-data-value')
                    .text()

                details.genres = genres.split(',').map(genre => genre.trim())

                const fandomSection = $('div[data-source="fandom"]');

                const fandomName = fandomSection.find('h3.pi-data-label:contains("Name")')
                    .next('.pi-data-value')
                    .text()
                    .trim();

                details.fandomName = fandomName;

                details.fandomColor = $('h3.pi-data-label:contains("color")')
                    .next('.pi-data-value')
                    .text()

                const ImageElement = $('figure.pi-image img')
                const ImageUrl = ImageElement.attr('src')
                details.imageUrl = ImageUrl || ''

                details.yearsActive = $('h3.pi-data-label:contains("Years Active")')
                    .next('.pi-data-value')
                    .text()

                const { data, error } = await supabase
                    .from('groups')
                    .update({
                        korean_name: details.hangulName || null,
                        japan_name: details.katakana || null,
                        roman_name: details.romanization || null,
                        korean_debut_date: details.koreanDebutDate || null,
                        japan_debut_date: details.japanDebutDate || null,
                        fandom_name: details.fandomName || null,
                        fandom_color: details.fandomColor || null,
                        genres: details.genres.length > 0 ? details.genres : null,
                        years_active: details.yearsActive || null,
                        origin: details.origin || null,
                        image_url: details.imageUrl || null,
                        details_fetched_at: new Date().toISOString()
                    })
                    .ilike('name', group.name.trim())
                    .select(); // <= ini akan kembalikan data[] yang diupdate

                const { data: match } = await supabase
                    .from('groups')
                    .select('name')
                    .filter('name', 'ilike', `%${group.name.trim()}%`);

                console.log('Match found in DB:', match);

                console.log(`--- DEBUG ${group.name} ---`);
console.log(`Group name raw: "${group.name}"`);
console.log(`Length: ${group.name.length}`);
console.log(
  [...group.name].map(c => `${c} (U+${c.charCodeAt(0).toString(16).toUpperCase()})`).join(' ')
);

                if (error) {
                    throw new Error(`Update error for ${group.name}: ${error.message}`);
                }
                if (!data || data.length === 0) {
                    throw new Error(`No rows updated for ${group.name}`);
                }

                return { success: true, group: group.name };

            } catch (error) {
                console.error(`Failed to process ${group.name}:`, error);
                return { success: false, group: group.name, error: error.message };
            }
        }))

        // Return a proper response with results
        const successCount = results.filter(r => r.success).length;
        const failureCount = results.filter(r => !r.success).length;

        return NextResponse.json({
            message: "Processing completed",
            processed: GroupsData.length,
            successful: successCount,
            failed: failureCount,
            results: results
        });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: error.message },
            { status: 500 }
        );
    }
}