import { NextResponse } from "next/server";

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

        while (hasMore) {
            const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*${encodeURIComponent(continueToken ?? '')}`
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
            }

            const IdolName = result.query.categorymembers.map((name: CategoryMember) => name.title)

            return IdolName
        }

    } catch (error) {
        console.error("Gagal mengambil data idol:", error);
        return []
    }
}

export async function GetIdolsDetails(params: type) {

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