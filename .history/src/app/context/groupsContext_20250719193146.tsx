'use client'

import { createClient } from "@/utils/supabase/client"
import { createContext } from "react";

export async function GetBoyGroups() {
    const url = `https://k-pop.p.rapidapi.com/boy-groups?q=BTS&by=Active`
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY,
            'x-rapidapi-host': 'k-pop.p.rapidapi.com'
        }
    };


    try {
        const response = await fetch(url, options);
        // Penting: Gunakan .json() jika API mengembalikan JSON
        const result = await response.json(); 
        
        // Kirim hasil yang berhasil ke frontend
        return NextResponse.json(result);
    } catch (error) {
        console.error('API call failed:', error);
        return NextResponse.json({ error: 'Failed to fetch data from K-pop API' }, { status: 502 });
    }
}

export default function GroupsProvider() {
    const GroupsContext = createContext(null)

}