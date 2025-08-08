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
            .select('*')

        if (selectError) {
            console.error("Supabase select error:", selectError);
            throw selectError;
        }

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

        const idolArray = idols.map(idol => {
            return {
                id: idol.id,
                name: idol.name
            }
        })

        const idolPromises = idolArray.map(async (Idol) => {
            try {

                const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(Idol.name)}&prop=text&format=json&origin=*`

                const response = await fetch(url)

                if (!response.ok) {
                    throw new Error(`HTTP Error ${response.status}`)
                }

                const result = await response.json()

                if (result.error) {
                    // Handle specific API errors
                    if (result.error.code === 'missingtitle') {
                        console.log(`Halaman tidak ditemukan untuk idol: ${Idol.name}`);
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
                    console.log(`tidak ditemukan group atau assosiation untuk idol ${Idol.name}`)
                    return { name: Idol.name, groups: [] }
                }

                IdolGroups.find('a, span').each((_, element) => {
                    const $item = $(element)
                    const name = $item.text()
                    groups.push(name)
                })

                const { data: selectGroups, error: selectGroupsError } = await supabaseAdmin // isinya grup yang ada
                    .from('groups')
                    .select('id, name')
                    .in('name', groups)

                if (selectGroupsError) {
                    console.error(`Supabase select groups error ${Idol.name}:`, selectGroupsError);
                }

                if (selectGroups?.length === 0) {
                    console.log(`tidak ditemukan grup yang cocok untuk idol ${Idol.name}`)
                    return { name: Idol.name, groups: [] }
                }

                const existingGroup = selectGroups?.map(group => group.name)
                const unavailableGroups = groups.filter(group => !existingGroup?.includes(group))
                const GroupFromInsert = []

                if (unavailableGroups.length > 0) {
                    const groupInsert = unavailableGroups.map(name => ({name: name}))
                    
                    const { data: groupData, error: insertError } = await supabaseAdmin
                        .from('groups')
                        .insert(groupInsert)
                        .select('id')

                    if (insertError) {
                        console.error(`Supabase insert groups error ${Idol.name}:`, insertError);
                    } else {
                        GroupFromInsert.push(...groupData)
                    }
                }

                const allGroups = [...(selectGroups ?? []), ...GroupFromInsert]
                [
  { id: 1, name: 'IVE' },
  { id: 2, name: 'aespa' },
  { id: 10, name: 'Soloist' }
]
                if (allGroups.length === 0) {
                    console.log(`tidak ditemukan grup yang cocok untuk idol ${Idol.name}`)
                    return { name: Idol.name, groups: [] }
                }


                await delay(100)

                return {
                    id: Idol.id,
                    name: Idol.name,
                    groups: groups
                }
            } catch (error) {
                console.error(`Error saat memproses ${Idol.name}:`, error);
                return null;
            }
        })

        const results = await Promise.all(idolPromises)


    } catch (error) {
        console.error("Proses Gagal Total:", error);
    }
}