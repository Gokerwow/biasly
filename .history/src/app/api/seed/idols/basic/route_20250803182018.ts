// Ganti seluruh isi file route.ts Anda dengan ini untuk sementara

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

export async function GET() {
    console.log('--- MEMULAI TES SEDERHANA ---');
    console.log('Mengecek SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Key Ditemukan' : 'Key UNDEFINED!');

    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        console.log('Client dibuat. Mencoba melakukan select...');

        const { data, error } = await supabaseAdmin
            .from('idols')
            .select('name')
            .limit(5);

        if (error) {
            console.error('TES GAGAL. Objek error:', error);
            return NextResponse.json({ message: 'Tes Gagal', error: error }, { status: 500 });
        }

        console.log('TES BERHASIL. Data:', data);
        return NextResponse.json({ message: 'Tes Berhasil!', data: data });

    } catch (e: any) {
        console.error('Terjadi error kritis di blok try-catch:', e);
        return NextResponse.json({ message: 'Error Kritis', error: e.message }, { status: 500 });
    }
}