'use client'

import { useEffect, useRef } from "react"
import { Shield, ShieldAlert, Trash2, Copy, CheckCheck } from "lucide-react"
import { useToast } from "@/app/providers/toastProvider"

interface UserActionsProps {
    userId: string
    currentRole: string
    username: string
    isLoading: boolean
    isBanned: boolean
    onClose: () => void
    onBan: (id: string, type: 'ban' | 'unban') => void
    onToggle: (id: string, currentRole: string) => void
}

export default function UserActions({ userId, currentRole, username, isLoading, isBanned, onClose, onBan, onToggle }: UserActionsProps) {
    const menuRef = useRef<HTMLDivElement>(null)
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
                        onClick={() => onToggle(userId, currentRole)}
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
                        onClick={() =>isBanned ? onBan(userId, 'unban') : onBan(userId, 'ban')}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-sm ${isBanned ? 'text-green-400 hover:bg-green-500/10 hover:text-green-300' : 'text-red-400 hover:bg-red-500/10 hover:text-red-300'} rounded-lg transition-colors`}
                    >
                        {isBanned ? (
                            <>
                                <CheckCheck className="h-3.5 w-3.5" />
                                Unban User
                            </>
                        )
                            :
                            <>
                                <Trash2 className="h-3.5 w-3.5" />
                                Ban User
                            </>
                        }
                    </button>
                </div>
            </div>
        </>
    )
}