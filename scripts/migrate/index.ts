import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from 'cloudinary';

const imageTypes = ['idols', 'groups']
const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

export function createAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

async function uploadWithRetry(url: string, options: any, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await cloudinary.uploader.upload(url, options)
        } catch (err: any) {
            const isRateLimit = err.http_code === 420 ||
                (err.http_code === 400 && err.message?.includes('420'))

            if (isRateLimit && i < retries - 1) {
                const waitTime = (i + 1) * 2000
                console.log(`⏳ Rate limited, retrying in ${(i + 1) * 2}s...`)
                await sleep(waitTime)
            } else {
                throw err
            }
        }
    }
}

async function explicitWithRetry(publicId: string, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            return await cloudinary.uploader.explicit(publicId, {
                type: 'upload',
                eager: [{ quality: 'auto', fetch_format: 'auto' }],
                eager_async: false,
                invalidate: true,
            })
        } catch (err: any) {
            const isRateLimit = err.http_code === 420 ||
                (err.http_code === 400 && err.message?.includes('420'))

            if (isRateLimit && i < retries - 1) {
                const waitTime = (i + 1) * 2000
                console.log(`⏳ Rate limited, retrying in ${(i + 1) * 2}s...`)
                await sleep(waitTime)
            } else {
                throw err
            }
        }
    }
}

async function MigrateImage() {
    console.log('🚀 MIGRATING IMAGES..........')

    const supabase = createAdminClient()

    cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    for (const type of imageTypes) {
        console.log(`\n📁 Migrating ${type}...`)
        let totalMigrated = 0
        let stillExist = true
        const failed: string[] = []

        while (stillExist) {
            const { data, error } = await supabase
                .from(type)
                .select('id, slug, image_url, is_migrated, is_compressed')
                .not('image_url', 'is', null)
                .is('is_compressed', null)  // ✅ only fetch uncompressed ones
                .limit(100)

            if (error) {
                console.error("Error fetching data:", error)
                throw error
            }

            if (data && data.length > 0) {
                console.log(`Processing batch of ${data.length} ${type}...`)

                for (const idol of data) {
                    try {
                        if (!idol.image_url) {
                            console.log(`⏭️  Skipping ${idol.id} - no image_url`)
                            continue
                        }

                        const filename = `${idol.slug}_${idol.id}`

                        if (idol.is_migrated) {
                            // ✅ Already on Cloudinary → use explicit to apply compression
                            console.log(`🔄 Re-compressing: ${idol.image_url}`)
                            await explicitWithRetry(idol.image_url)

                            // Mark as compressed
                            const { error: compressError } = await supabase
                                .from(type)
                                .update({ is_compressed: true })
                                .eq('id', idol.id)

                            if (compressError) {
                                console.error("Error marking as compressed:", compressError)
                                throw compressError
                            }

                        } else {
                            // ✅ Not yet migrated → upload fresh with compression
                            console.log(`⬆️  Uploading: ${filename}`)
                            const result = await uploadWithRetry(idol.image_url, {
                                public_id: filename,
                                folder: `Biasly/${type.charAt(0).toUpperCase() + type.slice(1)}`,
                                quality: 'auto',
                                fetch_format: 'auto',
                            })

                            if (!result) throw new Error('Upload returned no result')

                            // Update image_url, is_migrated and is_compressed all at once
                            const { error: updateError } = await supabase
                                .from(type)
                                .update({
                                    image_url: result.public_id,
                                    is_migrated: true,
                                    is_compressed: true  // ✅ mark compressed too
                                })
                                .eq('id', idol.id)

                            if (updateError) {
                                console.error("Error updating record:", updateError)
                                throw updateError
                            }
                        }

                        totalMigrated++
                        console.log(`✅ Done: ${filename}`)
                        await sleep(300)

                    } catch (uploadFail) {
                        console.error(`❌ Failed ${idol.id}:`, uploadFail)
                        failed.push(idol.id)
                        await sleep(1000)
                    }
                }

                console.log(`⏳ Waiting before next batch...`)
                await sleep(500)

            } else {
                console.log(`\n🎉 Done migrating ${type}!`)
                console.log(`Total migrated: ${totalMigrated}`)
                if (failed.length > 0) {
                    console.log(`⚠️  Failed ids (${failed.length}):`, failed)
                }
                stillExist = false
            }
        }
    }

    console.log('\n✅ MIGRATION COMPLETE!')
}

async function MigrateLogoImage() {
    console.log('🚀 MIGRATING LOGO IMAGES..........')
    const groups = 'groups'

    const supabase = createAdminClient()

    cloudinary.config({
        cloud_name: CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    })

    console.log(`\n📁 Migrating ${groups}...`)
    let totalMigrated = 0
    let stillExist = true
    const failed: string[] = []

    while (stillExist) {
        const { data, error } = await supabase
            .from(groups)
            .select('id, slug, logo_url')
            .not('logo_url', 'is', null)
            .is('is_logo_migrated', null)
            .limit(100)

        if (error) {
            console.error("Error fetching data:", error)
            throw error
        }

        if (data && data.length > 0) {
            console.log(`Processing batch of ${data.length} ${groups}...`)

            for (const idol of data) {
                try {
                    if (!idol.logo_url) {
                        console.log(`⏭️  Skipping ${idol.id} - no logo_url`)
                        continue
                    }

                    const filename = `${idol.slug}_${idol.id}`

                    // ✅ Not yet migrated → upload fresh with compression
                    console.log(`⬆️  Uploading: ${filename}`)
                    const result = await uploadWithRetry(idol.logo_url, {
                        public_id: filename,
                        folder: `Biasly/${groups.charAt(0).toUpperCase() + groups.slice(1)}/logos`,
                        quality: 'auto',
                        fetch_format: 'auto',
                    })

                    if (!result) throw new Error('Upload returned no result')

                    // Update image_url, is_migrated and is_compressed all at once
                    const { error: updateError } = await supabase
                        .from(groups)
                        .update({
                            logo_url: result.public_id,
                            is_logo_migrated: true
                        })
                        .eq('id', idol.id)

                    if (updateError) {
                        console.error("Error updating record:", updateError)
                        throw updateError
                    }

                    totalMigrated++
                    console.log(`✅ Done: ${filename}`)
                    await sleep(300)

                } catch (uploadFail) {
                    console.error(`❌ Failed ${idol.id}:`, uploadFail)
                    failed.push(idol.id)
                    await sleep(1000)
                }
            }

            console.log(`⏳ Waiting before next batch...`)
            await sleep(500)

        } else {
            console.log(`\n🎉 Done migrating ${groups}!`)
            console.log(`Total migrated: ${totalMigrated}`)
            if (failed.length > 0) {
                console.log(`⚠️  Failed ids (${failed.length}):`, failed)
            }
            stillExist = false
        }
    }

    console.log('\n✅ MIGRATION COMPLETE!')
}

MigrateLogoImage()
    .then(() => console.log('\n🎉 All done!'))
    .catch((err) => console.error('💥 Fatal error:', err))