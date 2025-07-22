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
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error(error);
    }
}

export default function GroupsProvider() {
    const GroupsContext = createContext(null)

}