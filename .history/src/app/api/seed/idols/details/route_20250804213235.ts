import { createClient } from "@/utils/supabase/server";

export async function GET() {
    try {
        const supabase = await createClient();

        // Query untuk mengambil semua idol dari tabel 'idols'
        const { data: idols, error } = await supabase
            .from('idols')
            .select('*');

        if (error) {
            console.error('Error fetching idols:', error);
            return new Response('Failed to fetch idols', { status: 500 });
        }

        return new Response(JSON.stringify(idols), {
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error('Unexpected error:', error);
        return new Response('Internal Server Error', { status: 500 });
    }

    try {
        const supabase = await createClient();

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

        // Check if parse result exists
        if (!result.parse || !result.parse.text || !result.parse.text['*']) {
            console.log(`Data parsing tidak tersedia untuk idol: ${idolName}`);
            return null;
        }

        interface SocialMediaLink {
            platform: string | null;
            url: string | null;
        }

        interface PersonalLifeDetail {
            name: string | null,
            periode: string | null,
            relation: string | null
        }

        interface PersonalLife {
            relationship: string | null,
            name: PersonalLifeDetail[] | null
        }

        interface Agency {
            name: string | null,
            periode: string | null
        }

        interface IdolDetail {
            stage_name: string | null;
            birth_name: string | null;
            native_name: string | null,
            korean_stage_name: string | null,
            japanese_stage_name: string | null,
            birth_date: Date | null;
            birth_place: string | null;
            height: number | null;
            weight: number | null;
            blood_type: string | null;
            occupation: string[] | null;
            group_id: string[] | null;
            agency: Agency[] | null;
            relationship: PersonalLife[] | null;
            fandom_color: string[] | null;
            sns: SocialMediaLink[] | null;
            image_url: string | null;
            solo_debut: Date | null;
            name: string | null;
        }

        const detail: IdolDetail = {
            stage_name: null,
            birth_name: null,
            native_name: null,
            korean_stage_name: null,
            japanese_stage_name: null,
            birth_date: null,
            birth_place: null,
            height: null,
            weight: null,
            blood_type: null,
            occupation: [],
            group_id: null,
            agency: [],
            relationship: [],
            fandom_color: [],
            sns: [],
            image_url: null,
            solo_debut: null,
            name: null
        }

        const htmlString = result.parse.text['*']
        const $ = cheerio.load(htmlString)

        // Name
        detail.name = idolName

        // Nama Stage
        const bTag = $('b').first()
        const name = bTag.text()

        // Ambil teks setelah <b> langsung (bukan parent!)
        const parentText = bTag.parent().text()
        const koreanPattern = /[\uAC00-\uD7A3]/;
        const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF]/;
        const fullFormatMatch = parentText.match(/\(Korean:\s*([^;]+);\s*Japanese:\s*([^)]+)\)/)
        const koreanOnlyMatch = parentText.match(/Korean:\s*([^;)]+)/)
        const japaneseOnlyMatch = parentText.match(/Japanese:\s*([^)]+)/)
        const simpleParenthesesMatch = parentText.match(/\(([^)]*)\)/)

        detail.stage_name = name

        // Stage name
        if (fullFormatMatch) {
            // Format lengkap: (Korean: 유나; Japanese: ユナ)
            detail.korean_stage_name = fullFormatMatch[1]?.trim()
            detail.japanese_stage_name = fullFormatMatch[2]?.trim()
            console.log('Full format detected:', detail.korean_stage_name, detail.japanese_stage_name)
        } else if (koreanOnlyMatch || japaneseOnlyMatch) {
            // Format dengan label tapi tidak lengkap
            detail.korean_stage_name = koreanOnlyMatch?.[1]?.trim() ?? null
            detail.japanese_stage_name = japaneseOnlyMatch?.[1]?.trim() ?? null
            console.log('Partial format detected:', detail.korean_stage_name, detail.japanese_stage_name)
        } else if (simpleParenthesesMatch) {
            // Format sederhana dalam kurung: (유나) atau (ユナ)
            const textInKurung = simpleParenthesesMatch[1]

            if (koreanPattern.test(textInKurung)) {
                detail.korean_stage_name = textInKurung
                console.log('Korean name in parentheses:', textInKurung)
            } else if (japanesePattern.test(textInKurung)) {
                detail.japanese_stage_name = textInKurung
                console.log('Japanese name in parentheses:', textInKurung)
            } else {
                console.log('Text in parentheses but not Korean/Japanese:', textInKurung)
            }
        } else {
            console.log(`Tidak ditemukan nama stage dalam bahasa Korea atau Jepang untuk idol ${idolName}`)
        }

        // Nama Birth
        const birthName = $('h3.pi-data-label:contains("Birth name")')
            .next('.pi-data-value')
            .text()

        const splitBirthName = birthName.split(' (')
        detail.birth_name = splitBirthName[0] ?? null
        detail.native_name = splitBirthName[1]?.replace(/[()]/g, '') || null

        // birth Date
        const birthDate = $('h3.pi-data-label:contains("Birth date")')
            .next('.pi-data-value')
            .text()

        if (birthDate) {
            try {
                detail.birth_date = parse(birthDate, 'MMMM d, yyyy', new Date())
            } catch (error) {
                console.log(`Gagal parsing birth date untuk ${idolName}: ${birthDate}`)
                detail.birth_date = null
            }
        }

        // Birth Place
        const birthPlace = $('h3.pi-data-label:contains("Birth place")')
            .next('.pi-data-value')
            .text()
        detail.birth_place = birthPlace ?? null

        // height
        const height = $('h3.pi-data-label:contains("Height")')
            .next('.pi-data-value')
            .text()
        if (height) {
            const heightNum = parseFloat(height.split(' (')[0].replace(/[^\d.]/g, ''))
            detail.height = isNaN(heightNum) ? null : heightNum
        }

        // weight
        const weight = $('h3.pi-data-label:contains("Weight")')
            .next('.pi-data-value')
            .text()
        if (weight) {
            const weightNum = parseFloat(weight.split(' (')[0].replace(/[^\d.]/g, ''))
            detail.weight = isNaN(weightNum) ? null : weightNum
        }

        // blood Type
        const blood_type = $('h3.pi-data-label:contains("Blood type")')
            .next('.pi-data-value')
            .text()
        detail.blood_type = blood_type ?? null

        // Occupation
        const occupation = $('h3.pi-data-label:contains("Occupation")')
            .next('.pi-data-value')
            .text()
        detail.occupation = occupation ? occupation.split(',').map((item) => item.trim()).filter(item => item) : []

        // Agency
        const AgencyDiv = $('h3.pi-data-label:contains("Agency")')
            .next('.pi-data-value')

        const agencyHtml = AgencyDiv.html()?.split('<br>')
        if (agencyHtml && agencyHtml.length > 0) {
            const Agency = agencyHtml.map((item) => {
                const $item = $(item)
                const name = $item.find('a').text() || $item.text().split('(')[0].trim()
                const periode = $item.find('span').text() ||
                    (item.includes('(') ? item.match(/\(([^)]+)\)/)?.[1] : null)
                return {
                    name: name || null,
                    periode: periode || null
                }
            }).filter(agency => agency.name) // Filter out empty agencies
            detail.agency = Agency.length > 0 ? Agency : []
        }

        // family
        const relationshipText = $('h2.pi-header:contains("Personal life")') // 
            .closest('section')
            .find('div.pi-data')
            .find('h3')

        const relationName = relationshipText.map((_, Element) => {
            const text = $(Element).text()
            const relationName = $(Element)
                .next('.pi-data-value') // loop 1: el jennie, loop 2: el krystal
                .html()
                ?.split('<br>')
            const relationNameArray = relationName?.map((item, _) => {
                const cleanItem = item.trim()
                if (cleanItem.startsWith('<')) {
                    const $item = $(cleanItem);
                    const name = $item.filter('a').text()
                    const kurung = $item.filter('span').text().replace('(', '').replace(')', '')
                    const yearPattern = /\d{4}/;
                    if (yearPattern.test(kurung)) {
                        return {
                            name: name,
                            periode: kurung,
                            relation: null
                        }
                    } else {
                        return {
                            name: name,
                            periode: null,
                            relation: kurung
                        }
                    }
                } else {
                    const name = cleanItem.split(' (')[0].trim()
                    const kurung = cleanItem.split(' (')[1]?.replace(')', '').trim()
                    const yearPattern = /\d{4}/;
                    if (yearPattern.test(kurung)) {
                        return {
                            name: name,
                            periode: kurung,
                            relation: null
                        }
                    } else {
                        return {
                            name: name,
                            periode: null,
                            relation: kurung
                        }
                    }
                }

            }) // [{name: jennie, periode: 2018}, {name:krystal, periode: 2016}]
            return {
                relationship: text,
                name: relationNameArray
            }
        }).get()

        detail.relationship = relationName ?? null

        // fandom color
        const fandom_color = $('h3.pi-data-label:contains("Color(s)")')
            .next('.pi-data-value')
            .text()
        detail.fandom_color = fandom_color ? fandom_color.split(',').map((item) => item.trim()).filter(item => item) : []

        // Sosmed
        const snsHtml = $('td[data-source="sns"] span a')
        const sns = snsHtml.map((index, item) => $(item).attr('href')).get()
        const getSocial = (link: string) => {
            try {
                const urlObjek = new URL(link)
                const hostNameParts = urlObjek.hostname.split('.')
                if (hostNameParts.length > 2) {
                    const platform = hostNameParts[1]
                    return {
                        platform: platform,
                        url: link
                    }
                } else {
                    const platform = hostNameParts[0]
                    return {
                        platform: platform,
                        url: link
                    }
                }
            } catch (error) {
                console.log(`Link Sosmed untuk idol ${idolName} bukan link valid ${error}`)
                return {
                    platform: null,
                    url: null
                }
            }
        }
        detail.sns = sns.map((item) => getSocial(item)) ?? null

        // Foto
        const ImageHREF = $('figure.pi-image a')
        const ImageUrl = ImageHREF.attr('href')
        detail.image_url = ImageUrl ?? null

        // solo_debut
        const soloDebutText = $('h3.pi-data-label:contains("Solo debut")')
            .next('.pi-data-value')
            .text()
        if (soloDebutText) {
            try {
                detail.solo_debut = parse(soloDebutText, 'MMMM d, yyyy', new Date())
            } catch (error) {
                console.log(`Gagal parsing solo debut untuk ${idolName}: ${soloDebutText}`)
                detail.solo_debut = null
            }
        }

        // Group nya
        const groupNameDiv = $('h3.pi-data-label:contains("Associations")')
            .next('.pi-data-value')

        const groupNameHtml = groupNameDiv.html()?.split('<br>')
        
        if (groupNameHtml && groupNameHtml.length > 0) {
            const groupNamePromises = groupNameHtml.map(async (item) => {
                const $item = $(item)
                let name = $item.find('a').text().trim()

                if (!name) {
                    name = $item.find('span').text().trim()
                }

                if (!name) {
                    return null;
                }

                try {
                    // First, try to get existing group - use .limit(1) to handle duplicates
                    const { data: groupData, error: groupError } = await supabase
                        .from('groups')
                        .select('id')
                        .eq('name', name)
                        .limit(1)
                        .single()

                    if (groupError && groupError.code !== 'PGRST116') {
                        // PGRST116 is "not found" error, which is expected for new groups
                        console.error(`Gagal mengambil data grup ${name} untuk idol ${idolName}:`, groupError.message);
                        return null;
                    }

                    if (groupData) {
                        // Group exists, return its ID
                        return groupData.id;
                    }

                    // Group doesn't exist, create it with conflict handling
                    const { data: insertData, error: insertError } = await supabase
                        .from('groups')
                        .upsert(
                            { name: name },
                            { 
                                onConflict: 'name',
                                ignoreDuplicates: false 
                            }
                        )
                        .select('id')
                        .single()

                    if (insertError) {
                        console.error(`Gagal memasukkan grup ${name} untuk idol ${idolName}:`, insertError.message);
                        return null;
                    }

                    return insertData?.id;
                } catch (error) {
                    console.error(`Error processing group ${name}:`, error);
                    return null;
                }
            }).filter(Boolean) // Filter out null promises

            const groupIds = await Promise.all(groupNamePromises);
            detail.group_id = groupIds.filter(id => id !== null); // Filter out null results
        } else {
            detail.group_id = [];
        }

        return detail

    } catch (error) {
        console.error(`Gagal mengambil data detail idol ${idolName}:`, error);
        throw error;
    }
}