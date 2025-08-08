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
        const url = `https://kpop.fandom.com/api.php?action=parse&page=${idolName}&prop=text&format=json&origin=*`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP Error ${response.status}`)
        }

        const result = await response.json()

        if (result.error) {
            throw new Error(`API Error: ${result.error.info}`);
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
            birth_date: string | null;
            birth_place: string | null;
            height: number | null;
            weight: number | null;
            blood_type: string | null;
            occupation: string[] | null;
            group_id: string | null;
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

        detail.name = idolName
        // Nama Stage
        const bTag = $('b').first()
        const name = bTag.text()
        // Ambil teks setelah <b> langsung (bukan parent!)
        const nextNode = (bTag[0] as any)?.next as any
        const nextText = nextNode?.data ?? ''
        const fullText = name + nextText  // contoh: "Ichika (이치카) is a ..."
        const koreanPattern = /[\uAC00-\uD7A3]/;
        const japanesePattern = /[\u3040-\u309F\u30A0-\u30FF]/;
        const textInKurung = fullText.match(/\(([^)]*)\)/)?.[1]
        const korean = fullText.match(/Korean:\s*([^;]+)/)?.[1]?.trim()
        const japanese = fullText.match(/Japanese:\s*([^)]+)/)?.[1]?.trim()
        detail.stage_name = name
        if (korean || japanese) {
            detail.korean_stage_name = korean ?? null
            detail.japanese_stage_name = japanese ?? null
        } else {
            if (koreanPattern.test(textInKurung ?? '') || japanesePattern.test(textInKurung ?? '')) {
                if (koreanPattern.test(textInKurung ?? '')) {
                    detail.korean_stage_name = textInKurung ?? null
                } else if (japanesePattern.test(textInKurung ?? '')) {
                    detail.japanese_stage_name = textInKurung ?? null
                }
            } else {
                console.log(`Tidak ditemukan nama stage dalam bahasa Korea atau Jepang untuk idol ${idolName}`);
            }
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
        detail.birth_date = birthDate.split(' (')[0]

        // Birth Place
        const birthPlace = $('h3.pi-data-label:contains("Birth place")')
            .next('.pi-data-value')
            .text()
        detail.birth_place = birthPlace

        // height
        const height = $('h3.pi-data-label:contains("Height")')
            .next('.pi-data-value')
            .text()
        detail.height = Number(height.split(' ')[0])

        // weight
        const weight = $('h3.pi-data-label:contains("Weight")')
            .next('.pi-data-value')
            .text()
        detail.weight = Number(weight.split(' ')[0])

        // blood Type
        const blood_type = $('h3.pi-data-label:contains("Blood type")')
            .next('.pi-data-value')
            .text()
        detail.blood_type = blood_type

        // Occupation
        const occupation = $('h3.pi-data-label:contains("Occupation")')
            .next('.pi-data-value')
            .text()
        detail.occupation = occupation.split(',').map((item) => item.trim())

        // Agency
        const AgencyDiv = $('h3.pi-data-label:contains("Agency")')
            .next('.pi-data-value')

        const agencyHtml = AgencyDiv.html()?.split('<br>')
        const Agency = agencyHtml?.map((item, _) => {
            const name = $(item).filter('a').text()
            const periode = $(item).filter('span').text()
            return {
                name: name,
                periode: periode
            }
        })
        detail.agency = Agency ?? null

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
                relationhip: text,
                name: relationNameArray
            }
        }).get()

        detail.relationship = relationName

        // fandom color
        const fandom_color = $('h3.pi-data-label:contains("Color(s)")')
            .next('.pi-data-value')
            .text()
        detail.fandom_color = fandom_color.split(',').map((item) => item.trim())

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
        detail.sns = sns.map((item) => getSocial(item))

        // Foto
        const ImageHREF = $('figure.pi-image a')
        const ImageUrl = ImageHREF.attr('href')
        detail.image_url = ImageUrl ?? null

        // solo_debut
        const soloDebutText = $('h3.pi-data-label:contains("Solo debut")')
            .next('.pi-data-value')
            .text()
        detail.solo_debut = parse(soloDebutText, 'MMMM d, yyyy', new Date())

        return detail

    } catch (error) {
        console.error(`Gagal mengambil data detail idol ${idolName}:`, error);
    }
}

export async function GET() {
    try {
        const supabase = await createClient();
        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        // 1. Ambil SEMUA data dari DB sekali saja di awal
        console.log("Mengambil data idol yang ada dari database...");
        const { data: dbIdols, error: dbError } = await supabase.from('idols').select('*');
        if (dbError) {
            console.error('Error mengambil data dari DB:', dbError.message);
            return NextResponse.json({ message: 'Gagal mengambil data dari DB' }, { status: 500 });
        }

        // Gunakan Map untuk pencarian super cepat berdasarkan stage_name
        const dbIdolMap = new Map(dbIdols.map(idol => [idol.stage_name, idol]));
        console.log(`Ditemukan ${dbIdolMap.size} idol di database.`);

        // 2. Ambil SEMUA nama idol dari API
        console.log("Mengambil daftar nama idol dari API...");
        const categories = ['soloists', 'singers', 'rappers', 'trainees'];
        const genders = ['male', 'female'];
        const promises = [];

        genders.forEach(gender => {
            categories.forEach(category => {
                promises.push(GetIdols(gender, category));
            });
        });

        const apiIdolNameArrays = await Promise.all(promises);
        const apiIdolNamesRaw = apiIdolNameArrays.flat();
        const uniqueApiIdolNames = [...new Set(apiIdolNamesRaw)].map(name => name.split(' (')[0].trim());
        console.log(`Ditemukan ${uniqueApiIdolNames.length} nama idol unik dari API.`);

        // 3. Pisahkan mana yang baru dan mana yang sudah ada
        const newIdolNames = [];
        const existingIdolNames = [];

        uniqueApiIdolNames.forEach(name => {
            if (!dbIdolMap.has(name)) {
                newIdolNames.push(name);
            } else {
                existingIdolNames.push(name);
            }
        });

        console.log(`Idol baru untuk diproses: ${newIdolNames.length}`);
        console.log(`Idol lama untuk dicek update: ${existingIdolNames.length}`);

        // 4. Proses Idol BARU (jika ada)
        if (newIdolNames.length > 0) {
            console.log("Memulai proses pengambilan detail untuk idol baru...");
            const allPromises = newIdolNames.map((name) => {
                return limit(() => GetIdolsDetails(name));
            })
            const newIdolDetails = await Promise.all(allPromises)

            if (newIdolDetails.length > 0) {
                console.log(`Memasukkan ${newIdolDetails.length} idol baru ke database...`);
                const { error: insertError } = await supabase
                    .from('idols')
                    .insert(newIdolDetails);
                if (insertError) {
                    console.error('Gagal insert idol baru:', insertError.message);
                } else {
                    console.log("Berhasil memasukkan idol baru.");
                }
            }
        }

        const limit = pLimit(30);

        // 5. Proses Idol LAMA untuk di-UPDATE (jika ada)
        if (existingIdolNames.length > 0) {
            console.log("Memulai proses pengecekan update untuk idol lama...");
            const idolsToUpdate = [];
            const allUpdatePromises = existingIdolNames.map((name) => {
                return limit(() => GetIdolsDetails(name))
            })
            const newDetailApi = await Promise.all(allUpdatePromises)

            for (const idol of newDetailApi) {
                const oldDetailDb = dbIdolMap.get(idol?.name);
                const normalizedNew = NormalizedDetailFormat(idol);
                const normalizedOld = NormalizedDetailFormat(oldDetailDb);
                // Bandingkan, jika berbeda, tambahkan ke list update
                if (JSON.stringify(normalizedNew) !== JSON.stringify(normalizedOld)) {
                    console.log(`Perubahan terdeteksi untuk: ${idol?.name}. Akan diupdate.`);
                    idolsToUpdate.push(normalizedNew);
                }
            }


            if (idolsToUpdate.length > 0) {
                console.log(`Mengupdate ${idolsToUpdate.length} idol di database...`);
                const { error: updateError } = await supabase
                    .from('idols')
                    .upsert(idolsToUpdate)
                if (updateError) {
                    console.error(`Gagal melakukan bulk upsert:`, updateError.message);
                }
                console.log("Proses update selesai.");
            } else {
                console.log("Tidak ada detail idol yang perlu diupdate.");
            }
        }

        return NextResponse.json({
            message: "Proses sinkronisasi selesai.",
            newIdolsAdded: newIdolNames.length
        });

    } catch (error) {
        console.error("Terjadi error fatal di proses GET:", error.message);
        return NextResponse.json({ message: "Terjadi error internal" }, { status: 500 });
    }
}