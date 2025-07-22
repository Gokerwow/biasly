import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

const supabase = await createClient()

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')

    if (!query) {
        return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    try {

        const { data: groupsData, error: dbError } = await supabase
            .from('groups')
            .select('*')
            .ilike('stage_name', `%${query}%`)
            .single()

        if (groupsData) {
            console.log('Data ditemukan di cache Supabase!');
            // Kembalikan dalam format yang sama seperti API eksternal
            return NextResponse.json({ data: [groupsData.raw_api_data] });
        }

        console.log('Data tidak ditemukan di cache, memanggil API eksternal...');

        const url = `https://kpop.fandom.com/api.php?action=query&list=categorymembers&cmtitle=Category:male%20groups&cmlimit=500&format=json&origin=*`

        const apiResponse = await fetch(url);
        const result = await apiResponse.json();

        const MaleIdolData = result.data?.[0];

        console.log(MaleIdolData)

        if (MaleIdolData) {
            const { data: newRecord, error: insertError } = await supabase
                .from('groups')
                .insert({
                    name: MaleIdolData['Stage Name'],
                    korean_name: MaleIdolData['Korean Name'],
                    debut_date: MaleIdolData['Date of Birth'],
                    agency: MaleIdolData['Company'],
                    fandom_name: MaleIdolData['Fanclub Name'],
                    status: MaleIdolData['Active'],
                    raw_data: MaleIdolData, // Simpan seluruh objek asli
                })
                .select();

            if (insertError) {
                console.error('Gagal menyimpan data ke Supabase:', insertError);
            } else {
                console.log('Data baru berhasil disimpan ke Supabase:', newRecord);
            }

            return NextResponse.json(result);
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Terjadi kesalahan internal' }, { status: 500 });
    }
}