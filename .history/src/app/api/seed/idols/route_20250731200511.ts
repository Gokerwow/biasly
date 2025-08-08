import { NextResponse } from "next/server";
import * as cheerio from 'cheerio';

interface CategoryMember {
    pageid: number;
    ns: number;
    title: string;
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
            periode: string | null
        }

        interface PersonalLife {
            relationship: string | null,
            name: PersonalLifeDetail[] | null
        }


        interface IdolDetail {
            stage_name: string | null;
            birth_name: string | null;
            korean_birth_name: string | null,
            korean_stage_name: string | null,
            japanese_stage_name: string | null,
            birth_date: string | null;
            birth_place: string | null;
            height: number | null;
            weight: number | null;
            blood_type: string | null;
            occupation: string[] | null;
            group_id: string | null;
            agency: string[] | null;
            family: PersonalLife[] | null;
            fandom_color: string[] | null;
            sns: SocialMediaLink[] | null;
            image_url: string | null;
        }

        const detail: IdolDetail = {
            stage_name: '',
            birth_name: '',
            korean_birth_name: '',
            korean_stage_name: '',
            japanese_stage_name: '',
            birth_date: '',
            birth_place: '',
            height: null,
            weight: null,
            blood_type: '',
            occupation: [],
            group_id: '',
            agency: [],
            family: [],
            fandom_color: [],
            sns: [],
            image_url: null
        }

        const htmlString = result.parse.text['*']
        const $ = cheerio.load(htmlString)
        // Nama Stage
        const bTag = $('b').first()
        const name = bTag.text()
        const fullText = bTag.parent().text() // ambil teks parent-nya (biasanya <p>)
        const korean = fullText.match(/Korean:\s*([^;]+)/)?.[1]?.trim()
        const japanese = fullText.match(/Japanese:\s*([^)]+)/)?.[1]?.trim()
        detail.stage_name = name
        detail.korean_stage_name = korean ?? null
        detail.japanese_stage_name = japanese ?? null

        // Nama Birth
        const birthName = $('h3.pi-data-label:contains("Birth name")')
            .next('.pi-data-value')
            .text()

        const splitBirthName = birthName.split(' ')
        detail.birth_name = splitBirthName[0]
        detail.korean_birth_name = splitBirthName[1]?.replace(/[()]/g, '') || null

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
        const Agency = $('h3.pi-data-label:contains("Agency")')
            .next('.pi-data-value')
            .find('a')
            
        detail.agency = Agency.map((_, item) => {
            item
        })

        // family
        const relationshipText = $('h2.pi-header:contains("Personal Life")') // 
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
                const $item = $(item)
                const name = $item.find('a').text()
                const periode = $item.find('span').text().replace('(', '').replace(')', '')
                return {
                    name: name,
                    periode: periode
                }
            }) // [{name: jennie, periode: 2018}, {name:krystal, periode: 2016}]
            return {
                relationhip: text,
                name: relationNameArray
            }
        }).get()

        detail.family = relationName

        // fandom color
        const fandom_color = $('h3.pi-data-label:contains("Color(s)")')
            .next('.pi-data-value')
            .text()
        detail.fandom_color = fandom_color.split(',').map((item) => item.trim())

        // Sosmed
        const snsHtml = $('td [data-source="sns"] span a')
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

        return detail

    } catch (error) {
        console.error("Gagal mengambil data detail idol:", error);
    }
}

export async function GET() {
    try {
        const categories = ['soloists', 'singers', 'rappers', 'trainees']
        const genders = ['male', 'female']

        const promises = [];
        genders.forEach(gender => {
            categories.forEach(category => {
                // Jangan await di sini, cukup panggil fungsinya untuk mendapatkan Promise
                promises.push(GetIdols(gender, category));
            });
        });

        const idolName = await Promise.all(promises);
        const allIdolNames = idolName.flat()
        const uniqueIdolNameSet = new Set(allIdolNames) 
        const uniqueIdolNameArray = [...uniqueIdolNameSet]
        const allIdolDetails = [];
        const perBatch = 10
        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

        // for(let i = 0; i < uniqueIdolNameArray.length; i += perBatch ) {
            const currentBatch = uniqueIdolNameArray.slice(0, 10)
            const idolPromises = currentBatch.map((idol) => {
                return GetIdolsDetails(idol)
            })
            const idol = await Promise.all(idolPromises)
            allIdolDetails.push(idol)
            // await delay(2000);
        // }

        return NextResponse.json(allIdolDetails)

    } catch (error) {
        console.error("Gagal mengambil data idol:", error);
    }
}