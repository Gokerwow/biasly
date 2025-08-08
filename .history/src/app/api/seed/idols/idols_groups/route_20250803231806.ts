import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: idols, error: selectError } = await supabaseAdmin
            .from('idols')
            .select('name')

        if (selectError) {
            console.error("Supabase select error:", selectError);
            throw selectError;
        }

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

        const idolArray = idols.map(idol => idol.name)

        const idolPromises = idolArray.map(async (idolName) => {
            try {

                const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(idolName)}&prop=text&format=json&origin=*`

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

                const groups: string[] = []

                const html = result.parse.text['*']
                const $ = cheerio.load(html)
                const associationsSelector = '[data-source="associated"] .pi-data-value'
                const IdolGroups = $(associationsSelector)

                if (IdolGroups.length === 0) {
                    console.log(`tidak ditemukan group atau assosiation untuk idol ${idolName}`)
                    return { name: idolName, groups: [] }
                }

                IdolGroups.find('a, span').each((_, element) => {
                    const $item = $(element)
                    const name = $item.text()
                    groups.push(name)
                })

                await delay(100)

                return {
                    name: idolName,
                    groups: groups
                }
            } catch (error) {
                console.error(`Error saat memproses ${idolName}:`, error);
                return null;
            }
        })



    } catch (error) {
        console.error("Proses Gagal Total:", error);
    }
}