import { createClient } from "@/utils/supabase/client"

export async function SeedGroups() {
    const MaleURL = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:male%20groups&cmlimit=500&format=json&origin=*`
    const GirlURL = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:female%20groups&cmlimit=500&format=json&origin=*`

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
        const girlGroups = girlResult.query.categorymembers.map(group => ({
        ...group,
        category: 'female' // Tambahkan properti kategori
    }));
    const supabase = createClient()

    const { data: existingGroups, error: selectError } = await supabase
        .from('groups')
        .select('page_id');

    if (selectError) {
        console.error("Supabase select error:", selectError);
        throw selectError;
    }

    const existingPageIds = new Set(existingGroups.map(group => group.page_id));

    const newMaleGroupsToInsert = MaleGroupsArray.filter(MaleGroup => !existingPageIds.has(MaleGroup.pageid));
    const newGirlGroupsToInsert = GirlGroupsArray.filter(GirlGroup => !existingPageIds.has(GirlGroup.pageid));

    if (newMaleGroupsToInsert.length === 0) {
        console.log("✅ No new Male groups to add. Database is up to date.");
        return {
            message: "Database is already up to date!",
            insertedCount: 0
        };
    }

    if (newGirlGroupsToInsert.length === 0) {
        console.log("✅ No new Female groups to add. Database is up to date.");
        return {
            message: "Database is already up to date!",
            insertedCount: 0
        };
    }

    const MaleDataToInsert = newMaleGroupsToInsert.map(group => ({
        page_id: group.pageid, // 'pageid' dari Fandom -> 'page_id' di tabel
        name: group.title,
        ns: group.ns
    }));
    const GirlDataToInsert = newGirlGroupsToInsert.map(group => ({
        page_id: group.pageid, // 'pageid' dari Fandom -> 'page_id' di tabel
        name: group.title,
        ns: group.ns
    }));

    const { error } = await supabase
        .from('groups')
        .insert(dataToInsert)


}