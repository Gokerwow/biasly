import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from "@supabase/supabase-js"

export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

/**
 * Extracts the public_id from a Cloudinary URL
 * 
 * Example inputs:
 * - https://res.cloudinary.com/dj30qrjfv/image/upload/v1774685681/Biasly/Photocards/ae52542c-78a0-43ba-a4ab-39cff1dba3b6/shin-yuna-bfxciC7f.jpg
 * - https://res.cloudinary.com/dj30qrjfv/image/upload/Biasly/Photocards/group-id/card-name.jpg
 * 
 * Returns: "Biasly/Photocards/ae52542c-78a0-43ba-a4ab-39cff1dba3b6/shin-yuna-bfxciC7f"
 */
function extractPublicId(cloudinaryUrl: string): string | null {
    if (!cloudinaryUrl || !cloudinaryUrl.includes('cloudinary.com')) {
        return null
    }

    try {
        // Cloudinary URL structure:
        // https://res.cloudinary.com/{cloud_name}/image/upload/{version}/{public_id}.{extension}
        // OR
        // https://res.cloudinary.com/{cloud_name}/image/upload/{public_id}.{extension}

        const parts = cloudinaryUrl.split('/upload/')
        if (parts.length !== 2) {
            console.warn(`⚠️  Unexpected URL format: ${cloudinaryUrl}`)
            return null
        }

        let pathAfterUpload = parts[1]

        // Remove version number if present (e.g., v1774685681/)
        pathAfterUpload = pathAfterUpload.replace(/^v\d+\//, '')

        // Remove file extension (e.g., .jpg, .png, .webp)
        const publicId = pathAfterUpload.replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')

        return publicId

    } catch (error) {
        console.error(`❌ Error parsing URL: ${cloudinaryUrl}`, error)
        return null
    }
}

async function MigratePhotocardUrls() {
    console.log('🚀 MIGRATING PHOTOCARD IMAGE URLS TO PUBLIC_IDs...\n')

    const supabase = createAdminClient()

    let totalProcessed = 0
    let totalUpdated = 0
    let totalFailed = 0
    const failed: { id: string, error: string }[] = []

    let hasMore = true
    let offset = 0
    const batchSize = 100

    while (hasMore) {
        console.log(`\n📦 Fetching batch at offset ${offset}...`)

        const { data: photocards, error } = await supabase
            .from('photocards')
            .select('id, name, front_image_url, back_image_url')
            .or('front_image_url.ilike.%cloudinary.com%,back_image_url.ilike.%cloudinary.com%')
            .range(offset, offset + batchSize - 1)

        if (error) {
            console.error("❌ Error fetching photocards:", error)
            throw error
        }

        if (!photocards || photocards.length === 0) {
            console.log('\n✅ No more photocards to process!')
            hasMore = false
            break
        }

        console.log(`Processing ${photocards.length} photocards...`)

        for (const card of photocards) {
            try {
                totalProcessed++

                const updates: any = {}
                let needsUpdate = false

                // Process front_image_url
                if (card.front_image_url && card.front_image_url.includes('cloudinary.com')) {
                    const publicId = extractPublicId(card.front_image_url)
                    
                    if (publicId) {
                        updates.front_image_url = publicId
                        needsUpdate = true
                        console.log(`  ✓ Front: ${publicId}`)
                    } else {
                        console.warn(`  ⚠️  Could not extract front public_id for: ${card.id}`)
                    }
                }

                // Process back_image_url
                if (card.back_image_url && card.back_image_url.includes('cloudinary.com')) {
                    const publicId = extractPublicId(card.back_image_url)
                    
                    if (publicId) {
                        updates.back_image_url = publicId
                        needsUpdate = true
                        console.log(`  ✓ Back: ${publicId}`)
                    } else {
                        console.warn(`  ⚠️  Could not extract back public_id for: ${card.id}`)
                    }
                }

                // Update database if needed
                if (needsUpdate) {
                    const { error: updateError } = await supabase
                        .from('photocards')
                        .update(updates)
                        .eq('id', card.id)

                    if (updateError) {
                        throw updateError
                    }

                    totalUpdated++
                    console.log(`✅ Updated: ${card.name} (${card.id})`)
                } else {
                    console.log(`⏭️  Skipped: ${card.name} (${card.id}) - no Cloudinary URLs`)
                }

            } catch (err: any) {
                totalFailed++
                const errorMsg = err.message || String(err)
                failed.push({ id: card.id, error: errorMsg })
                console.error(`❌ Failed to process ${card.id}:`, errorMsg)
            }
        }

        offset += batchSize

        // Small delay between batches
        await new Promise(resolve => setTimeout(resolve, 500))
    }

    // Summary
    console.log('\n' + '═'.repeat(60))
    console.log('📊 MIGRATION SUMMARY')
    console.log('═'.repeat(60))
    console.log(`Total processed: ${totalProcessed}`)
    console.log(`Successfully updated: ${totalUpdated}`)
    console.log(`Failed: ${totalFailed}`)
    
    if (failed.length > 0) {
        console.log('\n⚠️  Failed cards:')
        failed.forEach(({ id, error }) => {
            console.log(`  - ${id}: ${error}`)
        })
    }

    console.log('\n✅ MIGRATION COMPLETE!')
}

// Add a test function to verify the extraction logic
function testExtraction() {
    console.log('🧪 Testing public_id extraction...\n')

    const testCases = [
        'https://res.cloudinary.com/dj30qrjfv/image/upload/v1774685681/Biasly/Photocards/ae52542c-78a0-43ba-a4ab-39cff1dba3b6/shin-yuna-bfxciC7f.jpg',
        'https://res.cloudinary.com/dj30qrjfv/image/upload/Biasly/Photocards/group-id/card-name.jpg',
        'https://res.cloudinary.com/dj30qrjfv/image/upload/v1234567890/Biasly/Photocards/test-card.png',
    ]

    testCases.forEach(url => {
        const publicId = extractPublicId(url)
        console.log(`URL: ${url}`)
        console.log(`Public ID: ${publicId}\n`)
    })
}

// Run test first, then migrate
// Uncomment to run tests:
// testExtraction()

// Run migration
MigratePhotocardUrls()
    .then(() => {
        console.log('\n🎉 All done!')
        process.exit(0)
    })
    .catch((err) => {
        console.error('💥 Fatal error:', err)
        process.exit(1)
    })