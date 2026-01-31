/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useUser } from "@/app/providers/authProvider"
import { useDebounce } from "@/app/providers/debounce"
import { useToast } from "@/app/providers/toastProvider"
import RarityBadge from "@/components/UI/rarityBadge"
import SearchableSelect from "@/components/UI/searchableSelect"
import { ROUTES } from "@/constants"
import { getRarityBorder, getRarityGlow, getRarityText } from "@/helper"
import { Enums, Tables } from "@/types/database.helper"
import { createClient } from "@/utils/supabase/client"
import { Book, DollarSign, IdCardLanyard, Layers, Save, Star, Tag, Upload, User, Users, X } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useMemo } from "react"

const CARD_TYPES: Enums<'card_type'>[] = ["Album PC", "POB", "Lucky Draw", "Trading Card", "Broadcast"]
const SUBJECT_TYPES: Enums<'subject_type'>[] = ['Solo', 'Unit', 'Group']

interface Member {
    id: string
    name: string
}

interface FormState {
    name: string
    group_id: string | null
    idol_id: string | null
    release_id: string | null
    type: Enums<'card_type'>
    rarity: Enums<'card_rarity'>
    subject_category: Enums<'subject_type'>
    unit_names: Member[]
    source: string
    price: string
    image: File | null
    previewUrl: string
}

export default function AddCardPage() {
    // ✅ Create supabase client once using useMemo
    const supabase = useMemo(() => createClient(), [])

    const { user } = useUser()
    const { showToast } = useToast()

    // --- Data State ---
    const [members, setMembers] = useState<Member[]>([])
    const [releases, setReleases] = useState<Tables<'releases'>[]>([])
    const [groups, setGroups] = useState<Tables<'groups'>[]>([])

    // --- UI/Selection State ---
    const [selectedIdolName, setSelectedIdolName] = useState<string>('')
    
    // ✅ Separate loading states for better control
    const [isLoadingGroups, setIsLoadingGroups] = useState(false)
    const [isLoadingGroupData, setIsLoadingGroupData] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isDisabled, setIsDisabled] = useState(true)

    // --- Search State ---
    const [query, setQuery] = useState("")
    const debouncedQuery = useDebounce(query, 500)

    const router = useRouter()

    // --- Form State ---
    const [formData, setFormData] = useState<FormState>({
        name: '',
        group_id: null,
        idol_id: null,
        release_id: null,
        type: 'Album PC',
        rarity: 'UR',
        subject_category: 'Solo', 
        unit_names: [],
        source: '',
        price: '',
        image: null,
        previewUrl: '',
    })

    // 1. Fetch Groups - ✅ Fixed: removed supabase from dependencies
    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoadingGroups(true)
            try {
                let queryBuilder = supabase.from('groups').select('*').limit(50)
                if (debouncedQuery) {
                    queryBuilder = queryBuilder.ilike('name', `%${debouncedQuery}%`)
                }
                const { data, error } = await queryBuilder
                
                if (error) {
                    console.error("Error fetching groups:", error)
                } else {
                    setGroups(data || [])
                }
            } catch (error) {
                console.error("Error fetching groups:", error)
            } finally {
                setIsLoadingGroups(false)
            }
        }
        fetchGroups()
        console.log('useFfec 1')
    }, [debouncedQuery]) // ✅ Only debouncedQuery

    // 2. Fetch Members & Releases - ✅ Fixed: removed supabase from dependencies
    useEffect(() => {
        if (!formData.group_id) return
        
        const fetchGroupData = async () => {
            setIsLoadingGroupData(true)
            try {
                const [releasesRes, membersRes] = await Promise.all([
                    supabase.from('releases').select('*').eq('group_id', formData.group_id),
                    supabase.from('idol_groups').select('*, idols(*)').eq('group_id', formData.group_id)
                ])
                
                if (releasesRes.error) {
                    console.error("Error fetching releases:", releasesRes.error)
                } else {
                    setReleases(releasesRes.data || [])
                }
                
                if (membersRes.error) {
                    console.error("Error fetching members:", membersRes.error)
                } else {
                    const cleanMembers = membersRes.data?.map((item: any) => ({
                        id: item.idol_id,
                        name: item.idols.stage_name.replace(/\((.*)+\)/g, '').trim()
                    })) || []
                    setMembers(cleanMembers)
                }
            } catch (error) {
                console.error("Error fetching group data:", error)
            } finally {
                setIsLoadingGroupData(false)
            }
        }
        fetchGroupData()
        console.log('useFfec 2')
    }, [formData.group_id]) // ✅ Only group_id

    // 3. Cleanup preview URL
    useEffect(() => {
        return () => {
            if (formData.previewUrl) {
                URL.revokeObjectURL(formData.previewUrl)
            }
        }
    }, [formData.previewUrl])

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (field: keyof FormState, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (field === 'group_id') {
            setIsDisabled(false)
            setFormData(prev => ({ ...prev, group_id: value, idol_id: null, release_id: null, unit_names: [] }))
            setSelectedIdolName('')
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            setFormData(prev => ({ ...prev, image: file, previewUrl: objectUrl }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            if (!formData.image || !formData.group_id) {
                showToast("Please select a Group and an Image!", "error")
                return
            }

            const cleanName = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');

            const extension = formData.image.name.split('.').pop();
            const uniqueSuffix = Date.now();
            const fileName = `${cleanName}-${uniqueSuffix}.${extension}`;
            const filePath = `${formData.group_id}/${fileName}`;

            const { error: uploadError } = await supabase
                .storage
                .from('Cards')
                .upload(filePath, formData.image, { upsert: true, contentType: 'image/webp' })

            if (uploadError) {
                console.error(uploadError)
                throw new Error('Error uploading image')
            }

            const { data } = supabase.storage.from('Cards').getPublicUrl(filePath)
            const imageURL = data.publicUrl

            const payload = {
                submitted_by: user?.id,
                release_id: formData.release_id,
                name: formData.name,
                type: formData.type,
                source: formData.source,
                image_url: imageURL,
                subject_category: formData.subject_category,
                idol_id: formData.idol_id,
                unit_names: formData.unit_names,
                rarity: formData.rarity
            }

            const { error: insertError } = await supabase
                .from('photocards')
                .insert(payload)

            if (insertError) {
                console.error(insertError)
                throw new Error('Error inserting photocard')
            }

            showToast('Successfully Added Card', 'success')
            router.push(ROUTES.DASHBOARD.CARDS.INDEX)

        } catch (error: any) {
            console.error('Error:', error)
            showToast(error.message || "Something went wrong!", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form className="flex h-full w-full flex-col gap-8" onSubmit={handleSubmit}>
            {/* --- HEADER --- */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white">
                        NEW <span className="text-pink-500">ENTRY</span>
                    </h1>
                    <p className="text-sm text-gray-500">Add a new photocard to the global database.</p>
                </div>
                <div className="flex gap-3">
                    <button 
                        type="button" 
                        onClick={() => router.back()} 
                        className="flex items-center gap-2 rounded-xl border border-gray-700 bg-[#161B22] px-4 py-2 text-sm font-bold text-gray-300 hover:bg-gray-800 transition-colors cursor-pointer"
                        disabled={isSubmitting}
                    >
                        <X className="h-4 w-4" /> Cancel
                    </button>
                    <button 
                        type="submit" 
                        className="flex items-center gap-2 rounded-xl bg-pink-600 px-6 py-2 text-sm font-bold text-white shadow-[0_0_20px_rgba(236,72,153,0.3)] hover:bg-pink-500 transition-all active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                    >
                        <Save className="h-4 w-4" /> 
                        {isSubmitting ? 'Publishing...' : 'Publish Card'}
                    </button>
                </div>
            </div>

            <div className="grid h-full grid-cols-1 gap-8 lg:grid-cols-12">
                {/* --- LEFT COL: LIVE PREVIEW --- */}
                <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-6">
                    <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-6 overflow-hidden relative">
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
                        <div className="relative mb-6 flex items-center justify-between z-10">
                            <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider">Card Preview</h3>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-green-500 tracking-wide">SYSTEM READY</span>
                            </div>
                        </div>

                        {/* PREVIEW CARD */}
                        <div className="relative z-10 flex flex-col items-center">
                            <div className="relative group perspective-1000">
                                <div className={`absolute -inset-0.5 blur-xl opacity-40 transition-all duration-500 group-hover:opacity-75 ${getRarityGlow(formData.rarity)}`}></div>
                                <div className={`relative mx-auto aspect-[2/3] w-64 overflow-hidden rounded-xl border-[3px] transition-all duration-300 ease-out transform group-hover:scale-[1.02] bg-gray-900 shadow-2xl ${getRarityBorder(formData.rarity)}`}>
                                    {formData.previewUrl ? (
                                        <Image src={formData.previewUrl} alt="Preview" fill className="object-cover" />
                                    ) : (
                                        <div className="flex h-full w-full flex-col items-center justify-center bg-[#0B0E11]">
                                            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ffffff33_1px,transparent_1px)] [background-size:16px_16px]"></div>
                                            <Upload className="mb-3 h-10 w-10 text-gray-700 animate-pulse" />
                                            <span className="text-[10px] font-bold uppercase text-gray-600 tracking-widest">Awaiting Data</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-20 mix-blend-overlay"></div>
                                    <div className="absolute top-2 right-2 z-30">
                                        <RarityBadge tier={formData.rarity} />
                                    </div>
                                    <div className="absolute bottom-0 left-0 w-full z-30">
                                        <div className="h-12 w-full bg-gradient-to-t from-black/90 to-transparent"></div>
                                        <div className="bg-black/80 backdrop-blur-md px-4 py-3 border-t border-white/10">
                                            <div className="flex flex-col">
                                                <h4 className={`text-lg font-black italic leading-none uppercase tracking-tighter drop-shadow-lg ${getRarityText(formData.rarity)}`}>
                                                    {formData.name || 'Card Variant'}
                                                </h4>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <p className="text-xs font-bold text-white truncate max-w-[140px]">
                                                        {formData.subject_category === 'Solo' ? (selectedIdolName || 'IDOL NAME') :
                                                            formData.subject_category === 'Unit' ? (formData.unit_names?.map(unit => unit.name).join(", ") || 'UNIT NAME') :
                                                                'GROUP PHOTO'}
                                                    </p>
                                                    <div className="flex gap-0.5">
                                                        <div className="h-1 w-1 rounded-full bg-gray-500"></div>
                                                        <div className="h-1 w-1 rounded-full bg-gray-600"></div>
                                                        <div className="h-1 w-1 rounded-full bg-gray-700"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 text-center max-w-[200px]">
                                <p className="text-[10px] uppercase tracking-widest text-gray-600">Preview Mode</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COL: FORM DATA --- */}
                <div className="lg:col-span-8">
                    <div className="rounded-2xl border border-gray-800 bg-[#161B22] p-8">
                        <div className="space-y-8">

                            {/* Section 1: Classification */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                    <Tag className="h-4 w-4 text-blue-500" />
                                    Classification
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <SearchableSelect
                                        name="type"
                                        label="Card Type"
                                        items={CARD_TYPES.map(type => ({ id: type, name: type }))}
                                        icon={IdCardLanyard}
                                        onSelect={(item) => handleSelectChange('type', item.name)}
                                        placeholder="e.g. Album"
                                        isLoading={false}
                                    />
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Subject Category</label>
                                        <div className="flex rounded-xl bg-[#0B0E11] p-1 border border-gray-700">
                                            {SUBJECT_TYPES.map((type) => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, subject_category: type }))}
                                                    className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${formData.subject_category === type ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                                >
                                                    {type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Section 2: Identity & Subject */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                    <User className="h-4 w-4 text-purple-500" />
                                    Identity & Subject
                                </h3>
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    {/* Group - Always Required */}
                                    <SearchableSelect
                                        name="group_id"
                                        label="Group"
                                        items={groups}
                                        icon={Users}
                                        onSelect={(item) => handleSelectChange('group_id', item.id)}
                                        onQueryChange={(q) => setQuery(q)}
                                        placeholder="e.g. ITZY"
                                        isLoading={isLoadingGroups}
                                    />

                                    {/* CONDITIONAL INPUTS BASED ON SUBJECT CATEGORY */}
                                    {formData.subject_category === 'Solo' && (
                                        <div>
                                            <SearchableSelect
                                                key={formData.group_id}
                                                name="idol_id"
                                                label="Idol"
                                                items={members}
                                                icon={Star}
                                                onSelect={(item) => {
                                                    handleSelectChange('idol_id', item.id)
                                                    setSelectedIdolName(item.name)
                                                }}
                                                placeholder="e.g. YUNA"
                                                disabled={isDisabled}
                                                isLoading={isLoadingGroupData}
                                            />
                                            {isDisabled && <span className='text-xs text-red-500'>Pick A Group FIRST!</span>}
                                        </div>
                                    )}

                                    {formData.subject_category === 'Unit' && (
                                        <div>
                                            <SearchableSelect
                                                key={formData.group_id}
                                                name="unit_names"
                                                label="Unit Members"
                                                items={members}
                                                icon={Star}
                                                onSelect={(items) => {
                                                    handleSelectChange('unit_names', items)
                                                }}
                                                placeholder="e.g. Yeji & Ryujin"
                                                disabled={isDisabled}
                                                mode="tag"
                                                isLoading={isLoadingGroupData}
                                            />
                                            {isDisabled && <span className='text-xs text-red-500'>Pick A Group FIRST!</span>}
                                        </div>
                                    )}

                                    {formData.subject_category === 'Group' && (
                                        <div className="flex items-center justify-center rounded-xl border border-dashed border-gray-800 bg-gray-900/50">
                                            <span className="text-xs text-gray-500 font-medium">Group Photo Selected</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Section 3: Details */}
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
                                            value={formData.name}
                                            placeholder="e.g. Checkmate Ver. A"
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-700 bg-[#0B0E11] px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <SearchableSelect
                                            key={formData.group_id}
                                            name="release_id"
                                            label="ERA / Album"
                                            items={releases.map(r => ({ ...r, name: r.title }))}
                                            icon={Book}
                                            onSelect={(item) => handleSelectChange('release_id', item.id)}
                                            placeholder="e.g. CHECKMATE"
                                            disabled={isDisabled}
                                            isLoading={isLoadingGroupData}
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Source / Event</label>
                                        <input
                                            name="source"
                                            value={formData.source}
                                            placeholder="e.g. Soundwave Round 1, Pre-order Benefit"
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-700 bg-[#0B0E11] px-4 py-3 text-sm text-white focus:border-pink-500 focus:outline-none focus:ring-1 focus:ring-pink-500 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Section 4: Market Data */}
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
                                            value={formData.price}
                                            type="number"
                                            placeholder="0.00"
                                            onChange={handleInputChange}
                                            className="w-full rounded-xl border border-gray-700 bg-[#0B0E11] px-4 py-3 text-sm text-white focus:border-green-500 focus:outline-none focus:ring-1 focus:ring-green-500 transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-xs font-bold text-gray-500 uppercase">Rarity Tier</label>
                                        <div className="grid grid-cols-5 gap-2">
                                            {(['N', 'R', 'SR', 'SSR', 'UR'] as const).map((tier) => {
                                                const styles = {
                                                    'N': { active: 'bg-gray-500 text-white border-gray-500', inactive: 'text-gray-500 border-gray-700 hover:border-gray-500' },
                                                    'R': { active: 'bg-blue-500 text-white border-blue-500', inactive: 'text-blue-500 border-gray-700 hover:border-blue-500' },
                                                    'SR': { active: 'bg-purple-500 text-white border-purple-500', inactive: 'text-purple-500 border-gray-700 hover:border-purple-500' },
                                                    'SSR': { active: 'bg-yellow-500 text-black border-yellow-500', inactive: 'text-yellow-500 border-gray-700 hover:border-yellow-500' },
                                                    'UR': { active: 'bg-rose-600 text-white border-rose-600', inactive: 'text-rose-600 border-gray-700 hover:border-rose-600' },
                                                }[tier]
                                                const isSelected = formData.rarity === tier
                                                return (
                                                    <button
                                                        key={tier}
                                                        type="button"
                                                        onClick={() => setFormData(prev => ({ ...prev, rarity: tier }))}
                                                        className={`rounded-lg border px-1 py-2 text-xs font-bold transition-all ${isSelected ? styles?.active : `bg-[#0B0E11] ${styles?.inactive}`}`}
                                                    >
                                                        {tier}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section 5: File Upload */}
                            <div className="rounded-xl border-2 border-dashed border-gray-700 bg-[#0B0E11] p-8 text-center transition-colors hover:border-pink-500/50 hover:bg-gray-900">
                                <input type="file" id="file-upload" className="hidden" accept="image/*" onChange={handleImageChange} />
                                <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                    <div className="rounded-full bg-gray-800 p-4">
                                        <Upload className="h-6 w-6 text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-white">Click to upload card image</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP (MAX. 2MB)</p>
                                </label>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}