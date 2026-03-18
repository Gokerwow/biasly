'use client'

import { useState, useEffect } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Search, MoreVertical, Shield, User, Loader2, Hammer, CheckCheck, Calendar } from "lucide-react"
import { Input } from "@/components/UI/input"
import Pagination from "@/components/UI/pagination"
import { useDebounce } from "@/app/providers/debounce"
import { Tables } from "@/types/database.helper"
import UserActions from "./userActions"
import ConfirmationModal from "../UI/confirmationModal"
import { useToast } from "@/app/providers/toastProvider"
import { useForm } from "@/helper/useForm"
import { BanUser, ChangeUserRole, UnbanUser } from "@/actions/user_action"

interface UserTableProps {
    users: Tables<'profiles'>[]
    totalItems: number
    currentPage: number
    itemsPerPage: number
}

export default function UserTable({ users, totalItems, currentPage, itemsPerPage }: UserTableProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const { showToast } = useToast()

    const [query, setQuery] = useState(searchParams.get('search') || '')
    const debouncedQuery = useDebounce(query, 500)
    const [isSearching, setIsSearching] = useState(false)
    const [openMenuId, setOpenMenuId] = useState<string | null>(null)

    const { values, handleChange, resetForm } = useForm('')

    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)
    const [onBanID, setOnBanID] = useState('')
    const [onBanType, setOnBanType] = useState('')
    const [isToggleLoading, setIsToggleLoading] = useState(false)

    // Sync query state with URL on mount and when searchParams change externally
    useEffect(() => {
        const urlSearch = searchParams.get('search') || ''
        if (urlSearch !== query && !isSearching) {
            setQuery(urlSearch)
        }
    }, [searchParams])

    // URL Sync - only update URL when debounced query changes
    useEffect(() => {
        const currentSearch = searchParams.get('search') || ''

        // Don't update if debounced query matches current URL
        if (debouncedQuery === currentSearch) {
            setIsSearching(false)
            return
        }

        setIsSearching(true)
        const params = new URLSearchParams(searchParams.toString())

        if (debouncedQuery) {
            params.set('search', debouncedQuery)
        } else {
            params.delete('search')
        }
        params.set('page', '1')

        router.push(`${pathname}?${params.toString()}`, { scroll: false })

        // Stop spinner after navigation
        const timer = setTimeout(() => setIsSearching(false), 300)
        return () => clearTimeout(timer)
    }, [debouncedQuery])

    const handlePageChange = (page: number) => {
        console.log(page)
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', page.toString())
        router.push(`${pathname}?${params.toString()}`)
    }

    const handleToggleRole = async (userID: string, currentRole: string | null) => {
        setIsToggleLoading(true)
        const newRole = currentRole === 'admin' ? 'user' : 'admin'
        try {
            const result = await ChangeUserRole(newRole, userID)
            if (result.error) {
                console.log("error at changing user role", result.error)
                throw new Error(`Role update failed: ${result.error}`);
            }
            showToast(`User is now an ${newRole.toUpperCase()}`, 'success')
            router.refresh()
        } catch (error) {
            showToast(error.message || "Failed to update role", 'error')
            throw new Error(`Role update failed: ${error}`);
        } finally {
            setIsToggleLoading(false)
            setOpenMenuId(null)
        }
    }

    const onBan = async (id: string, type: 'ban' | 'unban') => {
        setOnBanID(id)
        setOnBanType(type)
        setShowDeleteModal(true)
    }

    console.log(onBanType)

    // CONFIRM THE BAN
    const confirmDelete = async () => {
        setIsDeleting(true)
        try {
            if (onBanType === 'unban') {
                const result = await UnbanUser(onBanID, values.ban)
                if (result.error) {
                    console.log("error at changing user role", result.error)
                    throw new Error(`Role update failed: ${result.error}`);
                }
                showToast(`Successfully unbanned user`, 'success')
            } else {
                const result = await BanUser(onBanID, values)
                if (result.error) {
                    console.log("error at banning user", result.error)
                    throw new Error(`Ban user failed: ${result.error}`);
                }
                showToast(`Successfully banned user`, 'success')
            }
            router.refresh()
            setShowDeleteModal(false)
        } catch (error) {
            showToast(error.message || "Failed to ban user", 'error')
            throw new Error(`Ban user failed: ${error}`);
        } finally {
            setIsDeleting(false)
            resetForm()
        }
    }

    return (
        <div className="flex flex-col gap-6 flex-1">

            {/* Search Toolbar (Matches Cards Page) */}
            <div className="sticky top-4 z-20 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur-xl shadow-2xl">
                <div className="relative group">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                        {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                    </div>
                    <Input
                        name="search"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search by username, email, or ID..."
                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                    />
                </div>
            </div>

            {/* Header Row */}
            <div className="hidden md:grid md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">User</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Role</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">status</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">Joined</div>
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400 text-right w-10">Actions</div>
            </div>

            {/* User Cards/Rows */}
            <div className="flex flex-col gap-3 flex-1">
                {users.length > 0 ? (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="group relative rounded-2xl border border-white/10 bg-[#161B22] hover:bg-white/[0.02] transition-all duration-200 overflow-visible"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 p-6 items-center">

                                {/* User Info */}
                                <div className="flex items-center gap-4">
                                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border border-white/10 bg-white/5">
                                        {user.avatar_url ? (
                                            <Image
                                                src={user.avatar_url}
                                                alt={user.username || 'User'}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center">
                                                <User className="h-6 w-6 text-gray-500" />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="font-bold text-white text-base">{user.username || 'Unknown'}</div>
                                        <div className="text-xs text-gray-500 font-mono">{user.id.slice(0, 8)}...</div>
                                    </div>
                                </div>

                                {/* Role Badge */}
                                <div className="flex items-center md:justify-start">
                                    {user.role === 'admin' ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-pink-500/10 px-3 py-1 text-xs font-bold text-pink-400">
                                            <Shield className="h-3.5 w-3.5" />
                                            ADMIN
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-xs font-bold text-blue-400">
                                            <User className="h-3.5 w-3.5" />
                                            USER
                                        </span>
                                    )}
                                </div>

                                {/* Role Badge */}
                                <div className="flex items-center md:justify-start">
                                    {user.banned_at != null ? (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-400">
                                            <Hammer className="h-3.5 w-3.5" />
                                            BANNED
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-400">
                                            <CheckCheck className="h-3.5 w-3.5" />
                                            ACTIVE
                                        </span>
                                    )}
                                </div>

                                {/* Joined Date */}
                                <div className="flex items-center md:justify-start">
                                    <span className="text-sm text-gray-400 font-mono">
                                        {new Date(user.created_at || '').toLocaleDateString()}
                                    </span>
                                </div>

                                {/* Actions Button */}
                                <div className="flex items-center justify-end md:justify-center relative">
                                    <button
                                        onClick={() => setOpenMenuId(openMenuId === user.id ? null : user.id)}
                                        className="text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg inline-flex items-center justify-center"
                                    >
                                        <MoreVertical className="h-4 w-4" />
                                    </button>
                                    {openMenuId === user.id && (
                                        <UserActions
                                            userId={user.id}
                                            currentRole={user.role || 'user'}
                                            username={user.username || 'Unknown'}
                                            isLoading={isToggleLoading}
                                            onClose={() => setOpenMenuId(null)}
                                            onBan={onBan}
                                            onToggle={handleToggleRole}
                                            isBanned={user.banned_at != null}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="rounded-2xl border flex items-center justify-center border-white/10 bg-[#161B22] py-20 flex-1">
                        <div className="flex flex-col items-center justify-center gap-2">
                            <div className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center">
                                <User className="h-6 w-6 text-gray-600" />
                            </div>
                            <p className="text-gray-500 text-sm font-medium">No users found.</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Pagination (Reused) */}
            <div className="flex justify-center">
                <Pagination
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                />
            </div>


            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                onConfirm={confirmDelete}
                title={`${onBanType === 'ban' ? 'Ban' : 'Unban'} User`}
                description={`Are you sure you want to ${onBanType === 'ban' ? 'Ban' : 'Unban'} this user?`}
                variant="danger" // Makes it Red
                disabled={!values.ban && (!values.years || !values.months || !values.days)}
                isLoading={isDeleting}
            >
                <div className="flex flex-col gap-3">
                    {onBanType === 'ban' &&
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                How long is the ban will be? (Leave blank if permanent)
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <Input
                                        name="years"
                                        value={values.years ?? ''}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Years"
                                        type="number"
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <Input
                                        name="months"
                                        value={values.months ?? ''}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Months"
                                        type="number"
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                                    />
                                </div>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                                        <Calendar className="h-4 w-4" />
                                    </div>
                                    <Input
                                        name="days"
                                        value={values.days ?? ''}
                                        onChange={(e) => handleChange(e)}
                                        placeholder="Days"
                                        type="number"
                                        className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                                    />
                                </div>
                            </div>
                        </div>
                    }
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                            What is the reason for the { onBanType === 'ban' ? 'ban' : 'unban' } ?
                        </label>
                        <div className="relative group">
                            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-pink-500 transition-colors">
                                { onBanType === 'ban' ? <Hammer className="h-4 w-4" /> : <CheckCheck className="h-4 w-4" /> }
                                
                            </div>
                            <Input
                                name="ban"
                                value={values.ban ?? ''}
                                onChange={(e) => handleChange(e)}
                                placeholder={`Give the reason for the ${onBanType === 'ban' ? 'banning' : 'Unbanning'}`}
                                className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-pink-500/50 focus:ring-pink-500/20 transition-all w-full"
                            />
                        </div>
                    </div>
                </div>
            </ConfirmationModal>
        </div>
    )
}