// app/api/groups/route.ts

import { NextResponse } from 'next/server';

const apiKey = process.env.RAPIDAPI_KEY;

async function getGroupImage(groupName: string): Promise<string | null> {
    const url = `https://kpop.fandom.com/api.php?action=query&titles=${encodeURIComponent(groupName)}&prop=pageimages&format=json&pithumbsize=500&origin=*`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Jika fetch gagal, langsung keluar
            console.error(`Fandom API error for ${groupName}: Status ${response.status}`);
            return null;
        }

        const imageData = await response.json();
        const pageID = Object.keys(imageData.query.pages)[0];

        if (pageID === "-1" || !imageData.query.pages[pageID].thumbnail) {
            return null; // Grup tidak ditemukan atau tidak ada gambar
        }
        
        // ✅ Perbaikan 1: Kembalikan URL gambarnya saja, bukan seluruh objek
        return imageData.query.pages[pageID].thumbnail.source;
    } catch (error) {
        console.error(`Failed to fetch image for ${groupName}:`, error);
        return null;
    }
}

export async function GET() {
    if (!apiKey || typeof apiKey !== 'string') {
        return NextResponse.json({ error: 'Server configuration error: API key is missing.' }, { status: 500 });
    }

    const options = {
        method: 'GET',
        headers: { 'x-rapidapi-key': apiKey, 'x-rapidapi-host': 'k-pop.p.rapidapi.com' }
    };

    const boyGroupsUrl = `https://k-pop.p.rapidapi.com/boy-groups?by=Group%20Name`;
    const girlGroupsUrl = `https://k-pop.p.rapidapi.com/girl-groups?by=Group%20Name`;

    try {
        const [boyGroupsResponse, girlGroupsResponse] = await Promise.all([
            fetch(boyGroupsUrl, options),
            fetch(girlGroupsUrl, options)
        ]);

        if (!boyGroupsResponse.ok || !girlGroupsResponse.ok) {
            return NextResponse.json({ error: 'Failed to fetch data from RapidAPI.' }, { status: 502 });
        }

        // Ambil data JSON mentah
        const boyGroupsData = await boyGroupsResponse.json();
        const girlGroupsData = await girlGroupsResponse.json();

        // Gabungkan menjadi satu array
        const allGroups = [...boyGroupsData, ...girlGroupsData];

        // ✅ Perbaikan 2: Gunakan Promise.all untuk menunggu semua fetch gambar selesai
        // dan simpan hasilnya ke variabel baru 'enrichedGroups'
        const enrichedGroups = await Promise.all(
            allGroups.map(async (group) => {
                const photoUrl = await getGroupImage(group.name);
                return {
                    ...group,
                    picture: photoUrl || 'https://via.placeholder.com/150' // Beri gambar placeholder jika foto tidak ada
                };
            })
        );

        // ✅ Perbaikan 3: Kembalikan hasil yang sudah diperkaya ke frontend
        return NextResponse.json(enrichedGroups);

    } catch (error) {
        console.error('Internal fetch error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}