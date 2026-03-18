'use server'

import { getProfile } from '@/app/lib/userServer'
import AdminView from '../../../components/dashboard/adminView'
import UserView from '../../../components/dashboard/userView'

export default async function DashboardPage() {
    // 1. Fetch Data
    const profile = await getProfile()

    const userRole = profile?.role || 'user'
    const displayName = profile?.username || 'Collector'

    // 3. Render Logic (Clean and readable!)
    if (userRole === 'admin') {
        return <AdminView />
    }

    return <UserView displayName={displayName} />
}