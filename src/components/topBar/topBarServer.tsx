'use server'

import { createClient } from "@/utils/supabase/server"
import TopBarClient from "./topBarClient"

export async function TopBarServer() {
    const supabase = await createClient()

    const { data: { user }, error: userError } = await supabase.auth.getUser()

    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single()

    if (userError) {
        console.error("user not found:", userError.message)
    }
    if (profileError) {
        console.error("Profile not found for this user:", profileError.message)
    }

    return <TopBarClient user={user} profile={profile} />
}