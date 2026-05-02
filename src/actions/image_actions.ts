'use server'

import { ActionResponse } from "@/types"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
// Self expolainable
export async function UploadImageToCloudinary(formData: FormData, filename: string, type: 'Photocards' | 'Groups' | 'Idols' | 'Binders' = 'Photocards'): Promise<ActionResponse<{ url: string }>> {
    try {
        const file = formData.get('file') as File
        // CHECK: Is it actually a file?
        if (!file || typeof file === 'string') {
            return { success: false, error: new Error("No valid file found in FormData") };
        }
        
        const buffer = Buffer.from(await file.arrayBuffer())

        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

        const result = await cloudinary.uploader.upload(base64, {
            public_id: filename,
            folder: `Biasly/${type}`,
            quality: 'auto',
            fetch_format: 'auto',
            resource_type: "auto"
        })

        return { success: true, data: { url: result.public_id } }

    } catch (error) {
        console.error('Error at uploading image to cloudinary', error)
        return { success: false, error: error as Error }
    }
}