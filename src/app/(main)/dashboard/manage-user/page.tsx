import { createClient } from "@/utils/supabase/server"
import { Users } from "lucide-react"
import UserTable from "@/components/dashboard/userTable" // We will create this next
import BackButton from "@/components/UI/backButton"

export default async function UsersPage({ searchParams }: { searchParams: { search?: string, page?: string } }) {
    const supabase = await createClient()
    const params = await searchParams;

    const query = params?.search || ''
    const currentPage = Number(params?.page) || 1
    const itemsPerPage = 10

    // 1. Fetch Users with Pagination & Search
    let dbQuery = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .range((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage - 1)
        .order('created_at', { ascending: false })

    if (query) {
        dbQuery = dbQuery.ilike('username', `%${query}%`) // Search by username
    }

    const { data: users, count, error } = await dbQuery

    console.log(error)

    return (
        <div className="flex flex-col gap-6 relative min-h-screen">
            <div>
                <BackButton label="Back to Dashboard" href="/dashboard" />
            </div>

            <div className="relative z-10 flex flex-col gap-8 flex-1">

                {/* Header Section (Matches Cards Page) */}
                <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight uppercase italic">
                            User <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 pr-2">Management</span>
                        </h1>
                        <p className="mt-2 text-gray-400 font-mono text-sm">
                            Overview and manage registered members.
                        </p>
                    </div>

                    {/* Quick Stats (Optional but fits the theme) */}
                    <div className="flex gap-3">
                        <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md">
                            <span className="text-xs text-gray-400 uppercase font-bold">Total Users</span>
                            <div className="text-xl font-black text-white flex items-center gap-2">
                                <Users className="w-4 h-4 text-pink-500" />
                                {count || 0}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Client Component for the Table & Search */}
                <UserTable
                    users={users || []}
                    totalItems={count || 0}
                    currentPage={currentPage}
                    itemsPerPage={itemsPerPage}
                />
            </div>
        </div>
    )
}