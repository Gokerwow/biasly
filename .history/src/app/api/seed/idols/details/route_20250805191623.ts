import { createClient } from "@/utils/supabase/server";
import pLimit from 'p-limit';
import { NextResponse } from "next/server";
import { seedIdolDetails } from "@/lib/seed/idols/details";

export async function POST(request: Request) {
    try {
        

        return NextResponse.json({
            idolDetails: AllIdolDetails,
            jumlahDetail: AllIdolDetails.length,
        })


    } catch (error) {
        console.error(`Internal Error`, error);
        throw error;
    }
}