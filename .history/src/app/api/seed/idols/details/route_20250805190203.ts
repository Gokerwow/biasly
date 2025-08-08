import { createClient } from "@/utils/supabase/server";
import pLimit from 'p-limit';
import { NextResponse } from "next/server";
import { seedIdolDetails } from "@/lib/seed/idols/details";

export async function GET() {
    try {
        const supabase = await createClient();
        const pageSize = 1000
        let pageIndex = 0
        let lastIdolCount = 0
        const AllIdolDetails = []

        do {
            const from = pageIndex * pageSize
            const to = from + pageSize - 1

            console.log(`Mengambil data dari baris ${from} sampai ${to}`);
            // Query untuk mengambil semua idol dari tabel 'idols'
            const { data: idolsData, error } = await supabase
                .from('idols')
                .select('id, name')
                .range(from, to)

            if (error) {
                console.error('Error fetching idols:', error);
                return new Response('Failed to fetch idols', { status: 500 });
            }

            const limit = pLimit(5)

            const idolsDetailPromises = idolsData.map(async (idol) => {
                return limit(async () => {
                    seedIdolDetails(idol)
                });
            })

            const idolDetails = await Promise.all(idolsDetailPromises);
            AllIdolDetails.push(...idolDetails)
            lastIdolCount = idolsData ? idolsData.length : 0
            pageIndex++
        } while (lastIdolCount === pageSize)

        return NextResponse.json({
            idolDetails: AllIdolDetails,
            jumlahDetail: AllIdolDetails.length,
        })


    } catch (error) {
        console.error(`Internal Error`, error);
        throw error;
    }
}