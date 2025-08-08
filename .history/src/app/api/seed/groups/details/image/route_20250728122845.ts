import { createClient } from "@/utils/supabase/server";
import * as cheerio from 'cheerio';
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const supabase = await createClient()

        // 1. Dapatkan waktu saat ini
        const sixHoursAgo = new Date();
        // 2. Kurangi 6 jam dari waktu saat ini
        sixHoursAgo.setHours(sixHoursAgo.getHours() - 6);
        // 3. Ubah ke format ISO
        const isoDate = sixHoursAgo.toISOString();

        const { data: GroupsData, error: SelectError } = await supabase
            .from('groups')
            .select('name')
            .or(`details_fetched_at.is.null,details_fetched_at.lt.${isoDate}`)
            .limit(50);

        if (SelectError) {
            return NextResponse.json({ message: 'Select Error', error: SelectError }, { status: 500 })
        }

        const result = GroupsData.map(async (group) => {
            const url = `https://kpop.fandom.com/api.php?action=parse&page=${encodeURIComponent(group.name)}&prop=text&format=json&origin=*`

        })

        const ImageElement = $('figure.pi-image a')
        const HDImageUrl = ImageElement.attr('href')
        const imageUrl = HDImageUrl || null
    } catch {

    }
}