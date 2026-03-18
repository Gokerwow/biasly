"use server"

import { createClient } from "@/utils/supabase/server"
import { getProfile } from "../app/lib/userServer"
import { addToDate } from "@/helper/calculateDate"

export async function ChangeUserRole(newRole: 'admin' | 'user', id: string) {
    const supabase = await createClient()
    try {
        const profile = await getProfile()
        if (profile?.role != 'admin') {
            return {
                success: false,
                message: "Unauthorized",
            }
        }
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', id)
        if (error) {
            return {
                success: false,
                message: "error at changing user role",
                error: error
            }
        }

        return {
            success: true,
            message: "Success at changing user role",
        }
    } catch (error) {
        return {
            success: false,
            message: "error at changing user role",
            error: error
        }
    }
}

export async function BanUser(userID: string, values: { years?: number, months?: number, days?: number, ban?: string } ) {
    const supabase = await createClient()
    try {
        const profile = await getProfile()
        if (profile?.role != 'admin') {
            return {
                success: false,
                message: "Unauthorized",
            }
        }

        const { ban, ...durationValues } = values

        const definedValues = Object.fromEntries(Object.entries(durationValues).filter(([key, value]) => Boolean(value)))

        const now = new Date().toISOString()
        const bannedUntil = addToDate(definedValues)
        
        const { error } = await supabase
            .from('profiles')
            .update({ banned_at: now, banned_by: profile.id, banned_reason: ban, banned_until: bannedUntil})
            .eq('id', userID)
        if (error) {
            return {
                success: false,
                message: "error at Banning user",
                error: error
            }
        }

        return {
            success: true,
            message: "Success at Banning user",
        }
    } catch (error) {
        return {
            success: false,
            message: "error at Banning user",
            error: error
        }
    }
}

export async function UnbanUser(userID: string, unbanReason: string ) {
    const supabase = await createClient()
    try {
        const profile = await getProfile()
        if (profile?.role != 'admin') {
            return {
                success: false,
                message: "Unauthorized",
            }
        }
                
        const { error } = await supabase
            .from('profiles')
            .update({ unban_reason: unbanReason, unbanned_by: profile.id, banned_until: null, banned_at:null })
            .eq('id', userID)
        if (error) {
            return {
                success: false,
                message: "error at Unbanning user",
                error: error
            }
        }

        return {
            success: true,
            message: "Success at Unbanning user",
        }
    } catch (error) {
        return {
            success: false,
            message: "error at Unbanning user",
            error: error
        }
    }
}
