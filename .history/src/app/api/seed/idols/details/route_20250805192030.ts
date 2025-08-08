import { createClient } from "@/utils/supabase/server";
import pLimit from 'p-limit';
import { NextResponse } from "next/server";
import { seedIdolDetails } from "@/lib/seed/idols/details";

export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SEEDING_SECRET_KEY}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log("API diakses: Memulai proses seeding detail idol...");
    
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