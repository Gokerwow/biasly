import { createClient } from '@/utils/supabase/server'
import { cache } from 'react'

export const getProfile = cache(async () => {
    const supabase = await createClient()

    // 1. Get the Auth User
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    // Just return null, don't redirect
    if (userError || !user) {
        return null
    }

    // 2. Get the Public Profile
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (profileError) {
        console.error('Error fetching profile:', profileError)
        return null
    }

    return { user, profile }
})