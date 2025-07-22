// app/api/boy-groups/route.ts

import { NextResponse } from 'next/server';

const apiKey = process.env.RAPIDAPI_KEY;

// Fungsi ini bernama GET, sesuai standar HTTP Method
export async function GetBoyGroups() {

    // 1. Cek API Key di awal untuk keamanan dan kejelasan error
    if (!apiKey || typeof apiKey !== 'string') {
        console.error('RapidAPI key is not configured on the server.');
        return NextResponse.json(
            { error: 'Server configuration error: API key is missing.' },
            { status: 500 }
        );
    }

    const url = `https://k-pop.p.rapidapi.com/boy-groups?by=Group%20Name`;
    const options = {
        method: 'GET',
        headers: {
            // 2. Sekarang kita yakin apiKey adalah string
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'k-pop.p.rapidapi.com'
        }
    };

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            // Handle jika API eksternal memberi error
            const errorText = await response.text();
            console.error('RapidAPI Error:', errorText);
            return NextResponse.json({ error: 'Failed to fetch data from RapidAPI.' }, { status: response.status });
        }
        const result = await response.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error('Internal fetch error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}

export async function GetGirlGroups() {
    if (!apiKey || typeof apiKey !== 'string') {
        console.error('RapidAPI key is not configured on the server.');
        return NextResponse.json(
            { error: 'Server configuration error: API key is missing.' },
            { status: 500 }
        );
    }

    const url = `https://k-pop.p.rapidapi.com/girl-groups?by=Group%20Name`;
    const options = {
        method: 'GET',
        headers: {
            // 2. Sekarang kita yakin apiKey adalah string
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': 'k-pop.p.rapidapi.com'
        }
    };

    try {
        const response = fetch(url, options)

        if (!response.ok) {
                        const errorText = await response.text();
            console.error('RapidAPI Error:', errorText);
            return NextResponse.json({ error: 'Failed to fetch data from RapidAPI.' }, { status: response.status });
        }
    } catch {

    }
}