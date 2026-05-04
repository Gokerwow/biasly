import { ROUTES } from '@/constants'
import { redirect } from 'next/navigation'

export default async function BrowsePage() {
    redirect(ROUTES.BROWSE.RELEASES)
}