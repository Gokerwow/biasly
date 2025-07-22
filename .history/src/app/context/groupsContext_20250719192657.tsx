'use client'

import { createClient } from "@/utils/supabase/client"

export async function GetBoyGroups(request: Request) {
    const url = `https://k-pop.p.rapidapi.com/boy-groups?q=BTS&by=Active`
    const param = {
        
    }
}