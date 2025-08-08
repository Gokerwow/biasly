import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient()

    const { data: GroupsData, error: groupSelectError } = await supabase
        .from('groups')
        .select('name')

        const { data: GroupsData, error: groupSelectError } = await supabase
        .from('groups')
        .select('name')

    if (groupSelectError) {
        return NextResponse.json({ message: 'Select Error', error: groupSelectError }, { status: 500 })
    }
}