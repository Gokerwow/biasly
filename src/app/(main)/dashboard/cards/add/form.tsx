"use client"

import RarityBadge from "@/components/cards/UI/rarityBadge"
import SearchableSelect from "@/components/cards/UI/searchableSelect"
import { Tables } from "@/types/database.helper"
import { DollarSign, Layers, Save, Upload, User, Users, X } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

interface FormProps {
    groupsResults: Tables<'groups'>[];
    releasesResults: Tables<'releases'>[];
    membersResults: Tables<'idols'>[];
    idolGroups: Tables<'idol_groups'>[];
}

export default function FormPhotocard({groupsResults, membersResults, releasesResults, idolGroups}: FormProps) {

    const [members, setMembers] = useState<Tables<'idols'>[]>([])
    const [releases, setReleases] = useState<Tables<'releases'>[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    const [formData, setFormData] = useState({
        name: '',
        group: '',
        idol: '',
        era: '',
        rarity: 'UR',
        price: '',
        image: null as File | null,
        previewUrl: ''
    })

    useEffect(() => {
        console.log(members)
    }, [members])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    // 3. Handle Image Upload & Preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Create a fake URL for instant preview
            const objectUrl = URL.createObjectURL(file)
            setFormData(prev => ({ ...prev, image: file, previewUrl: objectUrl }))
        }
    }

    const handleGroupSelect = (id: string) => {
        setIsOpen(false)
        setIsDisabled(false)

        const membersID = idolGroups.filter(m => m.group_id === id)
        console.log(membersID)
        // const availableMembers = membersResults.filter(member => membersID.includes(member.id))
        const availableRelease = releasesResults.filter(release => release.group_id === id)
        // setMembers(availableMembers)
        setReleases(availableRelease)
    }

    return (
        <div className="flex h-full w-full flex-col gap-8">

            {/* --- HEADER --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white">
                        NEW <span className="text-pink-500">ENTRY</span>
                    </h1>
                    <p className="text-sm text-gray-500">Add a new photocard to the global database.</p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/admin/cards"
                        className="flex items-center gap-2 rounded-xl border border-gray-700 bg-[#161B22] px-4 py-2 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </Link>
                    <button className="flex items-center gap-2 cursor-pointer rounded-xl bg-pink-600 px-6 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:bg-pink-500 transition-all active:scale-95">
                        <Save className="h-4 w-4" />
                        Publish Card
                    </button>
                </div>
            </div>

            <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-12">

                {/* --- LEFT COL: LIVE PREVIEW --- */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                    <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xs font-bold uppercase text-gray-500">Live Preview</h3>
                            <div className="rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-bold text-green-400">
                                DATABASE READY
                            </div>
                        </div>

                        {/* The Card Component Visualization */}
                        <div className="relative mx-auto aspect-[2/3] w-64 rounded-xl border-4 border-gray-900 bg-gray-800 shadow-2xl transition-all hover:scale-105">
                            {/* Image Layer */}
                            {formData.previewUrl ? (
                                <Image
                                    src={formData.previewUrl}
                                    alt="Preview"
                                    fill
                                    className="rounded-lg object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full flex-col items-center justify-center text-gray-600">
                                    <Upload className="mb-2 h-8 w-8 opacity-50" />
                                    <span className="text-xs font-bold uppercase">No Image</span>
                                </div>
                            )}
                            {/* 
                            {['N', 'R', 'SR', 'SSR', 'UR'].includes(formData.rarity) && (
                                <div className="absolute top-2 right-2">
                                    <RarityBadge tier={card.rarity} />
                                </div>
                            )} */}

                            {/* Info Overlay */}
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/90 to-transparent p-4 pt-12">
                                <p className="text-lg font-black italic text-white leading-none">
                                    {formData.idol || 'IDOL NAME'}
                                </p>
                                <p className="text-xs font-bold text-pink-400 truncate">
                                    {formData.name || 'Card Name'}
                                </p>
                            </div>


                            {/* Rarity Badge */}
                            <div className="absolute top-2 right-2">
                                <RarityBadge tier={formData.rarity} />
                            </div>
                        </div>

                        <div className="mt-6 text-center">
                            <p className="text-xs text-gray-500">
                                This is how the card will appear in the user&apos;s binder and the marketplace.
                            </p>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COL: FORM DATA --- */}
                <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-8">
                        <form className="space-y-8">

                            {/* Section 1: Basic Info */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                    <Layers className="h-4 w-4 text-pink-500" />
                                    Card Details
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Card Name</label>
                                        <input
                                            name="name"
                                            placeholder="e.g. Checkmate Ver. A"
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-700 bg-[#0B0E11] px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            label="ERA / Album"
                                            items={releases.map(r => ({ ...r, name: r.title }))}
                                            icon={Users}
                                            onSelect={(id) => handleGroupSelect(id)} // Logic from previous message
                                            placeholder="e.g. CHECKMATE"
                                        />
                                        {isDisabled && <span className='text-xs text-red-500'>Pick A Group FIRST!</span>}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Section 2: Identity */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                    <User className="h-4 w-4 text-purple-500" />
                                    Identity
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <SearchableSelect
                                        label="Group"
                                        items={groupsResults}
                                        icon={Users}
                                        onSelect={(id) => handleGroupSelect(id)} // Logic from previous message
                                        placeholder="e.g. ITZY"
                                    />
                                    <div>
                                        <SearchableSelect
                                            label="ERA / Album"
                                            items={members.map(r => ({ ...r, name: r.stage_name }))}
                                            icon={Users}
                                            onSelect={(id) => handleGroupSelect(id)} // Logic from previous message
                                            placeholder="e.g. CHECKMATE"
                                        />
                                        {isDisabled && <span className='text-xs text-red-500'>Pick A Group FIRST!</span>}
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Section 3: Market Data */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                    <DollarSign className="h-4 w-4 text-green-500" />
                                    Market Value & Rarity
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Est. Price ($)</label>
                                        <input
                                            name="price"
                                            type="number"
                                            placeholder="0.00"
                                            onChange={handleChange}
                                            className="w-full rounded-xl border border-gray-700 bg-[#0B0E11] px-4 py-3 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Rarity Tier</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['Common', 'Rare', 'Legendary'].map((tier) => (
                                                <button
                                                    key={tier}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, rarity: tier }))}
                                                    className={`rounded-lg border px-2 py-2 text-xs font-bold transition-all ${formData.rarity === tier
                                                        ? 'bg-white text-black border-white'
                                                        : 'border-gray-700 bg-[#0B0E11] text-gray-500 hover:border-gray-500'
                                                        }`}
                                                >
                                                    {tier}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 4: File Upload */}
                            <div className="rounded-xl border-2 border-dashed border-gray-700 bg-[#0B0E11] p-8 text-center transition-colors hover:border-pink-500/50 hover:bg-gray-900">
                                <input
                                    type="file"
                                    id="file-upload"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <div className="rounded-full bg-gray-800 p-4">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-white">Click to upload card image</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP (MAX. 2MB)</p>
                                </label>
                            </div>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}