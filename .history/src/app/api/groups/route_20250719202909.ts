// app/api/groups/route.ts

import { error, group } from 'console';
import { NextResponse } from 'next/server';

const apiKey = process.env.RAPIDAPI_KEY;

export async function GetGroupDetail(groupName: string) {
    const url = `https://kpop.fandom.com/api.php?action=query&titles=${encodeURIComponent(groupName)}&prop=pageimages&format=json&pithumbsize=500&origin=*`

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const Imagedata = await response.json()

    // Pastikan untuk menangani jika halaman tidak ada (data.error)
    if (Imagedata.error) {
        console.error('API Error:', data.error.info);
        // return null atau handle error
    } else {
        const htmlContent = data.parse.text['*'];
        // Lakukan sesuatu dengan htmlContent
        console.log(htmlContent);
    }

    return Imagedata
}

// Hanya satu fungsi GET yang diekspor dari file ini
export async function GET() {
    // Cek API Key sekali di awal
    if (!apiKey || typeof apiKey !== 'string') {
        console.error('RapidAPI key is not configured on the server.');
        return NextResponse.json(
            { error: 'Server configuration error: API key is missing.' },
            { status: 500 }
        );
    }

    // Opsi header yang sama untuk kedua permintaan
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'k-pop.p.rapidapi.com'
        }
    };

    // URL untuk kedua endpoint
    const boyGroupsUrl = `https://k-pop.p.rapidapi.com/boy-groups?by=Group%20Name`;
    const girlGroupsUrl = `https://k-pop.p.rapidapi.com/girl-groups?by=Group%20Name`;

    try {
        // 1. Gunakan Promise.all untuk menjalankan kedua fetch secara bersamaan (paralel)
        const [boyGroupsResponse, girlGroupsResponse] = await Promise.all([
            fetch(boyGroupsUrl, options),
            fetch(girlGroupsUrl, options)
        ]);

        // Cek jika salah satu permintaan gagal
        if (!boyGroupsResponse.ok || !girlGroupsResponse.ok) {
            console.error('One of the API calls failed.');
            // Anda bisa menambahkan logika error handling yang lebih detail di sini
            return NextResponse.json({ error: 'Failed to fetch data from one or more endpoints.' }, { status: 502 });
        }

        // 2. Ambil data JSON dari kedua respons
        const boyGroups = await boyGroupsResponse.json();
        const girlGroups = await girlGroupsResponse.json();

        // 3. Gabungkan hasilnya dalam satu objek dan kirim sebagai respons

        const allGroups = [...boyGroups, ...girlGroups]

        allGroups.map(async (group) => {

        })

    } catch (error) {
        console.error('Internal fetch error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}