import { NextResponse } from "next/server";
import { seedIdolDetails } from "@/lib/seed/idols/details";

export async function POST(request: Request) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.SEEDING_SECRET_KEY}`) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log("API diakses: Memulai proses seeding detail idol...");

    try {
        const result = await seedIdolDetails();

        if (!result.success) {
            // Jika Koki bilang gagal, sampaikan pesan errornya
            return NextResponse.json({ error: result.error || 'Terjadi kesalahan pada proses seeding di lib' }, { status: 500 });
        }

        return NextResponse.json({ 
            message: result.message || 'Proses seeding berhasil diselesaikan.',
            data: result.data
        });


    } catch (error) {
        console.error("Error tidak terduga di API handler:", error);
        return NextResponse.json({ error: 'Gagal menjalankan proses seeding.', details: error.message }, { status: 500 });
    }
}