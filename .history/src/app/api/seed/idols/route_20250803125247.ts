import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';
import { parse } from 'date-fns';
import { createClient } from "@/utils/supabase/server";
import pLimit from 'p-limit';

interface CategoryMember {
    pageid: number;
    ns: number;
    title: string;
}

function NormalizedDetailFormat(detail: any) {
    return {
        stage_name: detail.stage_name ?? null,
        birth_name: detail.birth_name ?? null,
        native_name: detail.native_name ?? null,
        korean_stage_name: detail.korean_stage_name ?? null,
        japanese_stage_name: detail.japanese_stage_name ?? null,
        birth_date: detail.birth_date ?? null,
        birth_place: detail.birth_place ?? null,
        height: detail.height ?? null,
        weight: detail.weight ?? null,
        blood_type: detail.blood_type ?? null,
        occupation: detail.occupation ?? [],
        group_id: null,
        agency: detail.agency ?? [],
        relationship: detail.relationship ?? [],
        fandom_color: detail.fandom_color ?? [],
        sns: detail.sns ?? [],
        image_url: detail.image_url ?? null,
        solo_debut: detail.solo_debut ?? null,
        name: detail.name ?? null
    }
}

export async function GetIdols(gender: string, category: string) {
    try {
        let hasMore = true
        let continueToken;
        const categoryName = `${gender} ${category}`;
        const IdolArray = []

        while (hasMore) {
            const url: string = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*&cmcontinue=${encodeURIComponent(continueToken ?? '')}`
            const response = await fetch(url)

            if (!response.ok) {
                throw new Error(`HTTP Error ${response.status}`)
            }

            const result = await response.json()

            if (result.error) {
                throw new Error(`API Error: ${result.error.info}`);
            }

            if (!result.continue) {
                hasMore = false
            } else {
                continueToken = result.continue.cmcontinue
            }
            const IdolName = result.query.categorymembers.map((name: CategoryMember) => name.title)
            IdolArray.push(...IdolName)
        }

        return IdolArray

    } catch (error) {
        console.error("Gagal mengambil data nama idol:", error);
        return []
    }
}

export async function GetIdolsDetails(idolName: string) {
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
                    const { data: groupData, error: groupError } = await supabase
                        .from('groups')
                        .select('id')
                        .eq('name', name)
                        .maybeSingle()

                    if (groupError) {
                        console.error(`Gagal mengambil data grup ${name} untuk idol ${idolName}:`, groupError.message);
                        return null;
                    }

                    if (!groupData) {
                        const { data: insertData, error: insertError } = await supabase
                            .from('groups')
                            .insert({ name: name })
                            .select('id')
                            .single() // ✅ Gunakan single() untuk insert tunggal

                        if (insertError) {
                            console.error(`Gagal memasukkan grup ${name} untuk idol ${idolName}:`, insertError.message);
                            return null;
                        }

                        return insertData?.id;
                    }

                    return groupData?.id
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
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const limit = pLimit(5); // Kurangi concurrent limit untuk menghindari race condition
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // 1. Ambil SEMUA data dari DB dengan normalisasi nama
        console.log("Mengambil data idol yang ada dari database...");
        const { data: dbIdols, error: dbError } = await supabase.from('idols').select('*');
        if (dbError) {
            console.error('Error mengambil data dari DB:', dbError.message);
            return NextResponse.json({ message: 'Gagal mengambil data dari DB' }, { status: 500 });
        }

        // Normalisasi nama untuk pengecekan yang lebih akurat
        const normalizeString = (str) => str?.trim().toLowerCase().replace(/\s+/g, ' ') || '';
        const dbIdolMap = new Map();
        const dbIdolNormalizedMap = new Map();

        dbIdols.forEach(idol => {
            dbIdolMap.set(idol.name, idol);
            dbIdolNormalizedMap.set(normalizeString(idol.name), idol);
        });

        console.log(`Ditemukan ${dbIdolMap.size} idol di database.`);

        // 2. Ambil SEMUA nama idol dari API
        console.log("Mengambil daftar nama idol dari API...");
        const categories = ['soloists', 'singers', 'rappers', 'trainees'];
        const genders = ['male', 'female'];
        const promises = [];
        const failedNames = [];

        genders.forEach(gender => {
            categories.forEach(category => {
                promises.push(GetIdols(gender, category));
            });
        });

        const apiIdolNameArrays = await Promise.all(promises);
        const apiIdolNamesRaw = apiIdolNameArrays.flat();
        const uniqueApiIdolNames = [...new Set(apiIdolNamesRaw)];
        console.log(`Ditemukan ${uniqueApiIdolNames.length} nama idol unik dari API.`);

        // 3. Pisahkan dengan pengecekan yang lebih ketat
        const newIdolNames = [];
        const existingIdolNames = [];

        uniqueApiIdolNames.forEach(name => {
            const normalizedName = normalizeString(name);
            // Cek dengan nama asli dan nama yang dinormalisasi
            if (!dbIdolMap.has(name) && !dbIdolNormalizedMap.has(normalizedName)) {
                newIdolNames.push(name);
            } else {
                existingIdolNames.push(name);
            }
        });

        console.log(`Idol baru untuk diproses: ${newIdolNames.length}`);
        console.log(`Idol lama untuk dicek update: ${existingIdolNames.length}`);

        // 4. Proses Idol BARU dengan batch processing
        if (newIdolNames.length > 0) {
            console.log("Memulai proses pengambilan detail untuk idol baru...");

            // Process in smaller batches to avoid overwhelming the database
            const BATCH_SIZE = 10;
            const newIdolDetails = [];

            for (let i = 0; i < newIdolNames.length; i += BATCH_SIZE) {
                const batch = newIdolNames.slice(i, i + BATCH_SIZE);
                console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(newIdolNames.length / BATCH_SIZE)}`);

                const batchPromises = batch.map((name) => {
                    return limit(async () => {
                        try {
                            await delay(100); // Small delay to prevent rate limiting
                            const detail = await GetIdolsDetails(name);
                            return detail;
                        } catch (error) {
                            console.error(`Gagal memproses ${name}:`, error.message);
                            failedNames.push(name);
                            return null;
                        }
                    });
                });

                const batchResults = await Promise.all(batchPromises);
                newIdolDetails.push(...batchResults.filter(detail => detail));

                // Delay between batches
                if (i + BATCH_SIZE < newIdolNames.length) {
                    await delay(500);
                }
            }

            // Double-check for duplicates before insert
            const finalIdolsToInsert = [];
            for (const idol of newIdolDetails) {
                if (!idol) continue;

                // Cek sekali lagi apakah sudah ada di database (real-time check)
                const { data: existingCheck } = await supabase
                    .from('idols')
                    .select('id, name')
                    .eq('name', idol.name)
                    .maybeSingle();

                if (!existingCheck) {
                    const { group_id, ...rest } = idol;
                    finalIdolsToInsert.push(rest);
                } else {
                    console.log(`Skipping ${idol.name} - already exists in database`);
                }
            }

            const newIdolIds = [];

            if (finalIdolsToInsert.length > 0) {
                console.log(`Memasukkan ${finalIdolsToInsert.length} idol baru ke database...`);

                // Insert with ON CONFLICT handling
                const { data: insertData, error: insertError } = await supabase
                    .from('idols')
                    .upsert(finalIdolsToInsert, {
                        onConflict: 'name',
                        ignoreDuplicates: true
                    })
                    .select('id, name');

                if (insertError) {
                    console.error('Gagal insert idol baru:', insertError.message);
                    return NextResponse.json({
                        message: 'Gagal insert idol baru',
                        error: insertError.message,
                        newIdolNames,
                        existingIdolNames,
                        failedNames
                    }, { status: 500 });
                }

                if (insertData && insertData.length > 0) {
                    newIdolIds.push(...insertData.map(item => item.id));
                    console.log(`Berhasil memasukkan ${insertData.length} idol baru.`);
                }
            }

            // Handle group relationships
            if (newIdolIds.length > 0) {
                console.log("Memproses relasi grup...");
                const idolsWithGroups = [];

                for (let i = 0; i < newIdolDetails.length; i++) {
                    const idol = newIdolDetails[i];
                    if (!idol || !idol.group_id || idol.group_id.length === 0) continue;

                    const idolID = newIdolIds[i];
                    if (!idolID) continue;

                    for (const groupId of idol.group_id) {
                        if (groupId) {
                            idolsWithGroups.push({
                                group_id: groupId,
                                idol_id: idolID
                            });
                        }
                    }
                }

                if (idolsWithGroups.length > 0) {
                    const { error: groupInsertError } = await supabase
                        .from('idols_groups')
                        .upsert(idolsWithGroups, {
                            onConflict: 'idol_id, group_id',
                            ignoreDuplicates: true
                        });

                    if (groupInsertError) {
                        console.error('Gagal memasukkan relasi idol dan grup:', groupInsertError.message);
                    } else {
                        console.log(`Berhasil memasukkan ${idolsWithGroups.length} relasi grup.`);
                    }
                }
            }
        }

        // 5. Proses Update (dengan handling yang lebih aman)
        if (existingIdolNames.length > 0) {
            console.log("Memulai proses pengecekan update untuk idol lama...");
            const idolsToUpdate = [];

            // Process updates in smaller batches
            const UPDATE_BATCH_SIZE = 20;
            for (let i = 0; i < existingIdolNames.length; i += UPDATE_BATCH_SIZE) {
                const batch = existingIdolNames.slice(i, i + UPDATE_BATCH_SIZE);

                const updatePromises = batch.map((name) => {
                    return limit(async () => {
                        try {
                            await delay(50);
                            return await GetIdolsDetails(name);
                        } catch (error) {
                            console.error(`Gagal mengambil detail update untuk ${name}:`, error.message);
                            return null;
                        }
                    });
                });

                const batchResults = await Promise.all(updatePromises);

                for (const idol of batchResults) {
                    if (!idol) continue;

                    const oldDetailDb = dbIdolMap.get(idol.name);
                    if (!oldDetailDb) continue;

                    const normalizedNew = NormalizedDetailFormat(idol);
                    const normalizedOld = NormalizedDetailFormat(oldDetailDb);

                    if (JSON.stringify(normalizedNew) !== JSON.stringify(normalizedOld)) {
                        console.log(`Perubahan terdeteksi untuk: ${idol.name}. Akan diupdate.`);
                        // Remove group_id before updating idols table
                        const { group_id, ...idolDataWithoutGroups } = normalizedNew;
                        idolsToUpdate.push({ ...idolDataWithoutGroups, id: oldDetailDb.id });

                        // Handle group relationships separately for updates
                        if (group_id && group_id.length > 0) {
                            // First, delete existing relationships for this idol
                            await supabase
                                .from('idols_groups')
                                .delete()
                                .eq('idol_id', oldDetailDb.id);

                            // Then insert new relationships
                            const groupRelations = group_id.map(groupId => ({
                                group_id: groupId,
                                idol_id: oldDetailDb.id
                            }));

                            const { error: groupUpdateError } = await supabase
                                .from('idols_groups')
                                .insert(groupRelations);

                            if (groupUpdateError) {
                                console.error(`Gagal update relasi grup untuk ${idol.name}:`, groupUpdateError.message);
                            }
                        }
                    }
                }

                if (i + UPDATE_BATCH_SIZE < existingIdolNames.length) {
                    await delay(300);
                }
            }

            if (idolsToUpdate.length > 0) {
                console.log(`Mengupdate ${idolsToUpdate.length} idol di database...`);
                const { error: updateError } = await supabase
                    .from('idols')
                    .upsert(idolsToUpdate, { onConflict: 'id' });

                if (updateError) {
                    console.error(`Gagal melakukan bulk upsert:`, updateError.message);
                } else {
                    console.log("Proses update selesai.");
                }
            } else {
                console.log("Tidak ada detail idol yang perlu diupdate.");
            }
        }

        return NextResponse.json({
            message: "Proses sinkronisasi selesai.",
            newIdolsAdded: newIdolNames.length,
            idolsProcessed: newIdolNames.length - failedNames.length,
            idolsFailed: failedNames.length,
            failedNames: failedNames
        });

    } catch (error) {
        console.error("Terjadi error fatal di proses GET:", error.message);
        return NextResponse.json({
            message: "Terjadi error internal",
            error: error.message
        }, { status: 500 });
    }
}