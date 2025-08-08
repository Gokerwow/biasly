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

        const htmlString = result.parse.text['*']

        const $ = cheerio.load(htmlString)

        const 

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

        const results = await Promise.all(promises);


        return NextResponse.json(results)

    } catch (error) {
        console.error("Gagal mengambil data idol:", error);
    }
}