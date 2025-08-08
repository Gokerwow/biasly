import { createClient } from "@/utils/supabase/server"
import * as cheerio from 'cheerio';

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
        title: group.title, // Pastikan nama kolom di DB adalah 'title'
        ns: group.ns,
        category: group.category // Masukkan data kategori baru
    }));

    const { error } = await supabase
        .from('groups')
        .insert(dataToInsert)

    if (error) {
        throw error;
    }

    return { message: "Seeding successful!", insertedCount: dataToInsert.length };
}

export async function SeedGroupsDetail() {
    const supabase = await createClient()

    const { data: GroupsData, error: SelectError } = await supabase
        .from('groups')
        .select('name')

    if (SelectError) {
        return { message: 'Select Error', error: SelectError }
    }

    GroupsData.forEach(async (group) => {
        const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(group.name)}&prop=text&format=json&origin=*`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Http Errorrr ${response.status} for ${group.name}`)
        }

        const result = await response.json()

        const htmlString = result.parse.text['*']

        const $ = cheerio.load(htmlString)

        const details = {
            hangulName: '',
            katakana: '',
            romanization: '',
            koreanDebutDate: '',
            japanDebutDate: '',
            origin: '',
            genres: '',
            members: [] as string[], // Tipe array string
            fandomName: '',
            imageUrl: ''
        };

        details.hangulName = $('h3.pi-data-label:contains("Hangul")')
            .next('pi-data-value')
            .text()

        details.katakana = $('h3.pi-data-label:contains("Katakana")')
            .next('pi-data-value')
            .text()

        details.romanization = $('h3.pi-data-label:contains("Romanization")')
            .next('pi-data-value')
            .text()

        const debutValueDiv = $('h3.pi-data-label:contains("Debut")')
            .next('pi-data-value')
            .next()

        if (debutValueDiv.length > 0) {
            const debutHtml = debutValueDiv.html();

            
        }
    })
}

export async function SeedIdol(GroupName) {

}