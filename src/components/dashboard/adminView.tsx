'use client'

import { ROUTES } from '@/constants'
import {
    Users, Activity, Package, AlertCircle, TrendingUp, BarChart3,
    Search, Clock, CheckCircle, Flag, ArrowRight
} from 'lucide-react'
import Link from 'next/link'

// --- DUMMY DATA ---
const ADMIN_STATS = {
    totalUsers: 1247, activeUsers: 892, totalCards: 45328,
    pendingReports: 12, newUsersToday: 34, cardsAddedToday: 289
}

const RECENT_REPORTS = [
    { id: 1, type: 'Duplicate', reporter: 'user_abc', cardId: 'card_123', status: 'pending', time: '2h ago' },
    { id: 2, type: 'Inappropriate', reporter: 'user_xyz', cardId: 'card_456', status: 'pending', time: '4h ago' },
    { id: 3, type: 'Fake Card', reporter: 'user_def', cardId: 'card_789', status: 'resolved', time: '1d ago' },
]

const RECENT_USERS = [
    { id: 1, name: 'KpopFan2024', email: 'fan@example.com', joined: '2h ago', cards: 0 },
    { id: 2, name: 'PhotocardCollector', email: 'collector@example.com', joined: '5h ago', cards: 12 },
    { id: 3, name: 'BiasWrecker', email: 'bias@example.com', joined: '1d ago', cards: 45 },
]

const TRENDING_GROUPS = [
    { name: 'ITZY', growth: '+12%' },
    { name: 'aespa', growth: '+8%' },
    { name: 'TWICE', growth: '+15%' },
    { name: 'Red Velvet', growth: '+5%' },
]

export default function AdminView() {
    return (
        <div className="flex flex-col gap-8 relative">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
                style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}>
            </div>

            {/* --- 1. HEADER SECTION --- */}
            <section className="relative z-10">
                <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-red-500/10 border border-red-500/20 px-3 py-1 text-xs font-bold text-red-400 tracking-wider">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            ADMINISTRATOR MODE
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                            Command <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 pr-2">Center</span>
                        </h1>
                        <p className="mt-2 text-gray-400 font-mono text-sm">
                            System Status: <span className="text-green-400">Normal</span> • Server Load: <span className="text-green-400">12%</span>
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative group hidden sm:block">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-pink-500 transition-colors" />
                            <input
                                type="text"
                                placeholder="Global Search..."
                                className="h-10 w-64 rounded-xl bg-black/40 border border-white/10 pl-9 pr-4 text-sm text-white placeholder-gray-600 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all outline-none"
                            />
                        </div>
                        <Link href="/dashboard" className="h-10 flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 text-sm font-semibold text-gray-300 hover:bg-white/10 hover:text-white transition-all">
                            Exit View
                        </Link>
                    </div>
                </div>

                {/* --- 2. STATS GRID (The HUD) --- */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <StatCard icon={Users} label="Total Users" value={ADMIN_STATS.totalUsers} color="text-purple-400" bg="from-purple-500/5" />
                    <StatCard icon={Activity} label="Active Now" value={ADMIN_STATS.activeUsers} color="text-green-400" bg="from-green-500/5" />
                    <StatCard icon={Package} label="Database" value={ADMIN_STATS.totalCards} color="text-blue-400" bg="from-blue-500/5" />
                    <StatCard icon={AlertCircle} label="Pending Issues" value={ADMIN_STATS.pendingReports} color="text-red-400" bg="from-red-500/10" isAlert />
                    <StatCard icon={TrendingUp} label="New Signups" value={`+${ADMIN_STATS.newUsersToday}`} color="text-amber-400" bg="from-amber-500/5" />
                    <StatCard icon={BarChart3} label="Data Entry" value={`+${ADMIN_STATS.cardsAddedToday}`} color="text-pink-400" bg="from-pink-500/5" />
                </div>
            </section>

            {/* --- 3. MAIN CONTENT SPLIT --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">

                {/* LEFT COLUMN (2/3 width) */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Pending Reports */}
                    <section>
                        <SectionHeader title="Priority Inbox" icon={<span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>} link="/admin/reports" count={RECENT_REPORTS.length} />
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm">
                            {RECENT_REPORTS.map((report, idx) => (
                                <div key={report.id} className={`group flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 gap-4 hover:bg-white/5 transition-colors ${idx !== RECENT_REPORTS.length - 1 ? 'border-b border-white/5' : ''}`}>
                                    <div className="flex items-start gap-4">
                                        <div className={`mt-1 shrink-0 rounded-lg p-2 ${report.status === 'pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-green-500/10 text-green-400'}`}>
                                            {report.status === 'pending' ? <Clock className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="bg-white/5 border border-white/10 px-1.5 py-0.5 rounded text-[10px] font-mono text-gray-400">ID: {report.cardId}</span>
                                                <span className="text-sm font-bold text-white">{report.type}</span>
                                            </div>
                                            <p className="text-xs text-gray-400">Reported by <span className="text-white font-medium">{report.reporter}</span> • <span className="font-mono">{report.time}</span></p>
                                        </div>
                                    </div>
                                    {report.status === 'pending' && (
                                        <div className="flex gap-2 w-full sm:w-auto pl-12 sm:pl-0 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all">
                                            <ActionButton color="green" label="Safe" />
                                            <ActionButton color="red" label="Ban" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Recent Users Table */}
                    <section>
                        <SectionHeader title="Latest Acquisitions" icon={<Users className="h-4 w-4 text-purple-400" />} />
                        <div className="rounded-2xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-white/5 text-gray-400 font-mono text-xs uppercase">
                                    <tr>
                                        <th className="px-6 py-3 font-medium">User</th>
                                        <th className="px-6 py-3 font-medium">Collection</th>
                                        <th className="px-6 py-3 font-medium text-right">Joined</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {RECENT_USERS.map((user) => (
                                        <tr key={user.id} className="hover:bg-white/5 transition-colors group cursor-pointer">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-800 to-black border border-white/10 flex items-center justify-center text-xs font-bold text-gray-400 group-hover:text-white group-hover:border-purple-500/50 transition-colors">
                                                        {user.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{user.name}</div>
                                                        <div className="text-xs text-gray-500 font-mono">{user.email}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="font-mono text-purple-400 font-bold">{user.cards}</span>
                                                    <span className="text-xs text-gray-500">items</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-xs text-gray-500">{user.joined}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* RIGHT COLUMN (1/3 width) */}
                <div className="space-y-8">

                    {/* Console Actions */}
                    <section>
                        <SectionHeader title="Console" icon={<Activity className="h-4 w-4 text-cyan-400" />} />
                        <div className="grid grid-cols-2 gap-3">
                            <Link href={ROUTES.DASHBOARD.CARDS.INDEX} className="group col-span-2 relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 p-5 transition-transform active:scale-95">
                                <div className="absolute inset-0 bg-[url('/assets/grain.png')] opacity-20"></div>
                                <div className="relative z-10">
                                    <Package className="h-6 w-6 text-white mb-2" />
                                    <h4 className="font-bold text-white">Master Database</h4>
                                    <p className="text-xs text-pink-100 opacity-80 mt-1">Add, Edit, or Delete Cards</p>
                                </div>
                            </Link>

                            <ConsoleLink href="/admin/users" icon={Users} label="User Mgmt" color="purple" />
                            <ConsoleLink href="/admin/reports" icon={Flag} label="Reports" color="red" hasDot />

                            <Link href="/admin/analytics" className="group col-span-2 relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 hover:border-cyan-500/30 transition-all">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-gray-200 text-sm">System Analytics</h4>
                                        <p className="text-[10px] text-gray-500 font-mono mt-0.5">VIEW TRAFFIC & LOGS</p>
                                    </div>
                                    <BarChart3 className="h-5 w-5 text-gray-500 group-hover:text-cyan-400 transition-colors" />
                                </div>
                            </Link>
                        </div>
                    </section>

                    {/* Market Movers */}
                    <section>
                        <SectionHeader title="Market Movers" icon={<TrendingUp className="h-4 w-4 text-pink-400" />} />
                        <div className="space-y-2">
                            {TRENDING_GROUPS.map((group, index) => (
                                <div key={group.name} className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/5 hover:border-white/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <span className={`flex h-6 w-6 items-center justify-center rounded text-xs font-bold font-mono ${index === 0 ? 'bg-yellow-500/20 text-yellow-400' : index === 1 ? 'bg-gray-400/20 text-gray-300' : 'bg-orange-700/20 text-orange-400'
                                            }`}>#{index + 1}</span>
                                        <span className="font-bold text-gray-300 text-sm">{group.name}</span>
                                    </div>
                                    <div className="text-xs font-mono text-green-400">{group.growth}</div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

// --- HELPER COMPONENTS (Keep code clean) ---

function StatCard({ icon: Icon, label, value, color, bg, isAlert }: any) {
    return (
        <div className={`group relative overflow-hidden rounded-xl border border-white/5 bg-gradient-to-br ${bg} to-transparent p-4 transition-all ${isAlert ? 'border-red-500/30 animate-pulse' : 'hover:border-white/20'}`}>
            <div className="flex items-center justify-between mb-2">
                <Icon className={`h-5 w-5 ${color} opacity-70`} />
                <div className={`h-1 w-1 rounded-full ${color} bg-current`}></div>
            </div>
            <p className="text-2xl font-mono font-bold text-white tracking-tight">{typeof value === 'number' ? value.toLocaleString() : value}</p>
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mt-1">{label}</p>
        </div>
    )
}

function SectionHeader({ title, icon, link, count }: any) {
    return (
        <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                {icon} {title}
            </h3>
            {link && (
                <Link href={link} className="text-xs font-mono text-gray-500 hover:text-white hover:underline">
                    VIEW ALL {count !== undefined && `(${count})`}
                </Link>
            )}
        </div>
    )
}

function ActionButton({ color, label }: { color: 'green' | 'red', label: string }) {
    const colors = {
        green: 'bg-white/5 hover:bg-green-500/20 hover:text-green-400 hover:border-green-500/50',
        red: 'bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/50'
    }
    return (
        <button className={`flex-1 sm:flex-none h-8 px-3 rounded-lg border border-transparent text-xs font-bold text-gray-400 transition-all ${colors[color]}`}>
            {label}
        </button>
    )
}

function ConsoleLink({ href, icon: Icon, label, color, hasDot }: any) {
    const colorClasses: any = { purple: 'group-hover:text-purple-400', red: 'group-hover:text-red-400' }
    return (
        <Link href={href} className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 p-4 hover:bg-white/10 transition-colors">
            {hasDot && <div className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></div>}
            <Icon className={`h-5 w-5 text-gray-400 ${colorClasses[color]} mb-2 transition-colors`} />
            <h4 className="font-bold text-gray-200 text-sm">{label}</h4>
        </Link>
    )
}