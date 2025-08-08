import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
    const supabase = await createClient()

    const { data: GroupsData, error: groupSelectError } = await supabase
        .from('groups')
        .select('name')

    const { data: LabelsData, error: LabelsSelectError } = await supabase
        .from('labels')
        .select('name')

    if (groupSelectError || LabelsSelectError) {
        return NextResponse.json({ message: 'Select Error', error: (groupSelectError ?? LabelsSelectError) }, { status: 500 })
    }

    const result = await Promise.all(GroupsData.map(group => {
        
    }))


}