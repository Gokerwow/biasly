import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

interface groups {
    pageid: number,
    ns: number,
    title: string
}

export async function GET(request: Request) {
    console.log("🚀 Starting database seeding process...");
    try {
        const response = await fetch('https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:male%20groups&cmlimit=500&format=json&origin=*')

        if (!response.ok) {
            throw new Error(`Http Errorrr ${response.status}`)
        }

        const result = await response.json()

        const groupsArray = result.query.categorymembers;

        const supabase = await createClient();

        const uniqueGroups = Array.from(groupsArray.values());

        const { data: existingGroups, error: selectError } = await supabase
            .from('groups')
            .select('page_id');

        if (selectError) {
            console.error("Supabase select error:", selectError);
            throw selectError;
        }

        const existingPageIds = 

        const dataToInsert = groupsArray.map(group => ({
            page_id: group.pageid, // 'pageid' dari Fandom -> 'page_id' di tabel
            name: group.title,
            ns: group.ns
        }));

        const { error } = await supabase
            .from('groups')
            .insert(dataToInsert)

        if (error) {
            console.error("Supabase insert error:", error);
            throw error; // Lemparkan error agar ditangkap oleh blok catch
        }
        console.log("✅ Seeding successful!");
        return NextResponse.json(groupsArray);

    } catch (error) {
        console.error('Seeding failed:', error);
        return NextResponse.json({ error: 'Seeding process failed.', details: error.message }, { status: 500 });
    }
}