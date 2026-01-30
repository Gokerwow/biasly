'use server'

import { getProfile } from '@/app/lib/userServer'
import AdminView from '../../../components/dashboard/adminView'
import UserView from '../../../components/dashboard/userView'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
    // 1. Fetch Data
    const data = await getProfile()
    
    // 2. Auth Guard
    if (!data?.user) {
        redirect('/login')
    }

    const { profile } = data
    const userRole = profile?.role || 'user'
    const displayName = profile?.username || 'Collector'

    // 3. Render Logic (Clean and readable!)
    if (userRole === 'admin') {
        return <AdminView />
    }

    return <UserView displayName={displayName} />
}