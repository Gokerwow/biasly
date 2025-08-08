import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

// Helper function BARU yang menangani pagination
async function fetchAllCategoryMembers(categoryName: string): Promise<any[]> {
    let allMembers: any[] = [];
    let continueToken: string | null = null;
    let hasMore = true;

    console.log(`🌀 Fetching all members for category: ${categoryName}...`);

    while (hasMore) {
        let url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=${encodeURIComponent(categoryName)}&cmlimit=500&format=json&origin=*`;

        if (continueToken) {
            url += `&cmcontinue=${continueToken}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                console.error(`Fandom API Error for "${categoryName}" page: Status ${response.status}`);
                break; // Hentikan loop jika ada error
            }

            const data = await response.json();
            const members = data.query.categorymembers;

            if (members && members.length > 0) {
                allMembers = allMembers.concat(members);
                console.log(`...fetched ${allMembers.length} total members for ${categoryName}...`);
            }

            // Cek jika ada halaman selanjutnya
            if (data.continue && data.continue.cmcontinue) {
                continueToken = data.continue.cmcontinue;
            } else {
                hasMore = false; // Hentikan loop
            }
        } catch (error: any) {
            console.error(`Network Error while fetching category "${categoryName}":`, error.message);
            break; // Hentikan loop jika ada error jaringan
        }
    }

    console.log(`✅ Finished fetching for ${categoryName}. Total: ${allMembers.length}`);
    return allMembers;
}

export async function GET() {
    
            const [maleGroupsRaw, girlGroupsRaw] = await Promise.all([
            fetchAllCategoryMembers('Category:Male groups'),
            fetchAllCategoryMembers('Category:Female groups')
        ]);
    const arrayOfFetchPromises = [fetch(MaleURL), fetch(GirlURL)]

    const responses = await Promise.all(arrayOfFetchPromises)

    responses.forEach(response => {
        if (!response.ok) {
            throw new Error(`Salah satu panggilan API gagal dengan status: ${response.status}`);
        }
    });

    const MaleResponse = responses[0]
    const GirlResponse = responses[1]

    const MaleResult = await MaleResponse.json()
    const GirlResult = await GirlResponse.json()

    const maleGroups = MaleResult.query.categorymembers.map(group => ({
        ...group,
        category: 'male'
    }));

    const girlGroups = GirlResult.query.categorymembers.map(group => ({
        ...group,
        category: 'female'
    }));

    const allGroups = [...maleGroups, ...girlGroups];

    const supabase = await createClient()

    const { data: existingGroups, error: selectError } = await supabase
        .from('groups')
        .select('page_id');

    if (selectError) {
        console.error("Supabase select error:", selectError);
        throw selectError;
    }

    const existingPageIds = new Set(existingGroups.map(group => group.page_id));

    const newGroupsToInsert = allGroups.filter(group => !existingPageIds.has(group.pageid));

    if (newGroupsToInsert.length === 0) {
        console.log("✅ No new Male groups to add. Database is up to date.");
        return {
            message: "Database is already up to date!",
            insertedCount: 0
        };
    }

    const dataToInsert = newGroupsToInsert.map(group => ({
        page_id: group.pageid,
        name: group.title, // Pastikan nama kolom di DB adalah 'title'
        ns: group.ns,
        category: group.category // Masukkan data kategori baru
    }));

    const { error } = await supabase
        .from('groups')
        .insert(dataToInsert)

    if (error) {
        throw error;
    }

    const result = { message: "Seeding successful!", insertedCount: dataToInsert.length };

    return NextResponse.json(result)
}