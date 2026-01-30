/* eslint-disable @typescript-eslint/no-explicit-any */
import { GroupsCategories } from '@/constants'
import { delay } from '../../src/app/lib/delay'
import { fetchList, rawDataProps } from '../fetchList'
import GroupScraping from '../group/scrape'
import IdolScraping from '../idol/scrape'

import { createClient } from '@supabase/supabase-js'

export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

async function seed() {
    console.log('SEEDING DATABASE..........')

    const supabase = await createAdminClient()
    const groupsCategoryNames = Object.values(GroupsCategories)
    const allGroupsList: rawDataProps[] = []

    // 1. Fetch the big list from Wiki (This part MUST happen, takes ~1-2 mins)
    console.log("📥 Fetching Master List from Wiki...");
    for (let i = 0; i < groupsCategoryNames.length; i++) {
        const category = groupsCategoryNames[i]
        // console.log(category) // Comment this out to reduce noise
        const fetchData = await fetchList(category)
        allGroupsList.push(...fetchData)
        await delay(500); // Reduced delay slightly
    }
    console.log(`✅ Master List acquired: ${allGroupsList.length} groups found.`);

    // 2. ⚡ OPTIMIZATION: Get ALL existing PageIDs from Supabase at once
    console.log("🔍 Checking Supabase for existing groups...");

    let existingGroups: any[] = [];
    let hasMoreGroups = true;
    let page = 0;
    const pageSize = 1000;

    // LOOP until we have fetched EVERY row
    while (hasMoreGroups) {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase
            .from('groups')
            .select('wiki_page_id, wiki_last_updated')
            .range(from, to); // Ask for a specific slice

        if (error) {
            console.error("❌ Error fetching page", page, error);
            break; // Stop on error
        }

        if (data && data.length > 0) {
            existingGroups = existingGroups.concat(data);
            console.log(`   Fetched rows ${from} to ${from + data.length}...`);

            // If we got less than we asked for, we are done
            if (data.length < pageSize) {
                hasMoreGroups = false;
            } else {
                page++; // Get next page
            }
        } else {
            hasMoreGroups = false; // No more data
        }
    }

    console.log(`📊 TOTAL Found ${existingGroups.length} groups in DB.`);

    // Map: { "12345" : 1719577669000 }
    const existingMap = new Map<string, number>();

    existingGroups.forEach(g => {
        if (g.wiki_page_id && g.wiki_last_updated) {
            // Convert DB String to Number (Timestamp)
            const timeValue = new Date(g.wiki_last_updated).getTime();
            existingMap.set(String(g.wiki_page_id), timeValue);
        }
    });

    // ---------------------------------------------------------
    // 3. Filter the list (Same as before)
    // ---------------------------------------------------------
    const groupsToProcess = allGroupsList.filter(group => {
        const groupKey = String(group.pageid);
        const dbTime = existingMap.get(groupKey);

        // 1. New Group? -> KEEP 
        if (!dbTime) return true;

        // 2. Compare Dates
        const wikiTime = new Date(group.last_updated).getTime();
        const difference = Math.abs(wikiTime - dbTime);

        if (difference < 2000) {
            return false; // Match -> SKIP
        }

        return true; // Update needed
    });

    console.log(`📉 Filtered out ${allGroupsList.length - groupsToProcess.length} existing groups.`);
    console.log(`🚀 Starting processing on ${groupsToProcess.length} remaining groups...`);

    // 4. Process ONLY the ones that need work
    for (let i = 0; i < groupsToProcess.length; i++) {
        const group = groupsToProcess[i]

        console.log(`[${i + 1}/${groupsToProcess.length}] Processing ${group.title}...`)

        // No need to check Supabase again inside the loop!
        await GroupScraping(group.pageid, group.title, group.last_updated, group.category_name)

        // Delay to be nice to Wiki
        await delay(1000);
    }

// 1. Define the cutoff time
    const cutOffDate = new Date();
    cutOffDate.setHours(cutOffDate.getHours() - 24);

    // ---------------------------------------------------------
    // 🆕 NEW: Count TOTAL items to process before starting
    // ---------------------------------------------------------
    console.log("📊 Calculating total idols to sync...");
    
    const { count: totalToProcess, error: countError } = await supabase
        .from('idols')
        .select('*', { count: 'exact', head: true }) // 'head: true' means just count, don't fetch data
        .or(`last_synced_at.is.null,last_synced_at.lt.${cutOffDate.toISOString()}`);

    if (countError) {
        console.error("❌ Failed to count idols:", countError);
        throw countError;
    }

    if (totalToProcess === 0) {
        console.log("✅ All idols are already up to date! Nothing to do.");
        return; // Or 'process.exit(0)' depending on your structure
    }

    console.log(`🚀 Found ${totalToProcess} idols needing updates.`);

    // ---------------------------------------------------------
    // Start the Loop
    // ---------------------------------------------------------
    let hasMore = true
    let processedCount = 0; // 🆕 Track how many we have done

    while (hasMore) {
        const { data: idolData, error: idolError } = await supabase
            .from('idols')
            .select('id, slug, stage_name, wiki_page_id, wiki_last_updated')
            .or(`last_synced_at.is.null,last_synced_at.lt.${cutOffDate.toISOString()}`)
            .order('last_synced_at', { ascending: true, nullsFirst: true })
            .limit(20);

        if (idolError) {
            console.error('error di idol', idolError)
            throw idolError
        }

        if (!idolData || idolData.length === 0) {
            console.log("✅ All idols are up to date!")
            hasMore = false
            break;
        }

        for (const idol of idolData) {
            processedCount++; // 🆕 Increment counter
            
            // Calculate Percentage
            const percent = ((processedCount / totalToProcess!) * 100).toFixed(1);
            
            console.log(`[${processedCount}/${totalToProcess}] (${percent}%) Processing: ${idol.stage_name}...`);

            try {
                await IdolScraping(idol.stage_name, idol.id, idol.wiki_page_id ?? undefined, idol.wiki_last_updated ?? undefined);
                await delay(500);
            } catch (err) {
                console.error(`⚠️ Failed to scrape ${idol.stage_name}:`, err)

                // Force update so we don't get stuck on this one forever
                await supabase
                    .from('idols')
                    .update({ last_synced_at: new Date().toISOString() })
                    .eq('id', idol.id);
            }
        }
    }

    console.log('Done scraping and seeding to supabase!')
}

seed()
    .then(() => process.exit(0)) // Success! Force the terminal to close.
    .catch((err) => {
        console.error(err)         // Log the error
        process.exit(1)            // Failure! Force close with "Error Code 1"
    })