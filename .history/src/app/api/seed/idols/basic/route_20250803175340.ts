import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface CategoryMember {
    pageid: number;
    ns: number;
    title: string;
}

export async function GET() {
    try {
        const supabase = await createClient()

        const categories = ['soloists', 'singers', 'rappers', 'trainees'];
        const genders = ['male', 'female'];
        const IdolArray = []

        for (const category of categories) {
            for (const gender of genders) {
                let hasMore = true
                let continueToken;

                while (hasMore) {
                    const url: string = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(`${gender} ${category}`)}&cmlimit=500&format=json&origin=*&cmcontinue=${encodeURIComponent(continueToken ?? '')}`
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
            }
        }

        const IdolFlat = new Set(IdolArray.flat())
        const dataToInsert = IdolFlat.map(idolName => ({
            name: idolName
        }));

        const { error: insertError } = await supabase
            .from('idol')
            .upsert(dataToInsert, { onConflict: 'name' })

        if (insertError) {
            throw new Error(`Database Error: ${insertError.message}`);
        }

        return NextResponse.json({
            message: 'Berhasil Memasukkan data Idol',
            data: dataToInsert
        })
    } catch (error) {
        console.error("Gagal mengambil data nama idol:", error);
        return NextResponse.json({
            message: 'Gagal mengambil data nama idol',
            error: error.message
        })
    }
}