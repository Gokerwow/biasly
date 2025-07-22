import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const supabase = await createClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const url = "https://k-pop.p.rapidapi.com/boy-groups?q=BTS&by=Group%20Name"
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY!,
            'x-rapidapi-host': 'k-pop.p.rapidapi.com',
        }
    }

    const apiResponse = await fetch(url, options);
    const result = await apiResponse.json();

    const idolData = result.data?.[0];

    if (idolData) {
        const { data: newRecord, error: insertError } = await supabase
            .from('idols')
            .insert({
                name: idolData['Stage Name'],
                korean_name: idolData['Korean Name'],
                date_of_birth: idolData['Date of Birth'],
                raw_api_data: idolData, // Simpan seluruh objek asli
            })
            .select();

        if (insertError) {
            // Jangan hentikan proses jika insert gagal, cukup log error
            console.error('Gagal menyimpan data ke Supabase:', insertError);
        } else {
            console.log('Data baru berhasil disimpan ke Supabase:', newRecord);
        }
    }
}