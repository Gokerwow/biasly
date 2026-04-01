/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { AddCard, UploadImageToCloudinary } from "@/actions/card_actions"
import { useDebounce } from "@/app/providers/debounce"
import { useToast } from "@/app/providers/toastProvider"
import CardItem from "@/components/cards/cards"
import SearchableSelect from "@/components/UI/searchableSelect"
import { ROUTES } from "@/constants"
import { getCardTypes, getGroups, getIdolsByGroup, getPhysicalTypes, getReleasesByGroup } from "@/queries/photocards"
import { CardRarity } from "@/types/database.helper"
import { Book, IdCardLanyard, Layers, Save, Star, Tag, Upload, User, Users, X, FlipVertical, RotateCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef } from "react"
import { nanoid } from 'nanoid'
import { useUser } from "@/app/providers/authProvider"
import { ArtistType } from "@/types"
import { Json } from "@/types/supabase"

interface IdolDropdown {
    id: string
    stage_name: string
}

interface UnitMembers {
    id: string
    stage_name: string
}

interface GroupsDropdown {
    id: string
    name: string
}

interface ReleasesDropdown {
    id: string
    title: string
}

interface CardDistributionDropdown {
    id: string,
    name: string,
    rarity_weight: number | null,
    description: string | null
}

interface CardPhysicalDropdown {
    id: number,
    name: string,
    modifier: number | null,
    description: string | null
}

interface FormState {
    name: string
    group_id: string | null
    release_id: string | null
    card_distribution: CardDistributionDropdown | null
    card_physicals: CardPhysicalDropdown[] | null
    rarity: CardRarity
    artist_type: ArtistType
    idol_ids: UnitMembers[]
    frontImage: File | null,
    backImage: File | null,
    frontPreviewUrl: string
    backPreviewUrl: string
    is_double_sided: boolean
    is_horizontal: boolean
}

const ArtistTypeValue = ['group', 'unit', 'solo']

export default function AddCardClient() {
    // ✅ Create supabase client once using useMemo
    const { profile } = useUser()
    const { showToast } = useToast()

    // --- Data State ---
    const [members, setMembers] = useState<IdolDropdown[]>([])
    const [releases, setReleases] = useState<ReleasesDropdown[]>([])
    const [groups, setGroups] = useState<GroupsDropdown[]>([])
    const [cardDistributionTypes, setCardDistributionTypes] = useState<CardDistributionDropdown[]>([])
    const [cardPhysicalTypes, setCardPhysicalTypes] = useState<CardPhysicalDropdown[]>([])

    // ✅ Separate loading states for better control
    const [isLoadingGroups, setIsLoadingGroups] = useState(false)
    const [isLoadingGroupData, setIsLoadingGroupData] = useState(false)
    const [isloadingCardsTypes, setIsloadingCardsTypes] = useState(false)
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
        release_id: null,
        card_distribution: null,
        card_physicals: [],
        rarity: 'UR',
        artist_type: 'group',
        idol_ids: [],
        frontImage: null,
        backImage: null,
        frontPreviewUrl: '',
        backPreviewUrl: '',
        is_double_sided: false,
        is_horizontal: false
    })

    // 1. Fetch Groups
    useEffect(() => {
        const fetchGroups = async () => {
            setIsLoadingGroups(true)
            try {
                const data = await getGroups(debouncedQuery)
                setGroups(data || [])
            } catch (error) {
                console.error("Error fetching groups:", error)
            } finally {
                setIsLoadingGroups(false)
            }
        }
        fetchGroups()
    }, [debouncedQuery])

    // 2. Fetch Members & Releases
    useEffect(() => {
        if (!formData.group_id) return

        const fetchGroupData = async () => {
            setIsLoadingGroupData(true)
            try {
                const [releasesRes, membersRes] = await Promise.all([
                    getReleasesByGroup(formData.group_id!),
                    getIdolsByGroup(formData.group_id!)
                ])

                setReleases(releasesRes || [])

                const cleanMembers = membersRes.map((item: any) => ({
                    id: item.idols.id,        // actual idol UUID
                    stage_name: item.idols.stage_name.replace(/\((.*)+\)/g, '').trim()
                }))

                setMembers(cleanMembers)
            } catch (error) {
                console.error("Error fetching group data:", error)
            } finally {
                setIsLoadingGroupData(false)
            }
        }
        fetchGroupData()
    }, [formData.group_id])

    // 2. Fetch Cards Types
    useEffect(() => {
        const fetchCardTypes = async () => {
            setIsloadingCardsTypes(true)

            try {
                const [distrbutionTypes, physicalTypes] = await Promise.all([
                    getCardTypes().then(d => { console.log('distribution:', d); return d }),
                    getPhysicalTypes().then(d => { console.log('physical:', d); return d })
                ])

                setCardDistributionTypes(distrbutionTypes)
                setCardPhysicalTypes(physicalTypes)

            } catch (error) {
                console.error("Error fetching card types:", error)
            } finally {
                setIsloadingCardsTypes(false)
            }
        }

        fetchCardTypes()
    }, [])

    // 3. Cleanup preview URLs on unmount
    const frontUrlRef = useRef<string>('')
    const backUrlRef = useRef<string>('')

    useEffect(() => {
        return () => {
            if (frontUrlRef.current) URL.revokeObjectURL(frontUrlRef.current)
            if (backUrlRef.current) URL.revokeObjectURL(backUrlRef.current)
        }
    }, [])

    useEffect(() => {
        console.log("FRONT", formData.frontPreviewUrl)
        console.log("BACK", formData.backPreviewUrl)
    }, [formData.frontPreviewUrl, formData.backPreviewUrl])

    if (!profile) {
        showToast('You must be logged in', 'error')
        return
    }

    // --- Handlers ---
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSelectChange = (field: keyof FormState, value: any) => {
        if (field === 'group_id') {
            setIsDisabled(false)
            setFormData(prev => ({ ...prev, group_id: value, idol_ids: [], release_id: null }))
        } else {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            frontUrlRef.current = objectUrl
            setFormData(prev => ({ ...prev, frontImage: file, frontPreviewUrl: objectUrl }))
        }
    }

    const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const objectUrl = URL.createObjectURL(file)
            backUrlRef.current = objectUrl
            setFormData(prev => ({ ...prev, backImage: file, backPreviewUrl: objectUrl }))
        }
    }

    const handleToggle = (field: 'is_double_sided' | 'is_horizontal') => {
        setFormData(prev => ({
            ...prev,
            [field]: !prev[field],
            // Clear back image if disabling double-sided
            ...(field === 'is_double_sided' && prev[field] ? { backImage: null, backPreviewUrl: '' } : {})
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.frontImage || !formData.group_id) {
            showToast("Please select a Group and an Image!", "error")
            return
        }

        setIsSubmitting(true)
        try {
            const cleanName = formData.name
                .toLowerCase()
                .replace(/[^a-z0-9]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '')

            const fileName = `${formData.group_id}/${cleanName}-${nanoid(8)}`

            const data = new FormData()
            data.append('file', formData.frontImage)

            const response = await UploadImageToCloudinary(data, fileName)

            if (response.error) {
                console.error('Error uploading image', response.error)
                throw new Error(`Error uploading image ${response.error}`)
            }

            // Upload back image if double-sided
            let backImageUrl = null
            if (formData.is_double_sided && formData.backImage) {
                const backData = new FormData()
                backData.append('file', formData.backImage)
                const backResponse = await UploadImageToCloudinary(backData, `${fileName}-back`)

                if (backResponse.error) {
                    console.error('Error uploading back image', backResponse.error)
                    throw new Error(`Error uploading back image ${backResponse.error}`)
                }
                backImageUrl = backResponse.data!.url
            }

            const dataJSON: Json = {
                release_id: formData.release_id,
                name: formData.name,
                front_image_url: response.data!.url,
                back_image_url: backImageUrl,
                rarity: formData.rarity,
                primary_group_id: formData.group_id,
                distribution_type_id: formData.card_distribution?.id ?? null,
                physical_type_ids: formData.card_physicals?.map(p => p.id) ?? null,
                idol_ids: formData.idol_ids.map(i => i.id),   // ← array of idol UUIDs
                subject_type: formData.artist_type,            // ← 'group' | 'unit' | 'solo'
                is_double_sided: formData.is_double_sided,
                is_horizontal: formData.is_horizontal,
            }

            const payload = {
                submitted_by: profile.id,
                data: dataJSON,
                status: 'pending' as const
            }

            console.log('YANG MAU DIKUPULKAN: ', payload)

            const result = await AddCard(payload)

            if (result.error) {
                console.error('Error inserting photocard', result.error)
                throw new Error(`Error inserting photocard ${result.error}`)
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
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
                {/* --- LEFT COL: LIVE PREVIEW --- */}
                <div className="lg:col-span-3">
                    <div className="lg:sticky lg:top-6 flex flex-col gap-6">
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
                                <CardItem
                                    isDoubleSided={formData.is_double_sided}
                                    isHorizontal={formData.is_horizontal}
                                    id="preview"
                                    type="collection"
                                    distribution_type={formData.card_distribution?.name ?? null}
                                    group_name={groups.find(g => g.id === formData.group_id)?.name ?? null}
                                    front_image_url={formData.frontPreviewUrl || null}
                                    back_image_url={formData.backPreviewUrl || null}
                                    idols={formData.idol_ids}
                                    name={formData.name || 'Card Name'}
                                    physical_types={formData.card_physicals ? formData.card_physicals.map(p => ({ name: p.name })) : []}
                                    rarity={formData.rarity}
                                    release_title={releases.find(r => r.id === formData.release_id)?.title ?? null}
                                />
                                <div className="mt-6 text-center max-w-[200px]">
                                    <p className="text-[10px] uppercase tracking-widest text-gray-600">Preview Mode</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- RIGHT COL: FORM DATA --- */}
                <div className="lg:col-span-9">
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
                                        name="card_distribution"
                                        label="Card Distribution Type"
                                        items={cardDistributionTypes.map(type => ({ id: type.id, name: type.name ?? '' }))}
                                        icon={IdCardLanyard}
                                        onSelect={(item) => handleSelectChange('card_distribution', cardDistributionTypes.find(t => t.id === item?.id) ?? null)}
                                        placeholder="e.g. Album"
                                        isLoading={isloadingCardsTypes}
                                    />
                                    <SearchableSelect
                                        name="card_physical"
                                        label="Card Physical Type"
                                        items={cardPhysicalTypes.map(type => ({ id: String(type.id), name: type.name ?? '' }))}
                                        icon={IdCardLanyard}
                                        onSelect={(items) => handleSelectChange('card_physicals', items.map(i => ({ id: i.id, name: i.name })))}
                                        placeholder="e.g. Holographic"
                                        isLoading={isloadingCardsTypes}
                                        mode="tag"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase">Card Subject</label>
                                    <div className="flex rounded-xl bg-[#0B0E11] p-1 border border-gray-700">
                                        {ArtistTypeValue.map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData((prev): FormState => ({ ...prev, artist_type: type as ArtistType, idol_ids: [] }))}
                                                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${formData.artist_type === type ? 'bg-gray-800 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}
                                            >
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Card Properties Toggles */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => handleToggle('is_double_sided')}
                                        className={`
                                            flex items-center justify-between gap-3 rounded-xl border p-4 transition-all
                                            ${formData.is_double_sided
                                                ? 'bg-pink-500/10 border-pink-500/30 text-pink-400'
                                                : 'bg-[#0B0E11] border-gray-700 text-gray-500 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FlipVertical className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase">Double Sided</span>
                                        </div>
                                        <div className={`
                                            h-5 w-9 rounded-full transition-colors relative
                                            ${formData.is_double_sided ? 'bg-pink-500' : 'bg-gray-700'}
                                        `}>
                                            <div className={`
                                                absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform
                                                ${formData.is_double_sided ? 'translate-x-4' : 'translate-x-0.5'}
                                            `} />
                                        </div>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => handleToggle('is_horizontal')}
                                        className={`
                                            flex items-center justify-between gap-3 rounded-xl border p-4 transition-all
                                            ${formData.is_horizontal
                                                ? 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                                : 'bg-[#0B0E11] border-gray-700 text-gray-500 hover:border-gray-600'
                                            }
                                        `}
                                    >
                                        <div className="flex items-center gap-2">
                                            <RotateCw className="h-4 w-4" />
                                            <span className="text-xs font-bold uppercase">Horizontal</span>
                                        </div>
                                        <div className={`
                                            h-5 w-9 rounded-full transition-colors relative
                                            ${formData.is_horizontal ? 'bg-blue-500' : 'bg-gray-700'}
                                        `}>
                                            <div className={`
                                                absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform
                                                ${formData.is_horizontal ? 'translate-x-4' : 'translate-x-0.5'}
                                            `} />
                                        </div>
                                    </button>
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
                                        onSelect={(item) => handleSelectChange('group_id', item?.id)}
                                        onQueryChange={(q) => setQuery(q)}
                                        placeholder="e.g. ITZY"
                                        isLoading={isLoadingGroups}
                                    />

                                    {/* CONDITIONAL INPUTS BASED ON SUBJECT CATEGORY */}
                                    {formData.artist_type === 'solo' && (
                                        <SearchableSelect
                                            key={`${formData.group_id}-${formData.artist_type}`}
                                            name="idol_id"
                                            label="Idol"
                                            items={members.map(m => ({ id: m.id, name: m.stage_name }))}
                                            icon={Star}
                                            onSelect={(item) => {
                                                handleSelectChange('idol_ids', [{ id: item?.id, stage_name: item?.name }])
                                            }}
                                            placeholder="e.g. YUNA"
                                            disabled={isDisabled}
                                            isLoading={isLoadingGroupData}
                                        />
                                    )}

                                    {formData.artist_type === 'unit' && (
                                        <SearchableSelect
                                            key={`${formData.group_id}-${formData.artist_type}`}
                                            name="unit_names"
                                            label="Unit Members"
                                            items={members.map(m => ({ id: m.id, name: m.stage_name }))}
                                            icon={Star}
                                            onSelect={(items) => {
                                                handleSelectChange('idol_ids', items.map(i => ({ id: i.id, stage_name: i.name })))
                                            }}
                                            placeholder="e.g. Yeji & Ryujin"
                                            disabled={isDisabled}
                                            mode="tag"
                                            isLoading={isLoadingGroupData}
                                        />
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
                                            onSelect={(item) => handleSelectChange('release_id', item?.id)}
                                            placeholder="e.g. CHECKMATE"
                                            disabled={isDisabled}
                                            isLoading={isLoadingGroupData}
                                        />
                                    </div>
                                </div>
                            </div>

                            <hr className="border-gray-800" />

                            {/* Section 5: File Upload */}
                            <div className="space-y-4">
                                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                                    <Upload className="h-4 w-4 text-green-500" />
                                    Card Images
                                </h3>

                                {/* Front Image Upload */}
                                <div className="rounded-xl border-2 border-dashed border-gray-700 bg-[#0B0E11] p-8 text-center transition-colors hover:border-pink-500/50 hover:bg-gray-900">
                                    <input
                                        type="file"
                                        id="front-upload"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    <label htmlFor="front-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <div className="rounded-full bg-gray-800 p-4">
                                            <Upload className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <p className="text-sm font-bold text-white">Front Image {!formData.is_double_sided && '(Required)'}</p>
                                        <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP (MAX. 2MB)</p>
                                        {formData.frontPreviewUrl && (
                                            <p className="text-xs text-green-400 mt-2">✓ Image uploaded</p>
                                        )}
                                    </label>
                                </div>

                                {/* Back Image Upload (only if double-sided) */}
                                {formData.is_double_sided && (
                                    <div className="rounded-xl border-2 border-dashed border-gray-700 bg-[#0B0E11] p-8 text-center transition-colors hover:border-pink-500/50 hover:bg-gray-900">
                                        <input
                                            type="file"
                                            id="back-upload"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleBackImageChange}
                                        />
                                        <label htmlFor="back-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                            <div className="rounded-full bg-gray-800 p-4">
                                                <FlipVertical className="h-6 w-6 text-gray-400" />
                                            </div>
                                            <p className="text-sm font-bold text-white">Back Image (Optional)</p>
                                            <p className="text-xs text-gray-500">SVG, PNG, JPG or WEBP (MAX. 2MB)</p>
                                            {formData.backPreviewUrl && (
                                                <p className="text-xs text-green-400 mt-2">✓ Image uploaded</p>
                                            )}
                                        </label>
                                    </div>
                                )}
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </form>
    )
}