// app/api/groups/route.ts

import { NextResponse } from 'next/server';

const apiKey = process.env.RAPIDAPI_KEY;

async function getGroupImage(groupName: string): Promise<string | null> {
    const url = `https://kpop.fandom.com/api.php?action=query&titles=${encodeURIComponent(groupName)}&prop=pageimages&format=json&pithumbsize=500&origin=*`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            // 💡 LOG SPESIFIK JIKA FANDOM API GAGAL
            console.error(`❌ Fandom API Error for group "${groupName}": Status ${response.status}`);
            return null;
        }
        const imageData = await response.json();
        const pageID = Object.keys(imageData.query.pages)[0];
        if (pageID === "-1" || !imageData.query.pages[pageID].thumbnail) {
            return null;
        }
        return imageData.query.pages[pageID].thumbnail.source;
    } catch (error: any) {
        // 💡 LOG SPESIFIK JIKA ADA ERROR JARINGAN (misal: VPN mati)
        console.error(`❌ Network Error fetching image for "${groupName}":`, error.message);
        return null;
    }
}

export async function GET() {
    // ... (kode pengecekan apiKey tetap sama) ...
    if (!apiKey) {
         return NextResponse.json({ error: 'Server configuration error: API key is missing.' }, { status: 500 });
    }

    const options = { /* ... headers ... */ };
    const boyGroupsUrl = `https://k-pop.p.rapidapi.com/boy-groups?by=Group%20Name`;
    const girlGroupsUrl = `https://k-pop.p.rapidapi.com/girl-groups?by=Group%20Name`;

    try {
        const [boyGroupsResponse, girlGroupsResponse] = await Promise.all([
            fetch(boyGroupsUrl, options),
            fetch(girlGroupsUrl, options)
        ]);

        // 💡 LOG SPESIFIK UNTUK SETIAP PANGGILAN RAPIDAPI
        if (!boyGroupsResponse.ok) {
            console.error('❌ RapidAPI Error (Boy Groups) failed with status:', boyGroupsResponse.status, await boyGroupsResponse.text());
        }
        if (!girlGroupsResponse.ok) {
            console.error('❌ RapidAPI Error (Girl Groups) failed with status:', girlGroupsResponse.status, await girlGroupsResponse.text());
        }
        if (!boyGroupsResponse.ok || !girlGroupsResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch data from RapidAPI.' }, { status: 502 });
        }
        
        // ... (sisa kode tetap sama) ...
        const boyGroupsData = await boyGroupsResponse.json();
        const girlGroupsData = await girlGroupsResponse.json();
        const allGroups = [...boyGroupsData, ...girlGroupsData];
        const enrichedGroups = await Promise.all(
            allGroups.map(async (group: any) => {
                const photoUrl = await getGroupImage(group.name);
                return { ...group, picture: photoUrl || 'https://via.placeholder.com/150' };
            })
        );
        return NextResponse.json(enrichedGroups);

    } catch (error: any) {
        console.error('❌ Internal Server Error in GET handler:', error.message);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}