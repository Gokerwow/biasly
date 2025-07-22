'use client'

import { createClient } from "@/utils/supabase/client"

export async function GetBoyGroups(request: Request) {
    const url = `https://k-pop.p.rapidapi.com/boy-groups?q=BTS&by=Active`
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': '1ccfb5a556msh440cabb36818780p15b82djsn2bb4724f9e8c',
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