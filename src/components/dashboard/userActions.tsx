'use client'

import { useState, useEffect, useRef } from "react"
import { Shield, ShieldAlert, Trash2, Copy } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useToast } from "@/app/providers/toastProvider"

interface UserActionsProps {
    userId: string
    currentRole: string
    username: string
    onClose: () => void
    onDelete: () => void
}

export default function UserActions({ userId, currentRole, username, onClose, onDelete }: UserActionsProps) {
    const [isLoading, setIsLoading] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const supabase = createClient()
    const { showToast } = useToast()

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [onClose])

    const handleCopyId = () => {
        navigator.clipboard.writeText(userId)
        showToast("User ID copied!", 'success')
    }

    const handleToggleRole = async () => {
        setIsLoading(true)
        const newRole = currentRole === 'admin' ? 'user' : 'admin'

        try {
            const { error } = await supabase
                .from('profiles')
                .update({ role: newRole })
                .eq('id', userId)

            if (error) throw error

            showToast(`User is now an ${newRole.toUpperCase()}`, 'success')
            router.refresh()
            onClose()
        } catch (error) {
            showToast("Failed to update role", 'error')
        } finally {
            setIsLoading(false)
        }
    }

    const handleDelete = async () => {
        if (confirm("Are you sure? This only deletes the profile, not the auth account (requires admin API).")) {

        }
        onClose()
    }

    return (
        <>
            <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-white/10 bg-[#1C2128] shadow-2xl shadow-black/50 backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-100" ref={menuRef}>
                <div className="p-1">
                    <div className="px-3 py-2 border-b border-white/5 mb-1">
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Manage {username}</p>
                    </div>

                    {/* Action: Copy ID */}
                    <button
                        onClick={handleCopyId}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors group"
                    >
                        <Copy className="h-3.5 w-3.5 text-gray-500 group-hover:text-pink-400" />
                        Copy User ID
                    </button>

                    {/* Action: Toggle Role */}
                    <button
                        disabled={isLoading}
                        onClick={handleToggleRole}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 hover:text-white rounded-lg transition-colors group"
                    >
                        {isLoading ? (
                            <span className="h-3.5 w-3.5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                        ) : currentRole === 'admin' ? (
                            <ShieldAlert className="h-3.5 w-3.5 text-gray-500 group-hover:text-red-400" />
                        ) : (
                            <Shield className="h-3.5 w-3.5 text-gray-500 group-hover:text-green-400" />
                        )}
                        {currentRole === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>

                    <div className="my-1 border-t border-white/5"></div>

                    {/* Action: Delete */}
                    <button
                        onClick={() => onDelete()}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-lg transition-colors"
                    >
                        <Trash2 className="h-3.5 w-3.5" />
                        Ban User
                    </button>
                </div>
            </div>
        </>
    )
}