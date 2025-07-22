import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {

    console.log("🚀 Starting database seeding process...");

    const supabase = createClient()

    try {
        const response = await fetch('https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:male%20groups&cmlimit=500&format=json&origin=*')

        if (!response.ok) {
            throw new Error(`Http Errorrr ${response.status}`)
        }

        const result = await response.json()

                const dataToInsert = allGroupsFromFandom.map(group => ({
            page_id: group.pageid, // 'pageid' dari Fandom -> 'page_id' di tabel
            title: group.title,
            ns: group.ns
        }));

        return NextResponse.json(result.query.categorymembers);

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 });
    }
}