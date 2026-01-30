/* eslint-disable @typescript-eslint/no-explicit-any */
// scripts/idol/scrape.ts
import { apiClient } from "@/utils/apiClient"
import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import wtf from 'wtf_wikipedia';

const BUCKET_NAME = 'idols';

// Create Client inside function or globally is fine, just ensure ENV vars are loaded
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// --- HELPER FUNCTIONS ---

async function UploadImageToSupabase(imageUrl: string, slug: string) {
    if (!imageUrl) return null; // Safety Check
    try {
        // console.log('uploading image to supabase for idol:', slug);
        const response = await fetch(imageUrl);
        if (!response.ok) return null; // Fail silently for bad images

        const arrayBuffer = await response.arrayBuffer();
        let buffer = Buffer.from(arrayBuffer);

        // RESIZING LOGIC
        const resizedBuffer = await sharp(buffer)
            .resize(1000)
            .webp({ quality: 80 })
            .toBuffer();

        buffer = Buffer.from(resizedBuffer);
        const fileName = `${slug}.webp`;

        const { error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(fileName, buffer, { contentType: 'image/webp', upsert: true });

        if (error) throw error;

        const { data: publicData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(fileName);

        return publicData.publicUrl;

    } catch (error) {
        console.error(`⚠️ Failed to upload image for ${slug}:`, error);
        return null;
    }
}

async function FetchImageUrl(fileName: string, idolName: string) {
    if (!fileName) return null; // Safety Check

    // console.log('Fetching image for idol:', idolName);
    const params = {
        action: 'query',
        titles: `File:${fileName}`,
        prop: 'imageinfo',
        iiprop: 'url|size|dimensions',
        format: 'json',
        origin: '*',
    };

    try {
        const response = await apiClient('', { params });
        const pages = response.data.query?.pages;
        if (!pages) return null;

        const pageId = Object.keys(pages)[0];
        // ✅ SAFETY FIX: Add ?. everywhere
        const imageUrl = pages[pageId]?.imageinfo?.[0]?.url;
        return imageUrl ?? null;

    } catch (error) {
        console.log('Error Fetching image for idol:', idolName, error);
        return null;
    }
}

function parseWikiDate(rawText: string | undefined): string | null {
    if (!rawText) return null;
    const clean = rawText.replace(/\[.*?\]/g, '').replace(/\(.*?\)/g, '').trim();
    const dateObj = new Date(clean);
    if (isNaN(dateObj.getTime())) return null;
    return dateObj.toLocaleDateString('en-CA');
}

function parseSns(wikitext: string) {
    if (!wikitext) return [];
    const snsMatch = wikitext.match(/\|\s*sns\s*=\s*(.+?)(\n\||}}$)/s);
    if (!snsMatch) return [];

    const snsRaw = snsMatch[1];
    const pattern = /{{(Instagram|Twitter|TikTok|YouTube|Website)\|([^}]+)}}/gi;
    const results = [];
    let match;

    while ((match = pattern.exec(snsRaw)) !== null) {
        results.push({ platform: match[1], handle: match[2] });
    }
    return results;
}

function cleanWikiName(rawName: string): string {
    // 1. Remove "w:c:something:" prefix (Interwiki links)
    let clean = rawName.replace(/^w:[a-z]+:[a-z]+:/i, ''); 
    
    // 2. Remove simple "w:" prefix if exists
    clean = clean.replace(/^w:/i, '');

    // 3. Remove underscores
    return clean.replace(/_/g, ' ').trim();
}

// --- MAIN SCRAPER ---

export default async function IdolScraping(idolName: string, id?: string, pageId?: number, last_updated?: string) {
    // console.log('Fetching details for idol:', idolName);

    const cleanName = cleanWikiName(idolName);

    const wikiSlug = cleanName.replace(/\s+/g, '_');
    const targetParam = pageId ? { pageids: pageId } : { titles: wikiSlug };

    const params = {
        action: 'query',
        ...targetParam,
        format: 'json',
        origin: '*',
        prop: 'revisions',
        rvprop: 'content|timestamp'
    };

    try {
        const fetchDetail = await apiClient('', { params });

        if (!fetchDetail.data.query?.pages) {
            throw new Error(`Page not found for ${idolName}`);
        }

        const pages = fetchDetail.data.query.pages;
        const fetchedPageId = Object.keys(pages)[0];
        const pageData = pages[fetchedPageId];

        // ✅ CRITICAL FIX 1: Handle Missing Revisions safely
        const latestRevision = pageData.revisions?.[0];

        if (!latestRevision) {
            console.warn(`⚠️ No content found for ${idolName}. Skipping...`);
            // Mark as "Checked" so we don't loop forever
            if (id) {
                await supabase.from('idols').update({ last_synced_at: new Date().toISOString() }).eq('id', id);
            }
            return null;
        }

        const wikitext = latestRevision["*"];
        const wiki_last_updated = latestRevision.timestamp ?? new Date().toISOString();
        const now = new Date().toISOString();

        // --- CHECK UPDATE STATUS ---
        if (last_updated && last_updated === wiki_last_updated) {
            // console.log(`⏩ ${idolName} is up to date.`);
            if (id) {
                await supabase.from('idols').update({ last_synced_at: now }).eq('id', id);
            }
            return;
        }

        // --- PARSING ---
        const doc = wtf(wikitext);
        const infobox = doc.infobox();

        // ✅ CRITICAL FIX 2: Handle Missing Infobox Fields safely
        // If 'name' is missing, fallback to empty string or null, DON'T CRASH.
        const nameRaw = (infobox?.get('name') as any)?.text?.();
        const name = nameRaw || idolName; // Fallback to the requested name if infobox is empty

        // Safe Slug Generation
        // (Note: You commented out slug usage in payload, but keeping logic just in case)
        const slug = name.toLowerCase().trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');

        // Safe Field Access
        const birthNameRaw = (infobox?.get('birth_name') as any)?.text?.() || '';
        const nativeMatch = birthNameRaw.match(/\(([^)]+)\)/);
        const native_name = nativeMatch ? nativeMatch[1] : null;
        const real_name = birthNameRaw ? birthNameRaw.replace(/\s*\(.*\)/, '').trim() : '';

        // Safe Date Access
        const birthDateRaw = (infobox?.get('birth_date') as any)?.text?.();
        const birth_date = parseWikiDate(birthDateRaw);

        // Safe Image Access
        const imageRaw = (infobox?.get('image') as any)?.text?.();
        let imageSupabaseUrl = null;

        if (imageRaw) {
            const imageUrl = await FetchImageUrl(imageRaw, idolName);
            if (imageUrl) {
                imageSupabaseUrl = await UploadImageToSupabase(imageUrl, slug);
            }
        }

        const snsLinks = parseSns(wikitext);

        // --- SAVE TO DB ---
        const payload = {
            stage_name: name, // Keep commented as per your request
            real_name: real_name,
            native_name: native_name,
            // slug: slug,
            birth_date: birth_date,
            image_url: imageSupabaseUrl,
            social_media: snsLinks,
            wiki_page_id: fetchedPageId, // Ensure we save the numeric ID
            wiki_last_updated: wiki_last_updated,
            last_synced_at: now
        };

        if (id) {
            const { error } = await supabase
                .from('idols')
                .update(payload)
                .eq('id', id);

            if (error) throw error;
        }

        console.log(`✅ Scraped: ${idolName}`);

    } catch (error) {
        console.error(`❌ Error scraping ${idolName}:`, error);

        // Force update timestamp on error so we don't retry immediately
        if (id) {
            await supabase.from('idols').update({ last_synced_at: new Date().toISOString() }).eq('id', id);
        }
        return null;
    }
}