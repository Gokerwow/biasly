'use client'

import { useState } from 'react'
import { Binder, Templates } from '@/types'
import { Button } from '@/components/UI/button'
import { ChevronRight, ChevronLeft, Check, Loader2 } from 'lucide-react'
import BinderTemplatesStep from '../templates/page'
import BinderConfigStep from './binderConfig'
import { useUser } from '@/app/providers/authProvider'
import FinalReviewStep from './reviewStep'
import { UploadImageToCloudinary } from '@/actions/image_actions'
import { toSlug } from '@/helper/slug'
import { nanoid } from 'nanoid'
import { useToast } from '@/app/providers/toastProvider'
import { handleUploadImageError } from '@/helper/errorHandling'
import { CreateBinder, CreateBinderFromTemplate } from '@/actions/binder_actions'
import { useRouter } from 'next/navigation'
import { ROUTES } from '@/constants'
import { InferQueryType } from '@/helper/queryType'
import { getAllTemplates } from '@/queries/templates'

export const dynamic = 'force-dynamic'
type AutoTemplateType = InferQueryType<typeof getAllTemplates>

interface CreateBinderClientProps {
    templatesData: AutoTemplateType
}

const STEPS = [
    { id: 1, name: 'Choose Template', description: 'Pick a starting point' },
    { id: 2, name: 'Configure Binder', description: 'Customize your collection' },
    { id: 3, name: 'Review & Create', description: 'Finalize details' }
]

export type BinderState = Binder & {
    cover_file: File | null
}

export default function CreateBinderClient({ templatesData }: CreateBinderClientProps) {
    const { profile } = useUser()
    const { showToast } = useToast()
    const router = useRouter()

    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [binderData, setBinderData] = useState<BinderState>({
        id: '',
        user_id: profile?.id ?? '',
        origin_template_id: null,
        name: '',
        cover_url: '',
        cover_file: null,
        theme_color: '',
        is_pinned: false,
        breakdown: [],
        category: '',
        description: '',
        created_at: '',
        is_public: false,
        grid_layout: '3'
    })

    const handleTemplateStep = (template?: Templates) => {
        if (template) {
            setBinderData({
                ...binderData,
                name: template.name,
                cover_url: template.cover_url,
                theme_color: template.theme_color,
                breakdown: template.breakdown,
                category: template.category,
                description: template.description,
                origin_template_id: template.id,
                grid_layout: template.grid_layout
            })
        } else {
            setBinderData({ ...binderData, origin_template_id: null })
        }
        setStep(2)
    }

    const handleUpdateData = (updates: Partial<typeof binderData>) => {
        setBinderData((prevData) => ({ ...prevData, ...updates }))
    }

    const handleNext = () => {
        if (step < 3) setStep(step + 1)
    }

    const handleBack = () => {
        if (step > 1) setStep(step - 1)
    }

    const handleCreateBinder = async () => {
        setIsSubmitting(true)

        if (!binderData.cover_file) {
            showToast("Please select an Image as the cover!", "error")
            return
        }

        const fileName = toSlug(`${binderData.name}-${nanoid(8)}`)

        const data = new FormData()
        data.append('file', binderData.cover_file)

        const response = await UploadImageToCloudinary(data, fileName, 'Binders')

        if (response.error) handleUploadImageError(response.error, 'Uploading Image')

        const payload = {
            user_id: profile?.id ?? '',
            origin_template_id: binderData.origin_template_id,
            name: binderData.name,
            cover_url: response.data!.url,
            theme_color: binderData.theme_color,
            breakdown: binderData.breakdown,
            category: binderData.category,
            description: binderData.description,
            is_public: binderData.is_public,
            grid_layout: binderData.grid_layout
        }

        const result = payload.origin_template_id ? await CreateBinderFromTemplate(payload) : await CreateBinder(payload)

        if (result?.error) {
            console.error('Error at creating binder payload: ', result?.error)
            showToast('Failed to create binder', 'error')
        }

        
        if (result?.data) {
            const targetUrl = ROUTES.BINDER.DETAIL.replace(':id', result?.data)
            router.push(targetUrl)
        } else {
            console.error('Error at redirecting to binder: ', result?.error)
            showToast('Failed to redirecting to binder', 'error')
        }
        setIsSubmitting(false)
    }

    return (
        <div className="flex flex-col gap-8 relative max-w-7xl mx-auto">

            {/* --- WIZARD STEP INDICATOR --- */}
            <div className="relative">
                {/* Progress Bar Background */}
                <div className="absolute top-5 left-0 right-0 h-1 bg-gray-800 rounded-full" />

                {/* Active Progress Bar */}
                <div
                    className="absolute top-5 left-0 h-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${((step - 1) / (STEPS.length - 1)) * 100}%` }}
                />

                {/* Steps */}
                <div className="relative flex justify-between">
                    {STEPS.map((s, index) => {
                        const isCompleted = step > s.id
                        const isActive = step === s.id
                        const isUpcoming = step < s.id

                        return (
                            <div key={s.id} className="flex flex-col items-center gap-3" style={{ width: `${100 / STEPS.length}%` }}>
                                {/* Circle */}
                                <div className={`
                                    relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                                    ${isCompleted
                                        ? 'bg-gradient-to-br from-pink-500 to-purple-500 border-transparent shadow-lg shadow-pink-500/30'
                                        : isActive
                                            ? 'bg-gray-900 border-pink-500 shadow-lg shadow-pink-500/30 scale-110'
                                            : 'bg-gray-900 border-gray-700'
                                    }
                                `}>
                                    {isCompleted ? (
                                        <Check className="h-5 w-5 text-white" />
                                    ) : (
                                        <span className={`text-sm font-black ${isActive ? 'text-pink-500' : 'text-gray-600'}`}>
                                            {s.id}
                                        </span>
                                    )}
                                </div>

                                {/* Label */}
                                <div className="text-center hidden sm:block">
                                    <p className={`text-xs font-black uppercase tracking-wider transition-colors ${isActive ? 'text-white' : isCompleted ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                        {s.name}
                                    </p>
                                    <p className="text-[10px] text-gray-600 mt-0.5">
                                        {s.description}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* --- STEP CONTENT --- */}
            <div className="min-h-[600px]">
                {step === 1 && (
                    <BinderTemplatesStep
                        templatesData={templatesData}
                        onTemplate={(template) => handleTemplateStep(template)}
                        onBlank={handleTemplateStep}
                    />
                )}
                {step === 2 && (
                    <BinderConfigStep
                        binderData={binderData}
                        updateBinderData={handleUpdateData}
                    />
                )}
                {step === 3 && (
                    <FinalReviewStep
                        binderData={binderData}

                    />
                )}
            </div>

            {/* --- WIZARD NAVIGATION --- */}
            <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-t from-[#0B0E11] via-[#0B0E11] to-transparent pt-8 pb-6 -mx-4 px-4">
                <div className="max-w-7xl mx-auto">
                    {/* Divider */}
                    <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent mb-6" />

                    <div className="flex items-center justify-between gap-4">
                        {/* Back Button */}
                        <Button
                            variant="outline"
                            onClick={handleBack}
                            disabled={step === 1}
                            className={`${step === 1 ? 'invisible' : ''}`}
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>

                        {/* Progress Info */}
                        <div className="hidden sm:block text-center">
                            <p className="text-sm text-gray-500">
                                Step <span className="font-black text-white">{step}</span> of <span className="font-black text-gray-400">{STEPS.length}</span>
                            </p>
                        </div>

                        {/* Next/Finish Button */}
                        {step < STEPS.length ? (
                            <Button
                                onClick={handleNext}
                            >
                                Continue
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleCreateBinder}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Check className="h-4 w-4 mr-2" />
                                )}
                                {isSubmitting ? "Creating..." : "Create Binder"}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}