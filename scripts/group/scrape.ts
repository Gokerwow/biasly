// scripts/scrape.ts
import { apiClient } from "@/utils/apiClient"
import * as cheerio from "cheerio";
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";

const BUCKET_NAME = 'groups';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function UploadImageToSupabase(imageUrl: string, slug: string, type: 'main' | 'logo') {
    try {
        const response = await fetch(imageUrl)
        if (!response.ok) throw new Error('Failed to fetch image');

        const arrayBuffer = await response.arrayBuffer()
        let buffer = Buffer.from(arrayBuffer)
        // --- NEW: RESIZING LOGIC ---
        if (type === 'main') {
            const resizedBuffer = await sharp(buffer)
                .resize(1000)
                .webp({ quality: 80 })
                .toBuffer();

            // ✅ Use Buffer.from to satisfy the 'Buffer' type requirement
            buffer = Buffer.from(resizedBuffer);

        } else if (type === 'logo') {
            const resizedBuffer = await sharp(buffer)
                .resize(400)
                .webp({ quality: 90 })
                .toBuffer();

            // ✅ Use Buffer.from here too
            buffer = Buffer.from(resizedBuffer);
        }
        // ---------------------------
        const extension = 'webp';

        const fileName = `${slug}/${type}.${extension}`

        const { error } = await supabase
            .storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, {
                contentType: 'image/webp',
                upsert: true
            });
        if (error) throw error;

        const { data: publicData } = supabase
            .storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicData.publicUrl;

    } catch (error) {
        console.error(`Failed to upload ${type} for ${slug}:`, error);
        return null;
    }
}

async function FetchGroupLogo(groupName: string) {
    try {
        const url = `https://kpopping.com/profiles/group/${groupName}`;
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        })
        if (!response.ok) throw Error

        const html = await response.text();
        const $ = cheerio.load(html)

        const logoIMG = $('.materials figure.material img[alt="logo"]')
        const srcset = logoIMG.attr('srcset');
        let _logoPath: string | undefined;

        if (srcset) {
            // Split by comma, take the last one (usually highest res), and trim the '1100w' part
            const sources = srcset.split(',');
            const bestSource = sources[sources.length - 1].trim().split(' ')[0];
            _logoPath = bestSource;
        } else {
            _logoPath = logoIMG.attr('src');
        }

        if (!_logoPath) return null;

        return _logoPath.startsWith('http') ? _logoPath : `https://kpopping.com${_logoPath}`

    } catch (error) {
        console.log('EROR BOS DI FETCHING LOGO ', error)
        throw Error
    }
}

export default async function GroupScraping(pageId: number, groupName: string, lastUpdated: string, categoryName: string) {

    console.log('Fetching details for group:', groupName);

    const targetParam = pageId
        ? { pageid: pageId }
        : { page: groupName };

    const params = {
        action: 'parse',
        ...targetParam,
        format: 'json',
        origin: '*',
        prop: 'text|images|displaytitle'
    };

    try {
        const fetchDetail = await apiClient('', { params })

        if (!fetchDetail.data.parse) {
            throw new Error("Page not found or Parse API failed");
        }

        const html = fetchDetail.data.parse.text['*']
        const title = fetchDetail.data.parse.title
        const $ = cheerio.load(html)

        const finalName = title || groupName || "Unknown";
        const finalSlug = finalName
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        let statusText = 'unknown';
        let yearsRaw = $('[data-source="years"] .pi-data-value').text().trim();
        if (!yearsRaw) {
            yearsRaw = $('[data-source="years_active"] .pi-data-value').text().trim();
        }

        if (yearsRaw) {
            const periods = yearsRaw.split(';').map(p => p.trim());
            const lastPeriod = periods[periods.length - 1];
            const lowerPeriod = lastPeriod.toLowerCase();

            if (lowerPeriod.includes('present')) {
                statusText = 'active';
            } else if (lowerPeriod.match(/\d{4}.*?[–-].*?\d{4}/)) {
                statusText = 'inactive';
            } else if (lowerPeriod.match(/^\d{4}$/)) {
                statusText = 'active';
            } else {
                statusText = 'active';
            }
        }

        let finalMainUrl = null;
        const rawImageUrl = $('.portable-infobox .pi-image a').attr('href');

        if (rawImageUrl) {
            const cleanImageUrl = rawImageUrl.split('/revision')[0];
            console.log("⬆️ Uploading Main Image:", cleanImageUrl);
            finalMainUrl = await UploadImageToSupabase(cleanImageUrl, finalSlug, 'main');
        }

        console.log(`🔍 Searching Google Logo for: ${finalName}`);
        const LogoUrl = await FetchGroupLogo(finalName);

        let finalLogoUrl = null;
        if (LogoUrl) {
            console.log("⬆️ Uploading Logo:", LogoUrl);
            finalLogoUrl = await UploadImageToSupabase(LogoUrl, finalSlug, 'logo');
        } else {
            console.log("❌ No Logo URL found to upload.");
        }

        const memberCategories = ['current', 'inactive', 'former'] as const;

        const finalMembers: Record<typeof memberCategories[number], string[]> = {
            current: [],
            inactive: [],
            former: []
        };

        // Collect all members in one loop
        memberCategories.forEach(category => {
            const members = $(`[data-source="${category}"] .pi-data-value li`)
                .map((_, el) => {
                    const link = $(el).find('a')

                    if (link.length > 0) {
                        return link.attr('title')
                    }

                    return $(el).text().trim()
                })

                .get();

            if (members.length > 0) {
                finalMembers[category] = members;
            }
        });

        const groupPayload = {
            name: finalName,
            slug: finalSlug,
            status: statusText,
            image_url: finalMainUrl || null,
            logo_url: finalLogoUrl || null,
            wiki_last_updated: lastUpdated,
            category_name: categoryName,
            wiki_page_id: pageId
        };

        const { data: savedGroup, error } = await supabase
            .from('groups')
            .upsert(groupPayload, { onConflict: 'slug' })
            .select()
            .single();

        // console.log(finalMembers);
        if (error) {
            console.error('Failed to save group:', groupPayload.name, error);
            return error;
        }

        const groupId = savedGroup.id;

        // Helper function to create member payload
        const createMemberPayload = (memberList: string[]) => {
            // Safety check: if list is undefined/null, return empty array
            return (memberList || []).map((member: string) => ({
                stage_name: member,
                slug: member.toLowerCase().trim()
                    .replace(/[^\w\s-]/g, '')
                    .replace(/[\s_-]+/g, '-')
                    .replace(/^-+|-+$/g, '')
            }));
        };

        // const currentPayload = createMemberPayload(finalMembers.current);
        // const inactivePayload = createMemberPayload(finalMembers.inactive);
        // const formerPayload = createMemberPayload(finalMembers.former);

        // const finalMembersPayload = [...currentPayload, ...inactivePayload,...formerPayload]

        const statusMap: Record<typeof memberCategories[number], string> = {
            current: 'active',
            inactive: 'inactive',
            former: 'former'
        };

        for (const [categorykey, memberNames] of Object.entries(finalMembers)) {
            if (!memberNames || memberNames.length === 0) continue;

            const finalMembersPayload = createMemberPayload(memberNames)


            const { data: savedMember, error: memberError } = await supabase
                .from('idols')
                .upsert(finalMembersPayload, { onConflict: 'slug' })
                .select()


            if (error) {
                console.error('Failed to save member:', memberError);
                return error;
            }

            const pivotPayload = savedMember?.map((member) => ({
                group_id: groupId,
                idol_id: member.id,
                status: statusMap[categorykey as typeof memberCategories[number]] || 'unknown'
            }))


            await supabase.from('idol_groups').upsert(pivotPayload);

        }

        console.log(`✅ Finished ${savedGroup.name} and ${Object.values(finalMembers)?.length} members.`);

    } catch (error) {
        console.error("Error scraping group:", error)
        return null;
    }
}