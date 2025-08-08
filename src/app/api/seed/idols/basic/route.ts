// Salin dan ganti seluruh isi file Anda dengan ini.

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from "next/server";

interface CategoryMember {
    pageid: number;
    ns: number;
    title: string;
}

export async function GET() {
    try {
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const categories = ['soloists', 'singers', 'rappers', 'trainees'];
        const genders = ['male', 'female'];
        const IdolArray: string[] = [];

        for (const category of categories) {
            for (const gender of genders) {
                let hasMore = true;
                let continueToken;
                console.log(`🌀 Mengambil data untuk: ${gender} ${category}...`);
                while (hasMore) {
                    const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:${encodeURIComponent(`${gender} ${category}`)}&cmlimit=500&format=json&origin=*&cmcontinue=${encodeURIComponent(continueToken ?? '')}`;
                    const response = await fetch(url);
                    if (!response.ok) throw new Error(`HTTP Error ${response.status}`);
                    
                    const result = await response.json();
                    if (result.error) throw new Error(`API Error: ${result.error.info}`);

                    if (result.query?.categorymembers) {
                        const idolNames = result.query.categorymembers.map((member: CategoryMember) => member.title);
                        IdolArray.push(...idolNames);
                    }
                    
                    if (result.continue?.cmcontinue) {
                        continueToken = result.continue.cmcontinue;
                    } else {
                        hasMore = false;
                    }
                }
            }
        }
        console.log(`✅ Total nama yang diambil dari API: ${IdolArray.length}`);
        
        const uniqueIdolNames = [...new Set(IdolArray)];
        const dataToInsert = uniqueIdolNames.map(idolName => ({
            name: idolName
        }));
        console.log(`👍 Total nama unik untuk di-upsert: ${dataToInsert.length}`);

        const chunkSize = 500;
        for (let i = 0; i < dataToInsert.length; i += chunkSize) {
            const chunk = dataToInsert.slice(i, i + chunkSize);
            
            console.log(`🚀 Meng-upsert batch ${Math.floor(i / chunkSize) + 1}... Ukuran: ${chunk.length}`);

            const { error: insertError } = await supabaseAdmin
                .from('idols')
                .upsert(chunk, { onConflict: 'name' });

            if (insertError) {
                console.error("Supabase Upsert Error:", insertError);
                throw new Error(`Gagal pada saat upsert batch: ${JSON.stringify(insertError)}`);
            }
        }

        return NextResponse.json({
            message: 'Berhasil memasukkan semua data Idol!',
            totalUpserted: dataToInsert.length
        });

    } catch (error: any) {
        console.error("Proses Gagal Total:", error);
        return NextResponse.json({
            message: 'Gagal mengambil atau memasukkan data idol',
            error: error.message
        }, { status: 500 });
    }
}